import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fas } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'
// library.add(fas, far, fab)
import { MapPin, Phone, Mail } from 'lucide-react';

const HomeFooterCTA: React.FC = () => {

  return (
    <>
      {/* Footer */}
      <footer className="bg-[#1F7A8C] text-[#F7FAFC] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Clinic Info */}
            <div>
              <h3 className="text-2xl font-bold mb-3">HealthCare Clinic</h3>
              <p className="text-[#F7FAFC]/80 mb-4">
                Providing compassionate care and medical excellence to our community
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-[#F7FAFC]/80 hover:text-white transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-[#F7FAFC]/80 hover:text-white transition-colors duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-[#F7FAFC]/80 hover:text-white transition-colors duration-200">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-[#F7FAFC]/80 hover:text-white transition-colors duration-200">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Phone className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-[#F7FAFC]/80">(123) 456-7890</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-[#F7FAFC]/80">info@healthcare.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-[#F7FAFC]/80">
                    123 Healthcare Boulevard<br />Medical District, MD 12345
                  </span>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="#facebook"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8' fill='#F7FAFC' viewBox="0 0 640 640"><path d="M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z"/></svg>
                </a>
                <a
                  href="#instagram"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8' fill='#F7FAFC' viewBox="0 0 640 640"><path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/></svg>
                </a>
                <a
                  href="#linkedin"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8' fill='#F7FAFC' viewBox="0 0 640 640"><path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-[#F7FAFC]/60 text-sm">
              © 2024 HealthCare Clinic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomeFooterCTA;