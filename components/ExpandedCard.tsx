'use client';

import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1200&q=80';
const HERO_COLOR = '#D4825A';

interface ExpandedCardProps {
  isExpanded: boolean;
}

export default function ExpandedCard({ isExpanded }: ExpandedCardProps) {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 h-screen w-full"
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{ backgroundColor: HERO_COLOR }}
          >
            {/* Background image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 bg-cover bg-center scale-125 md:scale-100"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />

            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Tagline in center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white text-center leading-tight max-w-4xl">
                From seed to scale.
                <br />
                Design that helps startups flourish.
              </h1>
              <p className="text-base md:text-lg text-white/70 text-center max-w-xl leading-relaxed">
                Product design studio for startups ready to grow. Supomelo is a mashup of Startup + Pomelo, carrying the meaning of prosperity and abundance for startups.
              </p>
            </motion.div>

            {/* Availability bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute bottom-8 left-0 right-0 px-6 md:px-12"
            >
              <div className="max-w-md mx-auto scale-[1.2]">
                <p className="text-[11px] font-mono text-white/50 uppercase tracking-widest mb-2 text-center">
                  2026 Availability
                </p>
                <div className="flex gap-[3px] md:gap-1">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => {
                    const isFilled = i < 3;
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-1">
                        {isFilled ? (
                          <div className="relative w-full h-1.5">
                            {/* Empty track */}
                            <div className="absolute inset-0 rounded-full border border-white/20" />
                            {/* Fill bar — scales in from left, staggered per month */}
                            <motion.div
                              className="absolute inset-0 rounded-full bg-white/80"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{
                                duration: 0.5,
                                delay: 1.0 + i * 0.35,
                                ease: [0.25, 0.1, 0.25, 1],
                              }}
                              style={{ transformOrigin: 'left' }}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-1.5 rounded-full border border-white/20" />
                        )}
                        <span className={`text-[9px] md:text-[10px] font-mono ${
                          isFilled ? 'text-white/60' : 'text-white/40'
                        }`}>
                          {month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
