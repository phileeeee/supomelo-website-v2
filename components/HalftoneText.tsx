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
  spacing = 16,
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

      // Scale font size to fill canvas width
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

      // --- Draw halftone dots ---
      ctx.fillStyle = dotColor;

      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;

          const px = Math.min(w - 1, Math.floor(x));
          const py = Math.min(h - 1, Math.floor(y));
          const idx = (py * w + px) * 4;
          const brightness = imgData.data[idx]; // 255 = white = ink area

          const maxR = spacing * 0.52;
          const targetR = maxR * (brightness / 255);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const r = targetR * eased;

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

    // Trigger animation when footer scrolls into view
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

    // Draw static (invisible) frame on load so canvas has correct size
    const init = () => drawHalftone(0);
    document.fonts.ready.then(init);

    // Redraw on resize
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
