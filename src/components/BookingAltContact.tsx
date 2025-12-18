import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

const BookingAltContact: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-[#F7FAFC] rounded-2xl p-8 md:p-10 border border-[#E2E8F0]"
        >
          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#E2E8F0]"></div>
            <span className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">
              Or
            </span>
            <div className="flex-1 h-px bg-[#E2E8F0]"></div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              Prefer Instant Booking?
            </h2>
            <p className="text-lg text-[#64748B] mb-8">
              Contact us directly via WhatsApp or phone for immediate assistance
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[#20BA5A] hover:shadow-md"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center gap-2 bg-[#1F7A8C] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[#176270] hover:shadow-md"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingAltContact;