import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { Link } from 'react-router';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-100"
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#home" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-[#1F7A8C] flex items-center justify-center">
                <span className="text-white font-bold text-lg">HC</span>
              </div>
              <span className="text-xl font-semibold text-[#0F172A]">
                HealthCare Clinic
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-2 text-[#0F172A] font-medium rounded-lg transition-colors duration-150 hover:bg-gray-50 hover:text-[#1F7A8C]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <a
              href="tel:+1234567890"
              className="flex items-center space-x-2 text-[#1F7A8C] font-medium"
            >
              <Phone className="h-4 w-4" />
              <span>(123) 456-7890</span>
            </a>
            <a
              href="#book"
              className="bg-[#E36414] text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-150 hover:bg-[#C55510]"
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#0F172A] hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode='wait'>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{opacity: 0, y: -10}}
                transition={{ duration: 0.2 }}
                className="lg:hidden border-t border-gray-100 py-4"
            >
                <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                    <Link
                    key={link.name}
                    to={link.href}
                    className="px-4 py-3 text-[#0F172A] font-medium rounded-lg hover:bg-gray-50 hover:text-[#1F7A8C] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    >
                    {link.name}
                    </Link>
                ))}
                <div className="pt-2 space-y-2">
                    <a
                    href="tel:+1234567890"
                    className="flex items-center space-x-2 px-4 py-3 text-[#1F7A8C] font-medium"
                    >
                    <Phone className="h-4 w-4" />
                    <span>(123) 456-7890</span>
                    </a>
                    <a
                    href="#book"
                    className="block mx-4 bg-[#E36414] text-white text-center px-5 py-3 rounded-lg font-medium hover:bg-[#C55510] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    >
                    Book Appointment
                    </a>
                </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;