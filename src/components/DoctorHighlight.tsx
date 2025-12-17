import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Calendar } from 'lucide-react';

interface Doctor {
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

const DoctorHighlight: React.FC = () => {
  const doctors: Doctor[] = [
    {
      name: 'Dr. Sarah Mitchell',
      specialty: 'Internal Medicine',
      qualification: 'MD, FACP',
      experience: '15+ years',
      description: 'Specializing in preventive care and chronic disease management with a patient-first approach.',
      imageUrl: '/chef.png',
      featured: true,
    },
    {
      name: 'Dr. James Chen',
      specialty: 'Family Medicine',
      qualification: 'MD, AAFP',
      experience: '12+ years',
      description: 'Providing comprehensive care for patients of all ages with focus on holistic health.',
      imageUrl: '/chef.png',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="bg-[#F7FAFC] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#1F7A8C]"></div>
            <span className="text-[#1F7A8C] font-semibold uppercase tracking-wider text-sm">
              Our Team
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Expert Medical Care
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl">
            Meet our board-certified physicians dedicated to providing exceptional healthcare
          </p>
        </motion.div>

        {/* Doctor Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {doctors.map((doctor, index) => (
            <motion.article
              key={index}
              variants={cardVariants}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Featured Badge */}
                {doctor.featured && (
                  <div className="absolute top-6 right-6 bg-[#E36414] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-semibold">Featured</span>
                  </div>
                )}

                {/* Name on Image */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-white/90 text-lg font-medium">
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Credentials */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <GraduationCap className="h-5 w-5 text-[#1F7A8C]" />
                    <span className="text-sm font-medium">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <Calendar className="h-5 w-5 text-[#1F7A8C]" />
                    <span className="text-sm font-medium">{doctor.experience}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#64748B] leading-relaxed mb-6">
                  {doctor.description}
                </p>

                {/* CTA */}
                <a
                  href="#book"
                  className="inline-block bg-[#1F7A8C] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-[#176270] hover:shadow-md"
                >
                  Book Appointment
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default DoctorHighlight;