import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Mail } from 'lucide-react';

interface ContactCard {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
  link?: string;
}

const ContactDetails: React.FC = () => {
  const contactInfo: ContactCard[] = [
    {
      icon: <Phone className="h-6 w-6" />,
      label: 'Phone & WhatsApp',
      value: ['Phone: (123) 456-7890', 'WhatsApp: (123) 456-7891'],
      link: 'tel:+1234567890',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      label: 'Email',
      value: 'info@healthcare.com',
      link: 'mailto:info@healthcare.com',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      label: 'Location',
      value: ['123 Healthcare Boulevard', 'Medical District, MD 12345'],
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Working Hours',
      value: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat - Sun: 9:00 AM - 2:00 PM'],
    },
  ];

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="bg-[#F7FAFC] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Contact Info Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 w-12 h-12 bg-[#1F7A8C] rounded-full flex items-center justify-center text-white">
                    {info.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                      {info.label}
                    </h3>
                    {Array.isArray(info.value) ? (
                      <div className="space-y-1">
                        {info.value.map((line, i) => (
                          <p key={i} className="text-[#64748B]">
                            {info.link && i === 0 ? (
                              <a
                                href={info.link}
                                className="hover:text-[#1F7A8C] transition-colors duration-200"
                              >
                                {line}
                              </a>
                            ) : (
                              line
                            )}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#64748B]">
                        {info.link ? (
                          <a
                            href={info.link}
                            className="hover:text-[#1F7A8C] transition-colors duration-200"
                          >
                            {info.value}
                          </a>
                        ) : (
                          info.value
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Map */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm"
          >
            {/* Map Placeholder */}
            <div className="w-full h-full min-h-100 lg:min-h-150 bg-gray-100 flex items-center justify-center relative">
              
              {/* Example iframe (uncomment and add your actual map URL) */}
              
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3443.1155784549555!2d30.546320999999995!3d30.347665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2seg!4v1766064176156!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
             
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactDetails;