import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, Brain, Activity, Users, Clock } from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServicesPreview: React.FC = () => {
  const services: Service[] = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: 'General Medicine',
      description: 'Comprehensive primary care for all your health needs',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Cardiology',
      description: 'Expert heart health monitoring and treatment',
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Mental Health',
      description: 'Professional counseling and psychiatric care',
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: 'Physical Therapy',
      description: 'Personalized rehabilitation and recovery programs',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Pediatric Care',
      description: 'Specialized healthcare for infants and children',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Urgent Care',
      description: 'Quick treatment for non-emergency conditions',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="bg-[#F7FAFC] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
            Our Services
          </h2>
          <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
            Comprehensive healthcare services tailored to your needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-8 border border-[#E2E8F0] transition-all duration-200 hover:border-[#1F7A8C] hover:shadow-lg"
            >
              <div className="flex flex-col items-start">
                <div className="mb-4 text-[#1F7A8C]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                  {service.title}
                </h3>
                <p className="text-[#64748B] leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesPreview;