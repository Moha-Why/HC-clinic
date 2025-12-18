import React from 'react';
import { motion } from 'framer-motion';

const BookingHero: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="relative bg-white py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center"
        >
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#1F7A8C]"></div>
            <span className="text-[#1F7A8C] font-semibold uppercase tracking-wider text-sm">
              Schedule Your Visit
            </span>
            <div className="h-px w-12 bg-[#1F7A8C]"></div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] mb-8 leading-tight">
            Book an Appointment
          </h1>
          
          <p className="text-xl md:text-2xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
            Choose your preferred date and time, and we'll confirm your appointment within 24 hours
          </p>

          {/* Decorative shape */}
          <div className="mt-12 flex justify-center">
            <div className="w-20 h-1 bg-[#1F7A8C] rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#1F7A8C] opacity-[0.02] rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default BookingHero;