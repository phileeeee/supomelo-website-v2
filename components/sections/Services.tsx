'use client';

import { motion } from 'framer-motion';

const services = [
  {
    title: 'UX Design',
    description:
      'Research-led wireframes and flows that spark product discussion.',
  },
  {
    title: 'UI Design',
    description:
      'Polished, dev-ready interfaces with accessibility baked in.',
  },
  {
    title: 'Design Systems',
    description:
      'Scalable component libraries that grow with your product.',
  },
  {
    title: 'Prototyping',
    description:
      'Interactive prototypes to validate ideas with real users.',
  },
  {
    title: 'AI Product Design',
    description:
      'Intuitive AI-powered features and workflows for B2B.',
  },
  {
    title: 'User Research',
    description:
      'Interviews and testing that inform smart design decisions.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-bg-dark bg-dot-grid-dark">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-text-muted">
            Services
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-[44px] font-bold text-text-light mt-6 mb-16"
        >
          What we can help with
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group py-6 border-b border-border-dark"
            >
              <div className="flex items-start gap-4">
                <span className="text-accent font-mono text-sm mt-1">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-text-light mb-1 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-20 pb-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-light"
        >
          Design that bears fruit.
        </motion.h2>
      </div>
    </section>
  );
}
