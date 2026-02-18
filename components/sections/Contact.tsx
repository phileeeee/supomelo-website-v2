'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projectTypes = ['Web app', 'Mobile app', 'Website', 'Brand'];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    projectTypes: [] as string[],
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Please enter your company name';
    }
    if (formData.projectTypes.length === 0) {
      newErrors.projectTypes = 'Please select at least one project type';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const subject = `New enquiry from ${formData.name} at ${formData.company}`;
      const body = `Hi Supomelo,

My name is ${formData.name} from ${formData.company}.

I want to chat about designs for my: ${formData.projectTypes.join(', ')}

You can reach me at: ${formData.email}

Looking forward to hearing from you!`;

      const mailtoLink = `mailto:supomelo.studio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
      setIsSubmitted(true);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-32 bg-bg-warm bg-dot-grid overflow-hidden"
    >

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-text-muted">
            Contact
          </span>
        </motion.div>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-3xl md:text-4xl lg:text-[44px] font-bold text-text-primary mt-6 mb-12"
        >
          Let&apos;s collaborate
        </motion.h2>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-16"
          >
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Thanks for reaching out!
            </h3>
            <p className="text-text-muted">
              We&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="max-w-2xl"
          >
            <div className="text-xl md:text-2xl text-text-primary leading-relaxed space-y-4">
              <p className="flex flex-wrap items-center gap-2">
                <span>My name is</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className={`bg-transparent border-b-2 ${
                    errors.name ? 'border-red-400' : 'border-border-light'
                  } focus:border-accent outline-none px-2 py-1 text-text-primary placeholder:text-text-muted/50 transition-colors min-w-[150px]`}
                />
              </p>

              <p className="flex flex-wrap items-center gap-2">
                <span>from</span>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Acme Inc"
                  className={`bg-transparent border-b-2 ${
                    errors.company ? 'border-red-400' : 'border-border-light'
                  } focus:border-accent outline-none px-2 py-1 text-text-primary placeholder:text-text-muted/50 transition-colors min-w-[150px]`}
                />
              </p>

              <p className="flex flex-wrap items-center gap-2">
                <span>I want to chat about designs for my</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {projectTypes.map((type) => {
                  const isSelected = formData.projectTypes.includes(type);
                  const toggleSelection = () => {
                    if (isSelected) {
                      setFormData({
                        ...formData,
                        projectTypes: formData.projectTypes.filter(
                          (t) => t !== type
                        ),
                      });
                    } else {
                      setFormData({
                        ...formData,
                        projectTypes: [...formData.projectTypes, type],
                      });
                    }
                  };
                  return (
                    <motion.button
                      key={type}
                      type="button"
                      onClick={toggleSelection}
                      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-accent text-white'
                          : 'bg-white text-text-primary border border-border-light hover:border-text-muted'
                      } ${
                        errors.projectTypes &&
                        formData.projectTypes.length === 0
                          ? 'border-red-400'
                          : ''
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        {isSelected && (
                          <motion.span
                            key="check"
                            layout
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {type}
                    </motion.button>
                  );
                })}
              </div>

              <p className="flex flex-wrap items-center gap-2">
                <span>You can reach me at</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@acme.com"
                  className={`bg-transparent border-b-2 ${
                    errors.email ? 'border-red-400' : 'border-border-light'
                  } focus:border-accent outline-none px-2 py-1 text-text-primary placeholder:text-text-muted/50 transition-colors min-w-[200px]`}
                />
              </p>
            </div>

            {Object.keys(errors).length > 0 && (
              <p className="text-red-400 text-sm mt-4">
                Please fill in all fields correctly.
              </p>
            )}

            <div className="mt-10">
              <motion.button
                type="submit"
                className="group inline-flex items-center gap-3 bg-accent border border-accent rounded-full px-2 py-2 pl-6 cursor-pointer overflow-hidden transition-colors duration-300 hover:bg-white hover:border-white"
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base font-medium text-white transition-colors duration-300 group-hover:text-bg-dark">
                  Send message
                </span>
                <span className="relative flex items-center justify-center w-10 h-10 bg-white group-hover:bg-accent text-bg-dark group-hover:text-white rounded-full overflow-hidden transition-colors duration-300">
                  <svg
                    className="w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  <svg
                    className="absolute w-5 h-5 -translate-x-10 transition-transform duration-300 ease-out group-hover:translate-x-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </motion.button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
