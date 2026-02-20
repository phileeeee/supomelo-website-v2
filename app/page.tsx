'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingSplash from '@/components/LoadingSplash';
import ExpandedCard from '@/components/ExpandedCard';
import Navigation from '@/components/Navigation';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Work from '@/components/sections/Work';
import Statement from '@/components/sections/Statement';
import Pricing from '@/components/sections/Pricing';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

type Phase = 'splash' | 'expanded';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('splash');
  const contentCardRef = useRef<HTMLDivElement>(null);

  // Toggle body overflow based on phase
  useEffect(() => {
    if (phase === 'expanded') {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } else {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  }, [phase]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Nav click handler — smooth scroll to section
  const handleNavClick = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <main className="relative bg-bg-warm min-h-screen">
      {/* Splash screen */}
      <AnimatePresence>
        {phase === 'splash' && <LoadingSplash onEnter={() => setPhase('expanded')} />}
      </AnimatePresence>

      {phase === 'expanded' && (
        <>
          {/* Content Card — wraps hero + all sections */}
          <div
            ref={contentCardRef}
            className="relative z-20 bg-bg-warm"
          >
            {/* Hero */}
            <div id="hero">
              <ExpandedCard
                isExpanded={phase === 'expanded'}
              />
            </div>

            {/* Sections */}
            <About />
            {/* <Work /> */}
            <Services />
            <Statement />
            <Pricing />
            <Contact />

          </div>

          {/* Footer — sits behind the content card, revealed at bottom */}
          <Footer />
        </>
      )}

      {/* Navigation appears after expanded */}
      <Navigation
        isVisible={phase === 'expanded'}
        onNavClick={handleNavClick}
        onLogoClick={handleScrollToTop}
      />
    </main>
  );
}
