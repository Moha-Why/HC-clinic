import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Clock, Calendar, Phone } from 'lucide-react';

interface Doctor {
  name: string;
  specialty: string;
  bio: string;
  experience: string;
  imageUrl: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutPage = () => {
  const doctors: Doctor[] = [
    {
      name: 'Dr. Sarah Mitchell',
      specialty: 'Internal Medicine',
      bio: 'Board-certified internist with 15+ years of experience specializing in preventive care and chronic disease management.',
      experience: '15+ years',
      imageUrl: '/chef.png',
    },
    {
      name: 'Dr. James Chen',
      specialty: 'Family Medicine',
      bio: 'Dedicated family physician providing comprehensive care for patients of all ages with a focus on holistic health.',
      experience: '12+ years',
      imageUrl: '/chef.png',
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      bio: 'Compassionate pediatrician committed to ensuring the health and wellness of children from infancy through adolescence.',
      experience: '10+ years',
      imageUrl: '/chef.png',
    },
  ];

  const features: Feature[] = [
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Professional Care',
      description: 'Board-certified physicians providing expert medical treatment',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Compassionate Service',
      description: 'Patient-centered approach with personalized attention',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Experienced Team',
      description: 'Highly skilled medical professionals with decades of expertise',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Convenient Hours',
      description: 'Flexible scheduling including evenings and weekends',
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
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
    <div className="min-h-screen bg-white">
      
       {/* Page Hero */}
      <section className="relative bg-white py-8 md:py-16 lg:py-24">
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
                Who We Are
              </span>
              <div className="h-px w-12 bg-[#1F7A8C]"></div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] mb-8 leading-tight">
              About Us
            </h1>
            
            <p className="text-xl md:text-2xl text-[#64748B] max-w-3xl mx-auto leading-relaxed">
              Professional care for your health and well-being
            </p>

            {/* Decorative shape */}
            <div className="mt-12 flex justify-center">
              <div className="w-20 h-1 bg-[#E36414] rounded-full"></div>
            </div>
          </motion.div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#1F7A8C] opacity-[0.02] rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Clinic Story */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F7A8C] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-[#64748B] leading-relaxed">
                <p>
                  HealthCare Clinic was founded with a simple mission: to provide exceptional, 
                  compassionate medical care to our community. For over two decades, we've been 
                  dedicated to improving the health and well-being of our patients through 
                  evidence-based medicine and personalized treatment plans.
                </p>
                <p>
                  Our team of board-certified physicians brings together decades of combined 
                  experience across multiple specialties. We believe in treating the whole person, 
                  not just symptoms, and building lasting relationships with our patients based on 
                  trust and mutual respect.
                </p>
                <p>
                  Located in the heart of the medical district, our modern facility is equipped 
                  with state-of-the-art technology while maintaining a warm, welcoming environment 
                  where patients feel comfortable and cared for.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/clinic.jpg"
                  alt="HealthCare Clinic facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Doctor Team Section */}
      <section className="bg-[#F7FAFC] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
              Meet Our Doctors
            </h2>
            <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
              Experienced professionals providing compassionate care
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {doctors.map((doctor, index) => (
              <motion.article
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1F7A8C]/10">
                      <img
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#E36414] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {doctor.experience}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-[#1F7A8C] font-semibold mb-4">
                    {doctor.specialty}
                  </p>
                  <p className="text-[#64748B] leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              We're committed to providing the highest standard of medical care
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col items-center text-center p-6 bg-[#F7FAFC] rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#1F7A8C] rounded-full flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#64748B]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#F7FAFC] py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-6">
              Ready to Experience Professional Medical Care?
            </h2>
            <p className="text-lg text-[#64748B] mb-8">
              Schedule your appointment today and take the first step towards better health
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
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#1F7A8C] text-[#1F7A8C] px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 hover:bg-[#1F7A8C] hover:text-white"
              >
                <Phone className="h-5 w-5" />
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;