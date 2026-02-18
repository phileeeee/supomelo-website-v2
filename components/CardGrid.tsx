'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Card {
  id: number;
  color: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CardGridProps {
  isVisible: boolean;
  onCardSelect: (card: Card) => void;
  selectedCard: Card | null;
}

// Canvas: 150vmax × 120vmax — all values are % of the canvas
// Initial view is centered. ~8 cards visible at rest, ~6 more peeking from edges,
// rest revealed by parallax exploration. No overlaps verified.
const cards: Card[] = [
  // ── Top exploration zone ──────────────────────────────────────────
  { id: 1,  color: '#B89B3A', x: 28, y: 4,  width: 7,  height: 7,  image: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1200&q=80' },
  { id: 2,  color: '#E8A735', x: 62, y: 2,  width: 12, height: 12, image: 'https://images.unsplash.com/photo-1532614208657-10b8d7815f40?w=1200&q=80' },

  // ── Upper visible band ────────────────────────────────────────────
  { id: 3,  color: '#A8A07A', x: 4,  y: 20, width: 13, height: 13, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80' },
  { id: 4,  color: '#556B4E', x: 52, y: 16, width: 14, height: 14, image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&q=80' },
  { id: 5,  color: '#F0D56B', x: 82, y: 20, width: 8,  height: 8,  image: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=1200&q=80' },

  // ── Center zone — small accents around "supomelo." text ───────────
  { id: 6,  color: '#B3A03A', x: 26, y: 38, width: 6,  height: 6,  image: 'https://images.unsplash.com/photo-1550207477-85f418dc3448?w=1200&q=80' },
  { id: 7,  color: '#C4D470', x: 58, y: 42, width: 5,  height: 5,  image: 'https://images.unsplash.com/photo-1586211354108-eb1c14310641?w=1200&q=80' },

  // ── Lower visible band ────────────────────────────────────────────
  { id: 8,  color: '#4A6741', x: 18, y: 56, width: 10, height: 10, image: 'https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?w=1200&q=80' },
  { id: 9,  color: '#D4825A', x: 2,  y: 46, width: 8,  height: 8,  image: 'https://images.unsplash.com/photo-1699892727398-e1d304f67ebb?w=1200&q=80' },
  { id: 10, color: '#D4825A', x: 58, y: 58, width: 12, height: 12, image: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1200&q=80' },
  { id: 11, color: '#7D9A2F', x: 80, y: 48, width: 10, height: 10, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80' },

  // ── Bottom exploration zone ───────────────────────────────────────
  { id: 12, color: '#6B7F24', x: 10, y: 76, width: 9,  height: 9,  image: 'https://images.unsplash.com/photo-1551917951-148edcd8ea8d?w=1200&q=80' },
  { id: 13, color: '#4D7A52', x: 40, y: 74, width: 11, height: 11, image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=1200&q=80' },
  { id: 14, color: '#E8A735', x: 76, y: 72, width: 10, height: 10, image: 'https://images.unsplash.com/photo-1599148401005-fe6d7497cb5e?w=1200&q=80' },
];

export default function CardGrid({ isVisible, onCardSelect, selectedCard }: CardGridProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'images' | 'growing' | 'colors'>('images');
  const galleryRef = useRef<HTMLDivElement>(null);

  // Animation phases after cards appear
  useEffect(() => {
    if (!isVisible) return;

    const growTimer = setTimeout(() => {
      setAnimationPhase('growing');
    }, 1500);

    const colorTimer = setTimeout(() => {
      setAnimationPhase('colors');
    }, 3000);

    return () => {
      clearTimeout(growTimer);
      clearTimeout(colorTimer);
    };
  }, [isVisible]);

  // Parallax panning — mouse position maps directly to gallery scroll position
  // Web Animations API with 4s easing creates a smooth, floaty feel
  useEffect(() => {
    if (!isVisible || selectedCard) return;
    const gallery = galleryRef.current;
    if (!gallery) return;

    // Center the gallery initially (mouse at center = canvas center)
    const initMaxX = gallery.offsetWidth - window.innerWidth;
    const initMaxY = gallery.offsetHeight - window.innerHeight;
    gallery.style.transform = `translate(${-initMaxX / 2}px, ${-initMaxY / 2}px)`;

    const handleMove = (clientX: number, clientY: number) => {
      const xDecimal = clientX / window.innerWidth;
      const yDecimal = clientY / window.innerHeight;
      const maxX = gallery.offsetWidth - window.innerWidth;
      const maxY = gallery.offsetHeight - window.innerHeight;
      const panX = maxX * xDecimal * -1;
      const panY = maxY * yDecimal * -1;

      gallery.animate(
        { transform: `translate(${panX}px, ${panY}px)` },
        { duration: 4000, fill: 'forwards', easing: 'ease' }
      );
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isVisible, selectedCard]);

  if (!isVisible) return null;

  const scaleMultiplier = animationPhase === 'growing' || animationPhase === 'colors' ? 1.06 : 1;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: selectedCard ? 10 : 20,
        visibility: selectedCard ? 'hidden' : 'visible',
      }}
    >
      <div
        ref={galleryRef}
        style={{
          width: '150vmax',
          height: '120vmax',
          position: 'absolute',
        }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: selectedCard ? 0 : 1,
              scale: scaleMultiplier,
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.05 + index * 0.06 },
              scale: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
            }}
            onClick={() => !selectedCard && onCardSelect(card)}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="absolute cursor-pointer overflow-hidden pointer-events-auto"
            style={{
              left: `${card.x}%`,
              top: `${card.y}%`,
              width: `${card.width}%`,
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              transition: 'transform 800ms ease',
            }}
            whileHover={{ scale: 1.08 }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{
                backgroundImage: `url(${card.image})`,
                opacity: animationPhase === 'colors' && hoveredCard !== card.id ? 0 : 1,
              }}
            />

            {/* Color overlay that fades in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: animationPhase === 'colors' && hoveredCard !== card.id ? 1 : 0,
              }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
              style={{ backgroundColor: card.color }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
