import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ClipboardList, Stethoscope, CheckCircle } from 'lucide-react';

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceProcess: React.FC = () => {
  const steps: Step[] = [
    {
      number: '01',
      icon: <Calendar className="h-6 w-6" />,
      title: 'Book Your Appointment',
      description: 'Schedule a convenient time online or by phone',
    },
    {
      number: '02',
      icon: <ClipboardList className="h-6 w-6" />,
      title: 'Complete Registration',
      description: 'Fill out medical history and insurance information',
    },
    {
      number: '03',
      icon: <Stethoscope className="h-6 w-6" />,
      title: 'Consultation & Care',
      description: 'Meet with our physician for examination and treatment',
    },
    {
      number: '04',
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Follow-Up Support',
      description: 'Receive care plan and ongoing health guidance',
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
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
            What to Expect
          </h2>
          <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
            Our simple four-step process ensures you receive quality care
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connecting Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-[#E2E8F0] -z-10"></div>
              )}

              {/* Icon Circle */}
              <div className="relative w-24 h-24 bg-[#F7FAFC] border-2 border-[#1F7A8C] rounded-full flex items-center justify-center mb-6">
                <div className="text-[#1F7A8C]">
                  {step.icon}
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#1F7A8C] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                {step.title}
              </h3>
              <p className="text-[#64748B] leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ServiceProcess;