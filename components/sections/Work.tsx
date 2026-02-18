'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote:
      'Working with Supomelo transformed our product experience. The attention to detail and understanding of our users was exceptional.',
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'TechStartup',
    duration: '6 MONTHS',
  },
  {
    quote:
      'Finally, a designer who understands the pace of startups. Delivered incredible work while moving fast alongside our engineering team.',
    name: 'Marcus Johnson',
    role: 'Head of Product',
    company: 'GrowthCo',
    duration: 'ACTIVE',
  },
  {
    quote:
      "The design system they built has scaled beautifully as we've grown from 10 to 100+ features. Best investment we made.",
    name: 'Emily Park',
    role: 'CTO',
    company: 'ScaleUp',
    duration: '8 MONTHS',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Work() {
  return (
    <section className="py-20 lg:py-32 bg-bg-warm bg-dot-grid">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-text-muted">
            Testimonials
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-[44px] font-bold text-text-primary mt-6 mb-4"
        >
          Why supomelo?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-text-muted max-w-2xl mb-12"
        >
          Work with a design partner that understands how to ship features in
          fast-paced product organisations.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-card-light rounded-2xl p-6 border border-border-light transition-all duration-200"
            >
              {/* Duration Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-bg-warm rounded-full text-text-muted">
                  {testimonial.duration}
                </span>
              </div>

              {/* Company Logo Placeholder */}
              <div className="w-20 h-6 bg-border-light rounded mb-6" />

              {/* Quote */}
              <p className="text-text-primary mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-border-light rounded-full" />
                <div>
                  <p className="font-medium text-text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-text-muted">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
