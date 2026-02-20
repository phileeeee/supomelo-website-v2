'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingSplashProps {
  onEnter: () => void;
}

interface Dot {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const text = 'supomelo.';

const SPACING = 20;
const DOT_RADIUS = 1.5;
const MAX_SPEED = 7;
const SEEK_MAX_SPEED = 22;   // fast enough to keep up with quick cursor movement
const MAX_FORCE = 0.7;
const SEEK_MAX_FORCE = 3.0;  // stronger acceleration in seek mode
const FLEE_RADIUS = 100;
const FLEE_WEIGHT = 5;
const ARRIVE_SLOWING = 60;

// Gradient stops — vibrant orange palette matching footer accent
const GRAD_STOPS: [number, string][] = [
  [0,    '#FF5500'],  // deep vibrant orange
  [0.4,  '#FF6D2E'],  // bright orange
  [0.75, '#FF774D'],  // accent (matches footer dots exactly)
  [1,    '#FFBA90'],  // warm light orange
];

export default function LoadingSplash({ onEnter }: LoadingSplashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const modeRef = useRef<'normal' | 'seek'>('normal');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const buildGrid = () => {
      // Account for padding (32px mobile, 48px desktop on each side)
      const padding = window.innerWidth >= 768 ? 48 : 32;
      const W = window.innerWidth - padding * 2;
      const H = window.innerHeight - padding * 2;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;
      const offX = (W - (cols - 1) * SPACING) / 2;
      const offY = (H - (rows - 1) * SPACING) / 2;

      dotsRef.current = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const hx = offX + c * SPACING;
          const hy = offY + r * SPACING;
          // Random initial velocity so dots immediately fly and oscillate (matches reference)
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          dotsRef.current.push({ homeX: hx, homeY: hy, x: hx, y: hy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
        }
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Slowly rotating gradient — full cycle every ~60s
      const angle = (Date.now() / 60000) * Math.PI * 2;
      const cx = canvas.width / dpr / 2;
      const cy = canvas.height / dpr / 2;
      const r = Math.sqrt(cx * cx + cy * cy);
      const grad = ctx.createLinearGradient(
        cx - Math.cos(angle) * r, cy - Math.sin(angle) * r,
        cx + Math.cos(angle) * r, cy + Math.sin(angle) * r,
      );
      for (const [stop, color] of GRAD_STOPS) grad.addColorStop(stop, color);
      ctx.fillStyle = grad;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isSeek = modeRef.current === 'seek';

      for (const d of dotsRef.current) {
        let steerX = 0;
        let steerY = 0;

        if (isSeek) {
          // --- Seek toward cursor with inner repulsion radius to form a ball ---
          const BALL_RADIUS = 70;
          const smx = mx - d.x;
          const smy = my - d.y;
          const distSeek = Math.sqrt(smx * smx + smy * smy);
          if (distSeek > 0) {
            if (distSeek < BALL_RADIUS) {
              steerX = -(smx / distSeek) * SEEK_MAX_SPEED - d.vx;
              steerY = -(smy / distSeek) * SEEK_MAX_SPEED - d.vy;
            } else {
              steerX = (smx / distSeek) * SEEK_MAX_SPEED - d.vx;
              steerY = (smy / distSeek) * SEEK_MAX_SPEED - d.vy;
            }
          }
          const seekMag = Math.sqrt(steerX * steerX + steerY * steerY);
          if (seekMag > SEEK_MAX_FORCE) {
            steerX = (steerX / seekMag) * SEEK_MAX_FORCE;
            steerY = (steerY / seekMag) * SEEK_MAX_FORCE;
          }
          d.vx += steerX;
          d.vy += steerY;
        } else {
          // --- Arrive at home — clamped to MAX_FORCE ---
          const dhx = d.homeX - d.x;
          const dhy = d.homeY - d.y;
          const distHome = Math.sqrt(dhx * dhx + dhy * dhy);
          let arriveX = 0, arriveY = 0;
          if (distHome > 0.5) {
            const desiredSpeed = distHome < ARRIVE_SLOWING
              ? MAX_SPEED * (distHome / ARRIVE_SLOWING)
              : MAX_SPEED;
            arriveX = (dhx / distHome) * desiredSpeed - d.vx;
            arriveY = (dhy / distHome) * desiredSpeed - d.vy;
            const arriveMag = Math.sqrt(arriveX * arriveX + arriveY * arriveY);
            if (arriveMag > MAX_FORCE) {
              arriveX = (arriveX / arriveMag) * MAX_FORCE;
              arriveY = (arriveY / arriveMag) * MAX_FORCE;
            }
          }

          // --- Flee from cursor — clamped to MAX_FORCE, then × FLEE_WEIGHT ---
          const fmx = d.x - mx;
          const fmy = d.y - my;
          const distMouse = Math.sqrt(fmx * fmx + fmy * fmy);
          let fleeX = 0, fleeY = 0;
          if (distMouse < FLEE_RADIUS && distMouse > 0) {
            fleeX = (fmx / distMouse) * MAX_SPEED - d.vx;
            fleeY = (fmy / distMouse) * MAX_SPEED - d.vy;
            const fleeMag = Math.sqrt(fleeX * fleeX + fleeY * fleeY);
            if (fleeMag > MAX_FORCE) {
              fleeX = (fleeX / fleeMag) * MAX_FORCE;
              fleeY = (fleeY / fleeMag) * MAX_FORCE;
            }
            // Weight flee AFTER clamping — matches reference's flee.mult(5)
            fleeX *= FLEE_WEIGHT;
            fleeY *= FLEE_WEIGHT;
          }

          // Apply both forces independently (no combined cap — this sustains oscillation)
          d.vx += arriveX + fleeX;
          d.vy += arriveY + fleeY;
        }

        // Clamp velocity (higher cap in seek mode)
        const speedLimit = isSeek ? SEEK_MAX_SPEED : MAX_SPEED;
        const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        if (speed > speedLimit) {
          d.vx = (d.vx / speed) * speedLimit;
          d.vy = (d.vy / speed) * speedLimit;
        }

        d.x += d.vx;
        d.y += d.vy;

        // Fade dots near the centred text — elliptical zone (wider than tall)
        const TEXT_RX = 180;  // horizontal half-width of fade zone
        const TEXT_RY = 50;   // vertical half-height of fade zone
        const TEXT_MIN_ALPHA = 0.02;
        const ex = (d.x - cx) / TEXT_RX;
        const ey = (d.y - cy) / TEXT_RY;
        const ellipseDist = Math.sqrt(ex * ex + ey * ey);
        const alpha = ellipseDist >= 1
          ? 1
          : TEXT_MIN_ALPHA + (1 - TEXT_MIN_ALPHA) * ellipseDist;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    buildGrid();
    draw();

    const onMove = (e: MouseEvent) => {
      const padding = window.innerWidth >= 768 ? 48 : 32;
      mouseRef.current = { x: e.clientX - padding, y: e.clientY - padding };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        const padding = window.innerWidth >= 768 ? 48 : 32;
        mouseRef.current = { x: t.clientX - padding, y: t.clientY - padding };
      }
    };
    const onResize = () => buildGrid();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleContainerClick = () => {
    modeRef.current = modeRef.current === 'normal' ? 'seek' : 'normal';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-warm"
      onClick={handleContainerClick}
    >
      <canvas ref={canvasRef} className="absolute inset-8 md:inset-12 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* stopPropagation so clicking the text enters the site, not toggles seek mode */}
        <button
          onClick={(e) => { e.stopPropagation(); onEnter(); }}
          className="flex cursor-pointer group"
        >
          {text.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary group-hover:text-accent transition-colors duration-300"
            >
              {letter}
            </motion.span>
          ))}
        </button>
      </div>
    </motion.div>
  );
}
