import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  Clock,
  Syringe,
  Pill,
  Baby,
  Eye,
  Bone,
  Thermometer
} from 'lucide-react';
import { Link } from 'react-router';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServicesList: React.FC = () => {
  const services: Service[] = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: 'General Medicine',
      description: 'Comprehensive primary care for routine checkups and health concerns',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Cardiology',
      description: 'Expert heart health monitoring, diagnostics, and treatment',
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Mental Health',
      description: 'Professional counseling and psychiatric care services',
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: 'Physical Therapy',
      description: 'Personalized rehabilitation and recovery programs',
    },
    {
      icon: <Baby className="h-8 w-8" />,
      title: 'Pediatric Care',
      description: 'Specialized healthcare for infants, children, and adolescents',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Urgent Care',
      description: 'Quick treatment for non-emergency medical conditions',
    },
    {
      icon: <Syringe className="h-8 w-8" />,
      title: 'Vaccinations',
      description: 'Complete immunization services for all ages',
    },
    {
      icon: <Pill className="h-8 w-8" />,
      title: 'Pharmacy Services',
      description: 'On-site prescription fulfillment and medication counseling',
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Vision Care',
      description: 'Comprehensive eye exams and vision health assessments',
    },
    {
      icon: <Bone className="h-8 w-8" />,
      title: 'Orthopedics',
      description: 'Treatment for bone, joint, and musculoskeletal conditions',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Family Medicine',
      description: 'Healthcare services for patients of all ages and stages',
    },
    {
      icon: <Thermometer className="h-8 w-8" />,
      title: 'Laboratory Services',
      description: 'Accurate diagnostic testing and health screenings',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="bg-[#F7FAFC] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-8 border border-[#E2E8F0] transition-all duration-200 hover:border-[#1F7A8C] hover:shadow-lg group"
            >
              <div className="flex flex-col">
                {/* Icon */}
                <div className="mb-5 text-[#1F7A8C] transition-transform duration-200 group-hover:scale-110">
                  {service.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-[#64748B] leading-relaxed mb-4 grow">
                  {service.description}
                </p>
                
                {/* Link */}
                <Link
                  to="/contact"
                  className="text-[#1F7A8C] font-medium text-sm hover:text-[#176270] transition-colors duration-200 inline-flex items-center gap-1"
                >
                  Contact us
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesList;