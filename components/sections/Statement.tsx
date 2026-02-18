'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const journeyStages = [
  { stage: 'Seed', description: 'Finding product-market fit' },
  { stage: 'Series A', description: 'Scaling what works' },
  { stage: 'Growth', description: 'Accelerating your roadmap' },
];

const clientTypes = [
  {
    id: 'scaleups',
    title: 'Scale-ups',
    subtitle: 'Raised $30M+',
    description:
      'A senior design partner embedded in your team to accelerate your roadmap.',
    offerings: [
      {
        title: 'Embedded collaboration',
        desc: 'We join your standups, critiques, and syncs. Part of your team, not outside it.',
      },
      {
        title: 'Wireframes & prototypes',
        desc: 'Whatever fidelity gets you answers fastest, from quick sketches to interactive prototypes.',
      },
      {
        title: 'UI design',
        desc: 'Production-ready screens your engineers can ship.',
      },
      {
        title: 'Design systems',
        desc: 'Components and patterns that scale with your product. Built as needed, not upfront.',
      },
      {
        title: 'Research support',
        desc: 'We join sessions, synthesize findings, or run lightweight tests. Whatever helps us learn.',
      },
    ],
  },
  {
    id: 'startups',
    title: 'Startups',
    subtitle: 'Raised $5-30M',
    description:
      'Design support to help you move fast and learn faster.',
    offerings: [
      {
        title: 'Weekly syncs',
        desc: 'Regular check-ins to review progress, gather feedback, and plan next steps.',
      },
      {
        title: 'Rapid prototypes',
        desc: 'Testable concepts in days. Validate assumptions before engineering commits.',
      },
      {
        title: 'UI design',
        desc: 'Polished screens ready for development.',
      },
      {
        title: 'Lightweight systems',
        desc: 'Just enough structure to stay consistent without slowing you down.',
      },
      {
        title: 'Research & testing',
        desc: 'Quick validation loops with real users, not month-long studies.',
      },
    ],
  },
];

export default function Statement() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-bg-warm">
      {/* Client Type Toggle - Cloud Background */}
      <div
        className="py-16 lg:py-20 bg-center relative"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1770030190302-4e5a9fd831bb?w=1920&q=80&fit=crop)', backgroundSize: '160%' }}
      >
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="text-sm font-mono font-medium text-white/80 uppercase tracking-wide mb-6"
          >
            What you get
          </motion.p>

          {/* Content Card */}
          <div className="bg-bg-warm/80 rounded-2xl overflow-hidden p-5 md:p-8">
            {/* Header with Title and Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-3">
                  <motion.h3
                    key={`title-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl md:text-4xl lg:text-[44px] font-bold text-text-primary"
                  >
                    {clientTypes[activeTab].title}
                  </motion.h3>
                  <div className="relative group">
                    <button className="w-6 h-6 rounded-full border-2 border-text-muted/40 text-text-muted/60 flex items-center justify-center text-sm font-medium hover:border-text-muted hover:text-text-muted transition-colors cursor-help">
                      i
                    </button>
                    <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-64 p-3 bg-bg-dark text-text-light text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="absolute left-3 sm:left-1/2 sm:-translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-bg-dark" />
                      What we deliver also depends on your goals. Let&apos;s
                      figure it out together.
                    </div>
                  </div>
                </div>
                <motion.p
                  key={`subtitle-${activeTab}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="text-text-muted mt-1"
                >
                  {clientTypes[activeTab].subtitle}
                </motion.p>
              </div>

              {/* Toggle Switch */}
              <div className="inline-flex bg-border-light rounded-full p-1 shrink-0 self-start">
                {clientTypes.map((client, index) => (
                  <button
                    key={client.id}
                    onClick={() => setActiveTab(index)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                      activeTab === index
                        ? 'bg-accent text-white'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {client.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <motion.p
              key={`desc-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg text-text-muted max-w-2xl mb-7"
            >
              {clientTypes[activeTab].description}
            </motion.p>

            {/* Offerings List */}
            <div className="divide-y divide-gray-300">
              {clientTypes[activeTab].offerings.map((offering, index) => (
                <motion.div
                  key={`${activeTab}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  className="py-4 grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4"
                >
                  <h4 className="text-xl font-semibold text-text-primary">
                    {offering.title}
                  </h4>
                  <p className="md:col-span-2 text-text-muted">
                    {offering.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
