import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="bg-[#F7FAFC] py-8 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6">
              Quality Healthcare You Can Trust
            </h1>
            
            <p className="text-lg md:text-xl text-[#64748B] mb-8 leading-relaxed max-w-xl">
              Experience compassionate care from our dedicated team of medical professionals. We're here to support your health journey every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-2 bg-[#E36414] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 hover:bg-[#C55510]"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </a>
              
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#1F7A8C] text-[#1F7A8C] px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 hover:bg-[#1F7A8C] hover:text-white"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="relative flex justify-center group lg:justify-end"
          >
            {/* Background shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[85%] h-[85%] bg-[#1F7A8C] opacity-10 rounded-3xl transition-transform duration-300 transform rotate-2 group-hover:rotate-6"></div>
            </div>
            
            {/* Image placeholder */}
            <div className="relative z-10 w-full max-w-lg aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#1F7A8C]/5 to-[#E36414]/5">
                <svg
                  className="w-2/3 h-2/3 text-[#1F7A8C] opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div className="absolute bottom-8 left-8 right-8 text-center">
                  <p className="text-[#64748B] text-sm font-medium">
                    This is where we put your clinic Image or logo
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;