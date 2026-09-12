"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { validateImageFile, canonicalizeText } from "@/lib/security";

interface PhotoboothProps {
  teamName: string;
  participantName?: string;
}

export default function Photobooth({ teamName, participantName }: PhotoboothProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canShare, setCanShare] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load frame image on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/frames/haxtreme-frame.png";
    img.onload = () => setFrameImage(img);

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // OWASP Security: File upload validation (MIME, size, magic bytes)
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setUserImage(img);
      setOffset({ x: 0, y: 0 });
      setZoom(1);
    };
    img.onerror = () => {
      setUploadError("Could not decode image. Please choose another photo.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and fill background
    ctx.fillStyle = "#0E100F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw user image if available
    if (userImage) {
      ctx.save();

      // Calculate cover fit
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = userImage.width / userImage.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (canvasAspect > imgAspect) {
        drawHeight = canvas.width / imgAspect;
      } else {
        drawWidth = canvas.height * imgAspect;
      }

      // Apply zoom and offset
      const finalWidth = drawWidth * zoom;
      const finalHeight = drawHeight * zoom;

      const x = (canvas.width - finalWidth) / 2 + offset.x;
      const y = (canvas.height - finalHeight) / 2 + offset.y;

      ctx.drawImage(userImage, x, y, finalWidth, finalHeight);
      ctx.restore();
    }

    // Draw frame overlay
    if (frameImage) {
      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw text with sanitized content (prevent control character exploits)
    ctx.textAlign = "center";

    // Draw team name (truncated to max 40 chars)
    const sanitizedTeam = canonicalizeText(teamName).substring(0, 40).toUpperCase();
    ctx.font = 'bold 42px "Space Mono", monospace';
    ctx.fillStyle = "#0ae448";
    ctx.shadowColor = "rgba(10,228,72,0.5)";
    ctx.shadowBlur = 12;
    ctx.fillText(sanitizedTeam, canvas.width / 2, canvas.height - 120);

    // Draw participant name if provided
    if (participantName) {
      const sanitizedParticipant = canonicalizeText(participantName).substring(0, 60);
      ctx.shadowBlur = 0;
      ctx.font = '24px "Space Mono", monospace';
      ctx.fillStyle = "#bbbaa6";
      ctx.fillText(sanitizedParticipant, canvas.width / 2, canvas.height - 70);
    }
  }, [userImage, frameImage, zoom, offset, teamName, participantName]);

  useEffect(() => {
    requestAnimationFrame(drawCanvas);
  }, [drawCanvas]);

  // Drag logic
  const handleDragStart = (clientX: number, clientY: number) => {
    if (!userImage) return;
    setIsDragging(true);
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !userImage) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scaleX = 1080 / rect.width;
    const scaleY = 1080 / rect.height;

    setOffset({
      x: (clientX - dragStart.x * scaleX) / scaleX,
      y: (clientY - dragStart.y * scaleY) / scaleY,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX, e.clientY);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  // Prevent default touch behavior to stop scrolling
  useEffect(() => {
    const container = containerRef.current;
    const preventDefault = (e: TouchEvent) => {
      if (isDragging) e.preventDefault();
    };

    if (container) {
      container.addEventListener("touchmove", preventDefault, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchmove", preventDefault);
      }
    };
  }, [isDragging]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const safeTeam = canonicalizeText(teamName).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${safeTeam}_haxtreme5.png`;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.share) return;

    const safeTeam = canonicalizeText(teamName).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${safeTeam}_haxtreme5.png`;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `HaXtreme 5.0 - ${teamName}`,
            text: "Check out our team at HaXtreme 5.0!",
            files: [file],
          });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      }
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {uploadError && (
        <div className="w-full p-3 bg-red-500/10 border border-red-500 text-red-400 text-xs font-['Space_Mono',monospace]">
          [ERROR]: {uploadError}
        </div>
      )}

      {/* SHARP CORNERS: rounded-none */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-[#191919] hover:bg-[#252525] text-[#bbbaa6] border border-[#42433d] px-6 py-3 text-xs font-['Space_Mono',monospace] uppercase tracking-wider transition-colors rounded-none w-full sm:w-auto"
      >
        {userImage ? "Change Photo" : "Upload Photo"}
      </button>

      {/* SHARP CORNERS: rounded-none */}
      <div
        ref={containerRef}
        className={`relative w-full max-w-[420px] aspect-square rounded-none overflow-hidden border border-[#42433d] bg-black shadow-2xl ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleDragEnd}
        onTouchCancel={handleDragEnd}
      >
        <canvas
          ref={canvasRef}
          width={1080}
          height={1080}
          className="w-full h-full object-cover touch-none pointer-events-none rounded-none"
        />
        {!userImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[#bbbaa6]/50 font-['Space_Mono',monospace] text-xs text-center px-4 leading-relaxed">
              Upload a photo to preview
              <br />
              Drag to pan, use slider to zoom
            </span>
          </div>
        )}
      </div>

      {userImage && (
        <div className="w-full max-w-[420px] flex flex-col gap-2">
          <label className="text-xs text-[#bbbaa6] font-['Space_Mono',monospace] flex justify-between">
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[#0ae448] photobooth-slider rounded-none"
          />
        </div>
      )}

      {/* SHARP CORNERS: rounded-none */}
      <div className="w-full max-w-[420px] flex flex-col gap-3 mt-2">
        <button
          onClick={handleDownload}
          disabled={!userImage}
          className="w-full py-3.5 rounded-none font-extrabold text-black uppercase tracking-wider text-xs font-['Space_Mono',monospace] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/10 transition-all border border-[#0ae448]"
          style={{ background: "var(--grad-macha)" }}
        >
          Download Official Badge (PNG)
        </button>

        {canShare && (
          <button
            onClick={handleShare}
            disabled={!userImage}
            className="w-full py-3.5 rounded-none font-bold uppercase tracking-wider bg-transparent border border-[#0ae448] text-[#0ae448] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-['Space_Mono',monospace] transition-all hover:bg-[#0ae448]/10"
          >
            Share Badge
          </button>
        )}
      </div>
    </div>
  );
}
