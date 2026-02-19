'use client';

import { motion } from 'framer-motion';

const deliverables = [
  {
    title: 'Async-first',
    description:
      'Work across timezones. Updates, feedback, and deliverables flow without waiting for meetings.',
  },
  {
    title: 'Unlimited revisions',
    description:
      "Iterate until it's right. No nickel-and-diming for tweaks or changes.",
  },
  {
    title: 'Figma files included',
    description:
      'Full ownership of all design files. No extra fees, no strings attached.',
  },
  {
    title: 'Month-to-month',
    description:
      "No long-term contracts. Stay because it works, not because you're locked in.",
  },
  {
    title: 'Cancel anytime',
    description:
      "Pause or stop whenever you need. We'll pick up right where we left off.",
  },
];

// SVG node positions: peaks at y=30, valleys at y=65
const nodes = [
  { cx: 100, cy: 30 },
  { cx: 300, cy: 65 },
  { cx: 500, cy: 30 },
  { cx: 700, cy: 65 },
  { cx: 900, cy: 30 },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-[#F1EDE4] bg-dot-grid">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="mb-12"
        >
          <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-text-muted">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-text-primary mt-6 mb-6 leading-tight">
            No guesswork on pricing,
            <br />
            we charge $28k/mo.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="mb-16"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 bg-white text-text-primary border border-gray-200 rounded-full pl-6 pr-2 py-2 font-medium transition-all duration-300 hover:bg-text-primary hover:text-white hover:border-text-primary"
          >
            Enquire
            <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#FF774D] overflow-hidden">
              <svg className="w-5 h-5 text-white transition-transform duration-300 ease-out group-hover:translate-x-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="absolute w-5 h-5 text-white -translate-x-10 transition-transform duration-300 ease-out group-hover:translate-x-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </motion.div>

        {/* Desktop: wavy timeline */}
        <div className="hidden md:block">
          {/* Single SVG — proportional scaling so circles are never distorted */}
          <svg
            viewBox="0 0 1000 90"
            fill="none"
            className="w-full"
            style={{ display: 'block' }}
          >
            <motion.path
              d="M 100 30 C 200 30, 200 65, 300 65 C 400 65, 400 30, 500 30 C 600 30, 600 65, 700 65 C 800 65, 800 30, 900 30"
              stroke="#C8C0B4"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
            {nodes.map((pos, i) => (
              <motion.circle
                key={i}
                cx={pos.cx}
                cy={pos.cy}
                r="9"
                fill="#FF774D"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }}
              />
            ))}
          </svg>

          {/* Content grid — 5 columns aligned to SVG node x positions */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {deliverables.map((item, i) => (
              <motion.div
                key={i}
                className={nodes[i].cy > 40 ? 'mt-6' : ''}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-text-primary mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden mt-8 relative">
          {/* Vertical connecting line — centered on the w-4 circle (left: 8px) */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-300" />
          {deliverables.map((item, i) => (
            <motion.div
              key={i}
              className="flex gap-5 pb-8 last:pb-0"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Circle node */}
              <div className="w-4 h-4 rounded-full bg-accent relative z-10 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
