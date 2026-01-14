"use client"

import { useEffect, useRef } from 'react';

export type CursorEffect = 'brush' | 'splash' | 'water' | 'smoke' | 'none';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  pressure?: number;
}

interface InkCursorProps {
  effect: CursorEffect;
}

export function InkCursor({ effect }: InkCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const brushPoints = useRef<{ x: number; y: number; pressure: number }[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (effect === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler - different for each effect
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.min(distance, 20);

      if (distance > 1) {
        switch (effect) {
          case 'brush':
            handleBrushEffect(e, speed);
            break;
          case 'splash':
            handleSplashEffect(e, distance);
            break;
          case 'water':
            handleWaterEffect(e, speed);
            break;
          case 'smoke':
            handleSmokeEffect(e, speed);
            break;
        }
      }

      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    // BRUSH EFFECT - Calligraphy stroke
    const handleBrushEffect = (e: MouseEvent, speed: number) => {
      const pressure = Math.max(0.3, 1 - speed / 20);
      
      brushPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        pressure: pressure
      });

      if (brushPoints.current.length > 30) {
        brushPoints.current.shift();
      }
    };

    // SPLASH EFFECT - Ink drops splattering
    const handleSplashEffect = (e: MouseEvent, distance: number) => {
      const numDrops = Math.floor(distance / 10) + 1;
      
      for (let i = 0; i < numDrops; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 8 + 4,
          opacity: 0.8,
          life: 0,
          maxLife: 60 + Math.random() * 60
        });
      }
    };

    // WATER EFFECT - Ink dispersing in water (sumi-e)
    const handleWaterEffect = (e: MouseEvent, speed: number) => {
      const numParticles = Math.floor(speed / 2) + 2;
      
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 1.5;
        
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * 30 + 15,
          opacity: 0.3,
          life: 0,
          maxLife: 90 + Math.random() * 60
        });
      }
    };

    // SMOKE EFFECT - Ethereal mist trail
    const handleSmokeEffect = (e: MouseEvent, speed: number) => {
      const numSmoke = Math.floor(speed / 3) + 1;
      
      for (let i = 0; i < numSmoke; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 15,
          y: e.clientY + (Math.random() - 0.5) * 15,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 1.5 - 0.5, // Upward drift
          size: Math.random() * 40 + 20,
          opacity: 0.4,
          life: 0,
          maxLife: 120 + Math.random() * 60
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (effect) {
        case 'brush':
          drawBrushStrokes(ctx);
          break;
        case 'splash':
          drawSplashParticles(ctx);
          break;
        case 'water':
          drawWaterInk(ctx);
          break;
        case 'smoke':
          drawSmokeTrail(ctx);
          break;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Draw functions for each effect
    const drawBrushStrokes = (ctx: CanvasRenderingContext2D) => {
      if (brushPoints.current.length < 2) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 1; i < brushPoints.current.length; i++) {
        const p1 = brushPoints.current[i - 1];
        const p2 = brushPoints.current[i];
        const width = 15 * ((p1.pressure + p2.pressure) / 2);

        ctx.strokeStyle = `rgba(26, 26, 26, 0.7)`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Fade out brush points
      if (brushPoints.current.length > 20) {
        brushPoints.current = brushPoints.current.slice(-20);
      }
    };

    const drawSplashParticles = (ctx: CanvasRenderingContext2D) => {
      particles.current = particles.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        
        const lifeRatio = p.life / p.maxLife;
        p.opacity = 0.8 * (1 - lifeRatio);

        // Draw splatter drop
        ctx.fillStyle = `rgba(26, 26, 26, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fill();

        return p.life < p.maxLife;
      });
    };

    const drawWaterInk = (ctx: CanvasRenderingContext2D) => {
      particles.current = particles.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98; // Slow down
        p.vy *= 0.98;
        
        const lifeRatio = p.life / p.maxLife;
        p.opacity = 0.3 * (1 - lifeRatio);
        const currentSize = p.size * (1 + lifeRatio * 2); // Expand

        // Draw water diffusion with gradient
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize);
        gradient.addColorStop(0, `rgba(26, 26, 26, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(47, 54, 64, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(47, 54, 64, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        return p.life < p.maxLife;
      });
    };

    const drawSmokeTrail = (ctx: CanvasRenderingContext2D) => {
      particles.current = particles.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.1; // Turbulence
        
        const lifeRatio = p.life / p.maxLife;
        p.opacity = 0.4 * (1 - lifeRatio);
        const currentSize = p.size * (1 + lifeRatio);

        // Draw smoke with soft gradient
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize);
        gradient.addColorStop(0, `rgba(47, 54, 64, ${p.opacity})`);
        gradient.addColorStop(0.7, `rgba(100, 100, 100, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(150, 150, 150, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        return p.life < p.maxLife;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [effect]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
