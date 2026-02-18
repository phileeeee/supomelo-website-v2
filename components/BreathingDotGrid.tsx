'use client';

import { useRef, useEffect } from 'react';

interface BreathingDotGridProps {
  dotColor?: string;   // any CSS colour
  spacing?: number;    // px between dot centres
  baseRadius?: number; // dot radius at rest
}

export default function BreathingDotGrid({
  dotColor = '#d4d4d4',
  spacing = 24,
  baseRadius = 0.75,
}: BreathingDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const parent = canvas.parentElement;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    parent?.addEventListener('mousemove', onMouseMove);
    parent?.addEventListener('mouseleave', onMouseLeave);

    const startTime = performance.now();

    const draw = (now: number) => {
      const t = (now - startTime) / 1000;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = dotColor;

      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;

          // Slow rolling wave across the grid
          const wave =
            (Math.sin(col * 0.45 + t * 0.7) *
              Math.cos(row * 0.45 + t * 0.5) +
              1) /
            2;

          // Mouse proximity boost
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 160);

          const r = baseRadius * (0.4 + wave * 0.9 + proximity * 2.5);
          const alpha = 0.12 + wave * 0.38 + proximity * 0.55;

          ctx.globalAlpha = Math.min(1, alpha);
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      parent?.removeEventListener('mousemove', onMouseMove);
      parent?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [dotColor, spacing, baseRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
    />
  );
}
