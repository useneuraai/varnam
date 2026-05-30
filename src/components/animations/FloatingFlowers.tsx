"use client";

import { useEffect, useRef } from "react";

interface FloatingFlowersProps {
  type?: "jasmine" | "rose" | "gold" | "sparkle";
  count?: number;
}

export default function FloatingFlowers({ type = "jasmine", count = 35 }: FloatingFlowersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      oscillationSpeed: number;
      oscillationDistance: number;
      angle: number;

      constructor() {
        this.x = Math.random() * width;
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.oscillationDistance = Math.random() * 30 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.opacity = Math.random() * 0.5 + 0.3;

        if (type === "sparkle") {
          this.y = Math.random() * height; // Distribute across screen height initially
          this.size = Math.random() * 1.5 + 0.5; // small glowing stars
          this.speedY = -(Math.random() * 0.4 + 0.1); // float upwards
          this.speedX = Math.random() * 0.2 - 0.1;
        } else {
          this.y = Math.random() * -height; // Start off-screen
          this.size = Math.random() * 10 + 6;
          this.speedY = Math.random() * 1.2 + 0.8;
          this.speedX = Math.random() * 0.4 - 0.2;
        }
      }

      reset() {
        this.x = Math.random() * width;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.angle = Math.random() * Math.PI * 2;

        if (type === "sparkle") {
          this.y = height + 10; // Reset at the bottom
          this.size = Math.random() * 1.5 + 0.5;
          this.speedY = -(Math.random() * 0.4 + 0.1);
          this.speedX = Math.random() * 0.2 - 0.1;
        } else {
          this.y = -20; // Reset at the top
          this.size = Math.random() * 10 + 6;
          this.speedY = Math.random() * 1.2 + 0.8;
          this.speedX = Math.random() * 0.4 - 0.2;
        }
      }

      update() {
        this.y += this.speedY;
        this.angle += this.oscillationSpeed;
        
        if (type === "sparkle") {
          this.x += this.speedX + Math.sin(this.angle) * 0.2;
        } else {
          this.x += this.speedX + Math.sin(this.angle) * 0.5;
        }
        
        this.rotation += this.rotationSpeed;

        if (type === "sparkle") {
          if (this.y < -20) {
            this.reset();
          }
        } else {
          if (this.y > height + 20) {
            this.reset();
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (type === "rose") {
          // Soft crimson/pink rose petals
          ctx.fillStyle = "rgba(186, 26, 48, 0.8)";
          ctx.strokeStyle = "rgba(139, 0, 21, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Draw a teardrop/heart shape representing a petal
          ctx.moveTo(0, -this.size / 2);
          ctx.bezierCurveTo(
            this.size / 2, -this.size, 
            this.size, -this.size / 3, 
            this.size / 2, this.size / 2
          );
          ctx.bezierCurveTo(
            0, this.size, 
            -this.size, this.size / 2, 
            -this.size / 2, -this.size / 3
          );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (type === "jasmine") {
          // Off-white traditional jasmine blossoms
          ctx.fillStyle = "#fffff5";
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(212, 163, 37, 0.2)";
          
          // Draw four delicate petals
          for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.ellipse(0, this.size / 2, this.size / 4, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Gold/yellow center dot
          ctx.fillStyle = "#eed57c";
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "sparkle") {
          // Glowing star sparkle
          const shimmer = Math.sin(this.angle) * 0.3 + 0.7;
          const currentOpacity = this.opacity * shimmer;
          
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 3);
          gradient.addColorStop(0, `rgba(251, 246, 223, ${currentOpacity})`);
          gradient.addColorStop(0.3, `rgba(234, 179, 79, ${currentOpacity * 0.6})`);
          gradient.addColorStop(1, "rgba(234, 179, 79, 0)");
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Gold leaf flakes (rectangular/diamond shape with shimmer)
          const shimmer = Math.sin(this.rotation * 4) * 0.3 + 0.7;
          
          // Luxury gold gradient fill
          const grad = ctx.createLinearGradient(
            -this.size / 2, 
            -this.size / 2, 
            this.size / 2, 
            this.size / 2
          );
          grad.addColorStop(0, `rgba(251, 246, 223, ${this.opacity * shimmer})`);
          grad.addColorStop(0.5, `rgba(212, 163, 37, ${this.opacity * shimmer})`);
          grad.addColorStop(1, `rgba(143, 96, 24, ${this.opacity * shimmer})`);
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, 0);
          ctx.lineTo(0, this.size / 2);
          ctx.lineTo(-this.size / 2, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
      // Distribute initial positions
      particles[i].y = Math.random() * height;
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 block"
    />
  );
}
