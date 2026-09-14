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
    const hues: Array<"pink" | "orange" | "yellow"> = ["pink", "pink", "orange", "yellow"];

    for (let i = 0; i < count; i++) {
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
        ctx.globalAlpha = l.opacity;

        // Draw soft ambient outer glow
        const glowGrad = ctx.createRadialGradient(
          l.width / 2,
          l.height / 2,
          l.width * 0.2,
          l.width / 2,
          l.height / 2,
          l.width * 1.1
        );
        if (l.hue === "pink") {
          glowGrad.addColorStop(0, "rgba(255, 230, 240, 0.65)");
          glowGrad.addColorStop(0.5, "rgba(244, 114, 182, 0.35)");
          glowGrad.addColorStop(1, "rgba(236, 72, 153, 0)");
        } else if (l.hue === "orange") {
          glowGrad.addColorStop(0, "rgba(255, 245, 215, 0.7)");
          glowGrad.addColorStop(0.5, "rgba(251, 146, 60, 0.4)");
          glowGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
        } else {
          glowGrad.addColorStop(0, "rgba(255, 255, 230, 0.7)");
          glowGrad.addColorStop(0.5, "rgba(250, 204, 21, 0.4)");
          glowGrad.addColorStop(1, "rgba(234, 179, 8, 0)");
        }

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(l.width / 2, l.height / 2, l.width * 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Draw rounded cylindrical paper lantern body
        const rx = 8;
        const ry = 8;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(l.width - rx, 0);
        ctx.quadraticCurveTo(l.width, 0, l.width, ry);
        ctx.lineTo(l.width, l.height - ry);
        ctx.quadraticCurveTo(l.width, l.height, l.width - rx, l.height);
        ctx.lineTo(rx, l.height);
        ctx.quadraticCurveTo(0, l.height, 0, l.height - ry);
        ctx.lineTo(0, ry);
        ctx.quadraticCurveTo(0, 0, rx, 0);
        ctx.closePath();

        // Inner luminous flame gradient
        const bodyGrad = ctx.createLinearGradient(0, 0, 0, l.height);
        if (l.hue === "pink") {
          bodyGrad.addColorStop(0, "#ffffff");
          bodyGrad.addColorStop(0.3, "#fed7aa");
          bodyGrad.addColorStop(0.65, "#f472b6");
          bodyGrad.addColorStop(1, "#db2777");
        } else if (l.hue === "orange") {
          bodyGrad.addColorStop(0, "#ffffff");
          bodyGrad.addColorStop(0.3, "#fef08a");
          bodyGrad.addColorStop(0.7, "#fb923c");
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

        // Inner glowing core flame
        ctx.beginPath();
        ctx.arc(l.width / 2, l.height * 0.65, l.width * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#fef08a";
        ctx.shadowBlur = 8;
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
      className="fixed inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
