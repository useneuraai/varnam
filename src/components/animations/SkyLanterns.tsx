"use client";

import React, { useEffect, useRef } from "react";

interface SkyLanternsProps {
  count?: number;
}

interface Lantern {
  x: number;
  y: number;
  width: number;
  height: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayDistance: number;
  swayOffset: number;
  opacity: number;
  hue: "pink" | "orange" | "yellow";
}

export default function SkyLanterns({ count = 18 }: SkyLanternsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize lanterns
    const lanterns: Lantern[] = [];
    const isMobile = window.innerWidth < 768;
    const actualCount = isMobile ? Math.min(count, 8) : count;
    const hues: Array<"pink" | "orange" | "yellow"> = ["pink", "pink", "orange", "yellow"];

    for (let i = 0; i < actualCount; i++) {
      const w = Math.random() * 26 + 32; // 32 to 58 px
      lanterns.push({
        x: Math.random() * width,
        y: Math.random() * height,
        width: w,
        height: w * 1.38,
        speedY: Math.random() * 0.45 + 0.3,
        speedX: (Math.random() - 0.5) * 0.15,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayDistance: Math.random() * 25 + 12,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.35 + 0.65,
        hue: hues[Math.floor(Math.random() * hues.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      lanterns.forEach((l) => {
        // Update position
        l.y -= l.speedY;
        l.swayOffset += l.swaySpeed;
        const currentX = l.x + Math.sin(l.swayOffset) * l.swayDistance;

        // Reset if floated above screen
        if (l.y < -l.height - 40) {
          l.y = height + 40;
          l.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(currentX, l.y);

        // Subtle tilt from sway
        const tilt = Math.cos(l.swayOffset) * 0.04;
        ctx.rotate(tilt);

        ctx.globalAlpha = l.opacity;

        // Draw lantern trapezoid / soft rounded bell shape
        ctx.beginPath();
        const topW = l.width * 0.68;
        const botW = l.width * 0.88;
        const midW = l.width;

        ctx.moveTo(-topW / 2, 0);
        ctx.bezierCurveTo(-midW / 2, l.height * 0.35, -botW / 2, l.height * 0.85, -botW / 2, l.height);
        ctx.lineTo(botW / 2, l.height);
        ctx.bezierCurveTo(botW / 2, l.height * 0.85, midW / 2, l.height * 0.35, topW / 2, 0);
        ctx.closePath();

        // Warm glowing lantern gradient fill
        const bodyGrad = ctx.createLinearGradient(0, l.height, 0, 0);
        if (l.hue === "pink") {
          bodyGrad.addColorStop(0, "#ffffff");
          bodyGrad.addColorStop(0.3, "#fbcfe8");
          bodyGrad.addColorStop(0.7, "#f472b6");
          bodyGrad.addColorStop(1, "#db2777");
        } else if (l.hue === "orange") {
          bodyGrad.addColorStop(0, "#ffffff");
          bodyGrad.addColorStop(0.35, "#ffedd5");
          bodyGrad.addColorStop(0.75, "#fb923c");
          bodyGrad.addColorStop(1, "#ea580c");
        } else {
          bodyGrad.addColorStop(0, "#ffffff");
          bodyGrad.addColorStop(0.4, "#fef08a");
          bodyGrad.addColorStop(0.8, "#facc15");
          bodyGrad.addColorStop(1, "#ca8a04");
        }

        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // Delicate paper rim lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner glowing core flame (fast alpha fill without heavy shadowBlur)
        ctx.beginPath();
        ctx.arc(0, l.height * 0.65, l.width * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
}
