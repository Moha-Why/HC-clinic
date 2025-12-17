import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Calendar} from 'lucide-react';

const ClinicDetails = () => {
  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
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
    <>
      {/* Clinic Info Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              Visit Our Clinic
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              We're here to provide you with the best healthcare experience
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Address */}
            <div className="flex flex-col items-center text-center p-6 bg-[#F7FAFC] rounded-xl">
              <div className="w-12 h-12 bg-[#1F7A8C] rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Our Location
              </h3>
              <p className="text-[#64748B]">
                123 Healthcare Boulevard<br />
                Medical District, MD 12345
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center text-center p-6 bg-[#F7FAFC] rounded-xl">
              <div className="w-12 h-12 bg-[#1F7A8C] rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Contact Us
              </h3>
              <p className="text-[#64748B] mb-1">
                Phone: (123) 456-7890
              </p>
              <p className="text-[#64748B]">
                WhatsApp: (123) 456-7891
              </p>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center text-center p-6 bg-[#F7FAFC] rounded-xl">
              <div className="w-12 h-12 bg-[#1F7A8C] rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Working Hours
              </h3>
              <p className="text-[#64748B] mb-1">
                Mon - Fri: 8:00 AM - 6:00 PM
              </p>
              <p className="text-[#64748B]">
                Sat - Sun: 9:00 AM - 2:00 PM
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="bg-[#F7FAFC] py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6">
              Ready for Care? Book Your Appointment Today
            </h2>
            <p className="text-lg text-[#64748B] mb-8 max-w-2xl mx-auto">
              Our dedicated team is ready to provide you with exceptional healthcare services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-2 bg-[#E36414] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 hover:bg-[#C55510]"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </a>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center gap-2 bg-[#1F7A8C] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 hover:bg-[#176270]"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ClinicDetails;