"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const MEMORY_IMAGES = [
  "/Memories/image 998.jpg",
  "/Memories/image 999.jpg",
  "/Memories/image 1000.jpg",
  "/Memories/image 1045.jpg",
  "/Memories/407304759_770490495091274_2613428125469826788_n 1.jpg",
  "/Memories/407304759_770490495091274_2613428125469826788_n 4.jpg",
  "/Memories/407308659_770490305091293_2712908387265516032_n 1.jpg",
  "/Memories/407308659_770490305091293_2712908387265516032_n 2.jpg",
  "/Memories/407353251_770491348424522_8014008165630634164_n 1.jpg",
  "/Memories/407362513_770490528424604_1559419601375149637_n 1.jpg",
  "/Memories/407362513_770490528424604_1559419601375149637_n 2.jpg",
  "/Memories/407413189_770490661757924_2208827396625310375_n 1.jpg",
  "/Memories/407413189_770490661757924_2208827396625310375_n 2.jpg",
  "/Memories/401485383_770490771757913_7353613965438145222_n 1.jpg",
];

// Shared velocity proxy for all canvas instances
const velocityProxy = { v: 0, s: 0 };
const clamp = gsap.utils.clamp(-2000, 2000);

const VERT_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vUvCover;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;

  void main(){
    vUv = aPosition * 0.5 + 0.5;
    vUv.y = 1.0 - vUv.y; // Flip Y for WebGL texture coords

    float texR = uTextureSize.x / uTextureSize.y;
    float quadR = uQuadSize.x / uQuadSize.y;
    vec2 s = vec2(1.0);
    if (quadR > texR) {
      s.y = texR / quadR;
    } else {
      s.x = quadR / texR;
    }
    vUvCover = vUv * s + (1.0 - s) * 0.5;

    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAG_SHADER = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uVelocityStrength;

  varying vec2 vUv;
  varying vec2 vUvCover;

  void main() {
    vec2 texCoords = vUvCover;

    // drive distortion amount from velocity strength
    float amt = 0.035 * uVelocityStrength;

    // wave oscillation
    float t = uTime * 0.8;
    texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
    texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.6;

    // chromatic aberration based on scroll direction
    float dir = sign(uScrollVelocity);
    if (dir == 0.0) dir = 1.0;
    vec2 tc = texCoords;

    float r = texture2D(uTexture, tc + vec2( amt * 0.50 * dir, 0.0)).r;
    float g = texture2D(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
    float b = texture2D(uTexture, tc + vec2(-amt * 0.35 * dir, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function ShaderPhotoCard({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    function createShader(type: number, source: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vert = createShader(gl.VERTEX_SHADER, VERT_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Quad geometry (-1 to 1)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTextureSize = gl.getUniformLocation(program, "uTextureSize");
    const uQuadSize = gl.getUniformLocation(program, "uQuadSize");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uScrollVelocity = gl.getUniformLocation(program, "uScrollVelocity");
    const uVelocityStrength = gl.getUniformLocation(program, "uVelocityStrength");

    // Texture loading
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let isTextureLoaded = false;
    let texWidth = 1;
    let texHeight = 1;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (!gl) return;
      texWidth = img.naturalWidth || 1;
      texHeight = img.naturalHeight || 1;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      isTextureLoaded = true;
      resize();
    };

    function resize() {
      if (!canvas || !container || !gl) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let lastTime = performance.now();
    let totalTime = 0;

    const renderLoop = (now: number) => {
      if (!gl || !canvas || !isTextureLoaded) return;
      const dt = (now - lastTime) * 0.001;
      lastTime = now;
      totalTime += dt;

      gl.useProgram(program);
      gl.uniform2f(uTextureSize, texWidth, texHeight);
      gl.uniform2f(uQuadSize, canvas.width, canvas.height);
      gl.uniform1f(uTime, totalTime);
      gl.uniform1f(uScrollVelocity, velocityProxy.v);
      gl.uniform1f(uVelocityStrength, velocityProxy.s);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    gsap.ticker.add(renderLoop);

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(renderLoop);
      if (gl) {
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [src]);

  return (
    <div className="w-[85vw] sm:w-[65vw] md:w-[55vw] lg:w-[46vw] xl:w-[42vw] max-w-[640px] shrink-0 p-2.5 border border-dashed border-[#272d2a] hover:border-[#3a423e] transition-colors duration-300">
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-video overflow-hidden bg-[#131514] shadow-2xl"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      </div>
    </div>
  );
}

export default function MemoryLane() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pinWrap = stripRef.current;
      if (!section || !pinWrap) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const getScrollLength = () => Math.max(0, pinWrap.scrollWidth - window.innerWidth);

      // Master Horizontal Scroll and Velocity Tracking
      const tween = gsap.to(pinWrap, {
        x: () => -getScrollLength(),
        ease: "none",
        scrollTrigger: {
          id: "memory-lane-horizontal",
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${getScrollLength()}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const raw = clamp(self.getVelocity());
            const norm = raw / 1000;
            const strength = Math.min(1, Math.abs(norm));

            if (Math.abs(strength) > Math.abs(velocityProxy.s)) {
              velocityProxy.v = norm;
              velocityProxy.s = strength;
              gsap.to(velocityProxy, {
                v: 0,
                s: 0,
                duration: 0.8,
                ease: "sine.inOut",
                overwrite: true,
              });
            }
          },
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);
      const t1 = setTimeout(refresh, 200);
      const t2 = setTimeout(refresh, 600);

      return () => {
        window.removeEventListener("resize", refresh);
        clearTimeout(t1);
        clearTimeout(t2);
        tween.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="memory-lane"
      className="w-full relative h-screen bg-[#0e100f] text-white overflow-hidden select-none flex items-center"
    >
      {/* Horizontal Scrolling Gallery Strip */}
      <div
        ref={stripRef}
        className="flex items-center gap-8 sm:gap-12 flex-nowrap will-change-transform pl-8 sm:pl-16 lg:pl-24 pr-16 sm:pr-24 lg:pr-32"
      >
        {/* Intro Narrative Card */}
        <div className="w-[85vw] sm:w-[48vw] md:w-[35vw] lg:w-[26vw] max-w-[380px] shrink-0 flex flex-col justify-center space-y-6 pr-4 sm:pr-8">
          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.02]"
            style={{
              fontFamily:
                '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Memory Lane
          </h2>

          <div className="space-y-4 font-space-mono text-gray-300 text-sm sm:text-base leading-relaxed">
            <p>
              A journey through the legacy of HaXtreme. Revisit the moments,
              debugging sessions, and celebrations from past editions.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 font-space-mono text-xs text-[#0ae448]">
            <span>SCROLL TO EXPLORE</span>
            <span className="text-lg leading-none">→</span>
          </div>
        </div>

        {/* Horizontal Photo Cards */}
        {MEMORY_IMAGES.map((src) => (
          <ShaderPhotoCard key={src} src={src} />
        ))}
      </div>
    </section>
  );
}
