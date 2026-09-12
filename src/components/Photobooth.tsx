"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { validateImageFile, canonicalizeText } from "@/lib/security";

export interface PhotoboothProps {
  teamName: string;
  participantName?: string;
  rank?: number | string;
  totalTeams?: number | string;
  status?: string;
}

// Exact dimensions from Figma node 3218:1764
const CANVAS_WIDTH = 1112;
const CANVAS_HEIGHT = 1273;
const PHOTO_X = 16;
const PHOTO_Y = 88;
const PHOTO_SIZE = 1080;

export default function Photobooth({
  teamName,
  participantName,
  rank,
  totalTeams,
  status = "FINALIST",
}: PhotoboothProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffsetStart, setDragOffsetStart] = useState({ x: 0, y: 0 });
  const [canShare, setCanShare] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load the exact Figma frame overlay
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/frames/haxtreme-frame-v1.png";
    img.onload = () => {
      setFrameImage(img);
      setFrameLoaded(true);
    };
    img.onerror = () => {
      // Fallback to haxtreme-frame.png if v1 fails
      const fallback = new Image();
      fallback.crossOrigin = "anonymous";
      fallback.src = "/frames/haxtreme-frame.png";
      fallback.onload = () => {
        setFrameImage(fallback);
        setFrameLoaded(true);
      };
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

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

    // 1. Background fill
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, CANVAS_WIDTH, 1184);

    // Bottom sponsor bar area background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 1184, CANVAS_WIDTH, CANVAS_HEIGHT - 1184);

    // 2. User image rendering (clipped strictly to 1080x1080 area)
    ctx.save();
    ctx.beginPath();
    ctx.rect(PHOTO_X, PHOTO_Y, PHOTO_SIZE, PHOTO_SIZE);
    ctx.clip();

    if (userImage) {
      const imgAspect = userImage.width / userImage.height;
      let baseW = PHOTO_SIZE;
      let baseH = PHOTO_SIZE;

      if (imgAspect > 1) {
        baseW = PHOTO_SIZE * imgAspect;
      } else {
        baseH = PHOTO_SIZE / imgAspect;
      }

      const finalW = baseW * zoom;
      const finalH = baseH * zoom;

      const imgX = PHOTO_X + (PHOTO_SIZE - finalW) / 2 + offset.x;
      const imgY = PHOTO_Y + (PHOTO_SIZE - finalH) / 2 + offset.y;

      ctx.drawImage(userImage, imgX, imgY, finalW, finalH);
    } else {
      // Sleek placeholder when no user photo uploaded
      ctx.fillStyle = "#111311";
      ctx.fillRect(PHOTO_X, PHOTO_Y, PHOTO_SIZE, PHOTO_SIZE);

      // Decorative corner brackets
      ctx.strokeStyle = "#42433d";
      ctx.lineWidth = 2;
      const margin = 40;
      const len = 30;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(PHOTO_X + margin, PHOTO_Y + margin + len);
      ctx.lineTo(PHOTO_X + margin, PHOTO_Y + margin);
      ctx.lineTo(PHOTO_X + margin + len, PHOTO_Y + margin);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(PHOTO_X + PHOTO_SIZE - margin - len, PHOTO_Y + margin);
      ctx.lineTo(PHOTO_X + PHOTO_SIZE - margin, PHOTO_Y + margin);
      ctx.lineTo(PHOTO_X + PHOTO_SIZE - margin, PHOTO_Y + margin + len);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(PHOTO_X + margin, PHOTO_Y + PHOTO_SIZE - margin - len);
      ctx.lineTo(PHOTO_X + margin, PHOTO_Y + PHOTO_SIZE - margin);
      ctx.lineTo(PHOTO_X + margin + len, PHOTO_Y + PHOTO_SIZE - margin);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(PHOTO_X + PHOTO_SIZE - margin - len, PHOTO_Y + PHOTO_SIZE - margin);
      ctx.lineTo(PHOTO_X + PHOTO_SIZE - margin, PHOTO_Y + PHOTO_SIZE - margin);
      ctx.lineTo(PHOTO_X + PHOTO_SIZE - margin, PHOTO_Y + PHOTO_SIZE - margin - len);
      ctx.stroke();

      // Placeholder prompt
      ctx.font = '24px "Space Mono", monospace';
      ctx.fillStyle = "#7c7c6f";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SELECT OR DROP TEAM PHOTO", PHOTO_X + PHOTO_SIZE / 2, PHOTO_Y + PHOTO_SIZE / 2 - 20);
      ctx.font = '18px "Space Mono", monospace';
      ctx.fillStyle = "#4a4b44";
      ctx.fillText("DRAG TO PAN // SLIDER TO ZOOM", PHOTO_X + PHOTO_SIZE / 2, PHOTO_Y + PHOTO_SIZE / 2 + 22);
    }

    // 3. Bottom vignette gradient inside photo viewport (y from 633 to 1168)
    const gradient = ctx.createLinearGradient(0, 633, 0, PHOTO_Y + PHOTO_SIZE);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.35, "rgba(0, 0, 0, 0.4)");
    gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.85)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.98)");
    ctx.fillStyle = gradient;
    ctx.fillRect(PHOTO_X, 633, PHOTO_SIZE, PHOTO_Y + PHOTO_SIZE - 633);

    ctx.restore();

    // 4. Draw master Figma frame overlay (Header + Borders + Sponsor Bar)
    if (frameImage) {
      ctx.drawImage(frameImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 5. Draw dynamic text overlay at the bottom of the photo box
    ctx.save();
    ctx.font = 'bold 24px "Space Mono", monospace';
    ctx.textBaseline = "middle";

    const textY = PHOTO_Y + PHOTO_SIZE - 28;

    // Left text: "THINK. CODE. CONQUER."
    let leftX = PHOTO_X + 24;
    const leftParts = [
      { text: "THINK", color: "#f2f2f2" },
      { text: ".", color: "#00ff1d" },
      { text: " CODE", color: "#f2f2f2" },
      { text: ".", color: "#00ff1d" },
      { text: " CONQUER", color: "#f2f2f2" },
      { text: ".", color: "#00ff1d" },
    ];
    for (const part of leftParts) {
      ctx.fillStyle = part.color;
      ctx.fillText(part.text, leftX, textY);
      leftX += ctx.measureText(part.text).width;
    }

    // Right text: "Team {Name} • [Rank] / [All teams]" or "Team {Name} • FINALIST"
    const safeTeam = canonicalizeText(teamName || "Team").substring(0, 22);
    const rightParts: { text: string; color: string }[] = [
      { text: `Team ${safeTeam} `, color: "#f2f2f2" },
      { text: "•", color: "#00ff1d" },
    ];

    if (rank) {
      rightParts.push({ text: ` ${rank} / ${totalTeams || "All teams"}`, color: "#f2f2f2" });
    } else if (participantName) {
      const safeParticipant = canonicalizeText(participantName).substring(0, 18);
      rightParts.push({ text: ` ${safeParticipant}`, color: "#f2f2f2" });
    } else {
      rightParts.push({ text: ` ${status.toUpperCase()}`, color: "#f2f2f2" });
    }

    const totalRightWidth = rightParts.reduce(
      (sum, part) => sum + ctx.measureText(part.text).width,
      0
    );
    let rightX = PHOTO_X + PHOTO_SIZE - 24 - totalRightWidth;

    for (const part of rightParts) {
      ctx.fillStyle = part.color;
      ctx.fillText(part.text, rightX, textY);
      rightX += ctx.measureText(part.text).width;
    }

    ctx.restore();
  }, [userImage, frameImage, zoom, offset, teamName, participantName, rank, totalTeams, status]);

  useEffect(() => {
    requestAnimationFrame(drawCanvas);
  }, [drawCanvas, frameLoaded]);

  // Drag interaction logic with screen-to-canvas coordinate transformation
  const handleDragStart = (clientX: number, clientY: number) => {
    if (!userImage) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragOffsetStart({ x: offset.x, y: offset.y });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !userImage) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scale = CANVAS_WIDTH / rect.width;
    const dx = (clientX - dragStart.x) * scale;
    const dy = (clientY - dragStart.y) * scale;

    setOffset({
      x: dragOffsetStart.x + dx,
      y: dragOffsetStart.y + dy,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX, e.clientY);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  // Prevent browser touch scroll while dragging inside photobooth
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

    const safeTeam = canonicalizeText(teamName || "team").replace(/[^a-zA-Z0-9_-]/g, "_");
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

    const safeTeam = canonicalizeText(teamName || "team").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${safeTeam}_haxtreme5.png`;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `HaXtreme 5.0 - Team ${teamName}`,
            text: `Check out our official pass for HaXtreme 5.0!`,
            files: [file],
          });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      }
    }, "image/png");
  };

  const resetPosition = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto select-none">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {uploadError && (
        <div className="w-full p-3 bg-red-500/10 border border-red-500 text-red-400 text-xs font-['Space_Mono',monospace] rounded-none">
          [ERROR]: {uploadError}
        </div>
      )}

      {/* Action Buttons: Upload & Reset */}
      <div className="w-full flex items-center justify-between gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-[#191919] hover:bg-[#252525] text-[#bbbaa6] hover:text-white border border-[#42433d] px-4 py-2.5 text-xs font-['Space_Mono',monospace] uppercase tracking-wider transition-colors rounded-none text-center"
        >
          {userImage ? "Change Photo" : "Upload Photo"}
        </button>

        {userImage && (
          <button
            onClick={resetPosition}
            className="bg-[#191919] hover:bg-[#252525] text-[#bbbaa6] hover:text-white border border-[#42433d] px-4 py-2.5 text-xs font-['Space_Mono',monospace] uppercase tracking-wider transition-colors rounded-none"
            title="Reset position and zoom"
          >
            Reset
          </button>
        )}
      </div>

      {/* Interactive Frame Canvas Preview */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-[1112/1273] rounded-none overflow-hidden border border-[#42433d] bg-[#050505] shadow-2xl ${
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
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full object-contain touch-none pointer-events-none rounded-none"
        />
      </div>

      {/* Zoom Slider */}
      {userImage && (
        <div className="w-full flex flex-col gap-1.5 px-1">
          <div className="flex justify-between items-center text-xs text-[#bbbaa6] font-['Space_Mono',monospace]">
            <span>ZOOM</span>
            <span className="text-[#0ae448]">{Math.round(zoom * 100)}%</span>
          </div>
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

      {/* Export Controls */}
      <div className="w-full flex flex-col gap-2.5 mt-1">
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
            className="w-full py-3 rounded-none font-bold uppercase tracking-wider bg-transparent border border-[#0ae448] text-[#0ae448] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-['Space_Mono',monospace] transition-all hover:bg-[#0ae448]/10"
          >
            Share Badge
          </button>
        )}
      </div>
    </div>
  );
}
