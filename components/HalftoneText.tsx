'use client';

import { useRef, useEffect } from 'react';

interface HalftoneTextProps {
  text: string;
  dotColor?: string;
  spacing?: number;
}

export default function HalftoneText({
  text,
  dotColor = '#FF774D',
  spacing = 12,
}: HalftoneTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafRef: number;
    let hasAnimated = false;

    const drawHalftone = (progress: number) => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // --- Offscreen: render text as white on black to sample ---
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const offCtx = off.getContext('2d');
      if (!offCtx) return;

      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, w, h);

      let fontSize = h * 0.8;
      offCtx.font = `bold ${fontSize}px 'Geist Mono', monospace`;
      const measured = offCtx.measureText(text).width;
      fontSize *= (w * 0.98) / measured;
      offCtx.font = `bold ${fontSize}px 'Geist Mono', monospace`;

      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, w / 2, h / 2);

      const imgData = offCtx.getImageData(0, 0, w, h);

      // --- Compute Manhattan distance field ---
      // Each pixel value = distance to the nearest background (edge) pixel
      const INF = 9999;
      const dist = new Float32Array(w * h);

      for (let i = 0; i < w * h; i++) {
        dist[i] = imgData.data[i * 4] > 128 ? INF : 0;
      }

      // Forward pass: top-left → bottom-right
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (dist[y * w + x] === 0) continue;
          const top  = y > 0 ? dist[(y - 1) * w + x] + 1 : INF;
          const left = x > 0 ? dist[y * w + (x - 1)] + 1 : INF;
          dist[y * w + x] = Math.min(dist[y * w + x], top, left);
        }
      }

      // Backward pass: bottom-right → top-left
      for (let y = h - 1; y >= 0; y--) {
        for (let x = w - 1; x >= 0; x--) {
          if (dist[y * w + x] === 0) continue;
          const bottom = y < h - 1 ? dist[(y + 1) * w + x] + 1 : INF;
          const right  = x < w - 1 ? dist[y * w + (x + 1)] + 1 : INF;
          dist[y * w + x] = Math.min(dist[y * w + x], bottom, right);
        }
      }

      // --- Draw halftone dots scaled by distance from edge ---
      ctx.fillStyle = dotColor;

      const maxR = spacing * 0.52;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const eased = 1 - Math.pow(1 - progress, 3);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;

          const px = Math.min(w - 1, Math.floor(x));
          const py = Math.min(h - 1, Math.floor(y));
          const d = dist[py * w + px];

          if (d === 0) continue; // outside letter — no dot

          // Radius grows with distance from edge, capped at maxR
          const r = Math.min(maxR, d * 0.7) * eased;

          if (r < 0.3) continue;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const runAnimation = () => {
      const start = performance.now();
      const duration = 1400;

      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        drawHalftone(p);
        if (p < 1) rafRef = requestAnimationFrame(tick);
      };

      rafRef = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          hasAnimated = true;
          runAnimation();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(canvas);

    const init = () => drawHalftone(0);
    document.fonts.ready.then(init);

    const ro = new ResizeObserver(() => {
      drawHalftone(hasAnimated ? 1 : 0);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef);
      observer.disconnect();
      ro.disconnect();
    };
  }, [text, dotColor, spacing]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: '20vw' }}
    />
  );
}
