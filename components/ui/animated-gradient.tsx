'use client';

import { useEffect, useRef } from 'react';

interface AnimatedGradientProps {
  className?: string;
}

export function AnimatedGradient({ className = '' }: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    
    const colors = [
      [65, 88, 208],  // blue
      [200, 80, 192], // purple
      [255, 204, 112] // orange/yellow
    ];
    
    const points: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: number[];
    }[] = [];
    const particleCount = 12;
    
    // Create initial points
    for (let i = 0; i < particleCount; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        size: Math.random() * 100 + 100,
        color: colors[i % colors.length]
      });
    }
    
    function drawGradient() {
      // Clear canvas
      ctx?.clearRect(0, 0, width, height);
      
      // Move points
      points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off edges
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
      });
      
      // Create gradient
      const gradient = ctx?.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.5) ?? ctx!.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.5);
      
      // Create color stops from points
      points.forEach((point, i) => {
        const [r, g, b] = point.color;
        const alpha = 0.15;  // Reduced opacity for subtlety
        gradient.addColorStop(i / (points.length - 1), `rgba(${r}, ${g}, ${b}, ${alpha})`);
      });
      
      // Apply gradient
      if (ctx) ctx.fillStyle = gradient;
      if (ctx) ctx.fillRect(0, 0, width, height);
      
      requestAnimationFrame(drawGradient);
    }
    
    drawGradient();
    
    return () => window.removeEventListener('resize', resize);
  }, []);
  
  return <canvas ref={canvasRef} className={`absolute inset-0 -z-10 ${className}`} />;
}
