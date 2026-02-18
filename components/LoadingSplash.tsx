'use client';

import { motion } from 'framer-motion';

interface LoadingSplashProps {
  isVisible: boolean;
}

export default function LoadingSplash({ isVisible }: LoadingSplashProps) {
  const text = 'supomelo.';

  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }),
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Text logo - stays in place */}
      <div className="z-10 flex">
        {text.split('').map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={letterAnimation}
            className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary"
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
