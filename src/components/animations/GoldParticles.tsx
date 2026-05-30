"use client";

import { useEffect, useRef } from "react";

export default function GoldParticles({ count = 40 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class Sparkle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      pulseSpeed: number;
      pulseAngle: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1); // float upwards
        this.speedX = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulseAngle += this.pulseSpeed;

        // Reset if floats off top
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }

        // Keep horizontal within bounds
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }

      draw() {
        if (!ctx) return;
        const currentOpacity = this.opacity * (Math.sin(this.pulseAngle) * 0.3 + 0.7);
        
        ctx.save();
        ctx.beginPath();
        
        // Draw standard small glowing radial gradient for sparkles
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `rgba(251, 246, 223, ${currentOpacity})`);
        gradient.addColorStop(0.3, `rgba(212, 163, 37, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, "rgba(212, 163, 37, 0)");
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const sparkles: Sparkle[] = [];
    for (let i = 0; i < count; i++) {
      sparkles.push(new Sparkle());
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < sparkles.length; i++) {
        sparkles[i].update();
        sparkles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 block bg-[#080708]"
    />
  );
}
