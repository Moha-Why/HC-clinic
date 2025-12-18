import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone } from 'lucide-react';
import { Link } from 'react-router';

const ServicesCTA: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="bg-[#F7FAFC] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center"
        >
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6">
            Ready to Book Your Appointment?
          </h2>
          
          {/* Supporting Text */}
          <p className="text-lg md:text-xl text-[#64748B] mb-8 max-w-2xl mx-auto">
            Take the first step towards better health. Our team is ready to provide you with exceptional care.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 bg-[#E36414] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 hover:bg-[#C55510]"
            >
              <Calendar className="h-5 w-5" />
              Book Appointment
            </Link>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center border-2 border-[#1F7A8C] text-[#1F7A8C] gap-2 hover:bg-[#1F7A8C] hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 "
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesCTA;