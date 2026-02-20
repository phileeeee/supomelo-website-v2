'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projectTypes = ['Web app', 'Mobile app', 'Website', 'Brand'];

const monthMap: Record<string, string> = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December',
};

const MAX_DESC = 500;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    projectTypes: [] as string[],
    email: '',
    description: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    const updateMonthFromHash = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split('?')[1]);
      const month = params.get('month');
      if (month) {
        setSelectedMonth(month);
      }
    };

    // Run on mount
    updateMonthFromHash();

    // Listen for hash changes
    window.addEventListener('hashchange', updateMonthFromHash);
    return () => window.removeEventListener('hashchange', updateMonthFromHash);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const fullMonth = selectedMonth ? monthMap[selectedMonth] || selectedMonth : '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '79f71988-8c6f-4553-aaf7-ef3b0b8ef1ca',
          subject: `New enquiry from ${formData.name} at ${formData.company}`,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          ...(fullMonth && { availability: `${fullMonth} 2026` }),
          project_types: formData.projectTypes.join(', '),
          ...(formData.description.trim() && { description: formData.description.trim() }),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setErrors({ submit: 'Something went wrong. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
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
            className="w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left column — form fields */}
            <div className="text-base md:text-lg text-text-primary leading-relaxed space-y-4">
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

              {selectedMonth && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span>for</span>
                  <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1 text-text-primary">
                    <span className="text-base font-medium">{monthMap[selectedMonth] || selectedMonth} 2026</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMonth(null);
                        window.history.replaceState(null, '', '#contact');
                      }}
                      className="text-text-muted hover:text-accent transition-colors"
                      aria-label="Remove month selection"
                    >
                      ×
                    </button>
                  </span>
                </motion.p>
              )}

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
                          ? 'bg-accent/10 border border-accent/20 text-text-primary'
                          : 'bg-white text-text-primary border border-border-light hover:border-text-muted'
                      } ${
                        errors.projectTypes &&
                        formData.projectTypes.length === 0
                          ? 'border-red-400'
                          : ''
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      {type}
                      <AnimatePresence mode="popLayout" initial={false}>
                        {isSelected && (
                          <motion.span
                            key="check"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center text-accent"
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

              {Object.keys(errors).length > 0 && (
                <p className="text-red-400 text-sm mt-4">
                  {errors.submit || 'Please fill in all fields correctly.'}
                </p>
              )}
            </div>

            {/* Right column — description */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-base md:text-lg text-text-primary mb-3">
                  Tell us a bit about your project
                </p>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_DESC) {
                        setFormData({ ...formData, description: e.target.value });
                      }
                    }}
                    placeholder="What are you building? What problem does it solve? Any context that helps us understand your goals…"
                    rows={10}
                    className="w-full bg-white border border-border-light focus:border-accent outline-none rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-muted/50 transition-colors resize-none leading-relaxed"
                  />
                  <span className={`absolute bottom-3 right-4 text-xs tabular-nums transition-colors ${
                    formData.description.length >= MAX_DESC
                      ? 'text-red-400'
                      : formData.description.length >= MAX_DESC * 0.8
                      ? 'text-amber-500'
                      : 'text-text-muted/50'
                  }`}>
                    {formData.description.length} / {MAX_DESC}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-3 bg-white text-text-primary border border-gray-200 rounded-full pl-6 pr-2 py-2 font-medium transition-all duration-300 hover:bg-text-primary hover:text-white hover:border-text-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-base font-medium transition-colors duration-300">
                    {isSubmitting ? 'Sending…' : 'Send message'}
                  </span>
                  <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#FF774D] overflow-hidden">
                    <svg
                      className="w-5 h-5 text-white transition-transform duration-300 ease-out group-hover:translate-x-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <svg
                      className="absolute w-5 h-5 text-white -translate-x-10 transition-transform duration-300 ease-out group-hover:translate-x-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.button>
              </div>
            </div>

            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
