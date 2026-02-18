'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

interface NavigationProps {
  isVisible: boolean;
  onNavClick?: (href: string) => void;
  onLogoClick?: () => void;
}

const navLinks = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Pricing', href: '#pricing', id: 'pricing' },
  { label: "Let's chat", href: '#contact', id: 'contact' },
];

export default function Navigation({ isVisible, onNavClick, onLogoClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isPill, setIsPill] = useState(false);
  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | HTMLButtonElement | null }>({});

  // Logo vinyl spin
  const logoRotation = useMotionValue(0);
  const isHoveringLogo = useRef(false);
  const spinControls = useRef<{ stop: () => void } | null>(null);

  const startLogoSpin = () => {
    isHoveringLogo.current = true;
    const spin = () => {
      if (!isHoveringLogo.current) return;
      const controls = animate(logoRotation, logoRotation.get() + 360, {
        duration: 2,
        ease: 'linear',
        onComplete: spin,
      });
      spinControls.current = controls;
    };
    spin();
  };

  const stopLogoSpin = () => {
    isHoveringLogo.current = false;
    if (spinControls.current) spinControls.current.stop();

    const current = logoRotation.get();
    const normalized = ((current % 360) + 360) % 360;
    logoRotation.set(normalized);

    animate(logoRotation, -360, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => logoRotation.set(0),
    });
  };

  // Scroll-based bar → pill toggle
  useEffect(() => {
    if (!isVisible) return;
    const handler = () => setIsPill(window.scrollY > 100);
    window.addEventListener('scroll', handler, { passive: true });
    handler(); // set correct state on mount (in case page already scrolled)
    return () => window.removeEventListener('scroll', handler);
  }, [isVisible]);

  // Active section tracking
  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      const sections = navLinks.map(link => ({
        id: link.id,
        element: document.getElementById(link.id),
      }));

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          if (scrollPosition >= section.element.offsetTop) {
            setActiveSection(section.id);
            return;
          }
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  if (!isVisible) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setTimeout(() => setIsMobileMenuOpen(false), 50);
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      {/* Desktop Navbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center"
      >
        {/*
          Bar state:  1200px wide, logo left / links right, no bg, no radius
          Pill state: auto-width, compact row, bg visible, rounded, floating
        */}
        <motion.nav
          layout
          animate={{
            borderRadius: isPill ? 9999 : 0,
            marginTop: isPill ? 20 : 0,
          }}
          transition={{ layout: { duration: 0.55, ease }, duration: 0.55, ease }}
          className={`relative ${!isPill ? 'w-full max-w-[1200px]' : ''}`}
        >
          {/* Pill background — fades in when scrolled */}
          <motion.div
            animate={{ opacity: isPill ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-bg-warm/95 backdrop-blur-md border border-border-light shadow-lg shadow-black/5"
            style={{ borderRadius: 'inherit' }}
          />

          {/* Content */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.55, ease } }}
            className={`relative flex items-center ${
              isPill ? 'gap-1 px-2 py-2' : 'justify-between px-6 lg:px-12 py-4'
            }`}
          >
            {/* Logo + wordmark */}
            <motion.button
              layout
              transition={{ layout: { duration: 0.55, ease } }}
              ref={(el) => { navRefs.current['home'] = el; }}
              onClick={handleLogoClick}
              onMouseEnter={startLogoSpin}
              onMouseLeave={stopLogoSpin}
              className="relative z-10 flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer shrink-0"
            >
              <motion.div
                style={{
                  rotate: logoRotation,
                  filter: isPill ? 'none' : 'brightness(0) invert(1)',
                }}
                className={isPill ? 'w-4 h-4 shrink-0' : 'w-6 h-6 shrink-0'}
              >
                <Image
                  src="/s-logo-dark.png"
                  alt="Supomelo"
                  width={isPill ? 16 : 24}
                  height={isPill ? 16 : 24}
                  className={isPill ? 'w-4 h-4' : 'w-6 h-6'}
                />
              </motion.div>
              <span className={
                isPill
                  ? 'text-sm font-medium text-text-primary whitespace-nowrap'
                  : 'text-xl font-bold text-white whitespace-nowrap lowercase'
              }>
                supomelo
              </span>
            </motion.button>

            {/* Divider — only visible in pill state */}
            <motion.div
              layout
              animate={{ opacity: isPill ? 1 : 0 }}
              transition={{ layout: { duration: 0.55, ease }, opacity: { duration: 0.3 } }}
              className="w-px h-4 bg-border-light shrink-0"
            />

            {/* Nav links */}
            <motion.div
              layout
              transition={{ layout: { duration: 0.55, ease } }}
              className={`relative flex items-center ${isPill ? 'gap-1' : 'gap-8'}`}
            >
              {navLinks.map((link) => (
                <motion.a
                  layout
                  transition={{ layout: { duration: 0.55, ease } }}
                  key={link.label}
                  ref={(el) => { navRefs.current[link.id] = el; }}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={
                    isPill
                      ? 'group relative z-10 text-sm cursor-pointer px-4 py-2 whitespace-nowrap'
                      : 'group relative z-10 text-sm cursor-pointer whitespace-nowrap py-1'
                  }
                >
                  <div className="relative overflow-hidden">
                    <span className={`block transition-transform duration-300 group-hover:-translate-y-full ${isPill ? 'text-text-primary' : 'text-white'}`}>
                      {link.label}
                    </span>
                    <span className={`absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full ${isPill ? 'text-text-muted' : 'text-white/60'}`}>
                      {link.label}
                    </span>
                  </div>
                </motion.a>
              ))}

              {/* Active section dot indicator */}
              <motion.div
                className="absolute bottom-0 w-1.5 h-1.5 bg-accent rounded-full"
                animate={(() => {
                  if (!activeSection || !navRefs.current[activeSection]) return { opacity: 0 };
                  const el = navRefs.current[activeSection];
                  if (!el) return { opacity: 0 };
                  return {
                    opacity: 1,
                    left: el.offsetLeft + el.offsetWidth / 2 - 3,
                  };
                })()}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            </motion.div>
          </motion.div>
        </motion.nav>
      </motion.div>

      {/* Mobile: tap-outside overlay to close menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Pill */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center md:hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            borderRadius: isPill ? (isMobileMenuOpen ? 20 : 9999) : 0,
            marginTop: isPill ? 20 : 0,
          }}
          transition={{
            opacity: { duration: 0.4, delay: 0.3 },
            borderRadius: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            marginTop: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="bg-bg-warm backdrop-blur-md border border-border-light shadow-lg shadow-black/5 overflow-hidden pointer-events-auto"
        >
          {/* Header row: logo + supomelo + hamburger/close */}
          <div className="flex items-center gap-2 px-5 py-2.5">
            <button
              onClick={() => {
                if (isMobileMenuOpen) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => setIsMobileMenuOpen(false), 100);
                } else {
                  setIsMobileMenuOpen(true);
                }
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image
                src="/s-logo-dark.png"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-text-primary">
                supomelo
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-4 h-3 relative ml-1 flex flex-col justify-between cursor-pointer"
              aria-label="Toggle menu"
            >
              <span
                className={`w-full h-[1.5px] bg-text-primary transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[5.25px]' : ''
                }`}
              />
              <span
                className={`w-full h-[1.5px] bg-text-primary transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 scale-0' : ''
                }`}
              />
              <span
                className={`w-full h-[1.5px] bg-text-primary transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[5.25px]' : ''
                }`}
              />
            </button>
          </div>

          {/* Expandable menu items */}
          {isMobileMenuOpen && (
            <div className="flex flex-col items-center px-8 pb-4 gap-0">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setTimeout(() => setIsMobileMenuOpen(false), 100);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-text-muted active:text-text-primary"
                >
                  {activeSection === link.id && (
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
