/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Instagram, Phone, Mail, MapPin, ArrowUp } from "lucide-react";

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <footer className="bg-[#FAF9F6] pt-32 pb-16 border-t border-black/5 relative overflow-hidden" aria-label="Site Footer">
      <div className="max-w-6xl mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-20 mb-32">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="md:col-span-2"
          >
            <button 
              onClick={() => { setPage("home"); scrollToTop(); }} 
              className="text-4xl font-light tracking-tighter mb-8 block hover:text-gray-500 transition-colors duration-500"
              aria-label="Back to home"
            >
              Gabrielle Lashes.
            </button>
            <p className="text-[#1A1A1A]/70 text-lg leading-relaxed font-medium max-w-sm">
              Luxury lash extensions tailored to your eye shape. Elevate your aesthetic and feel beautiful every single day.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs tracking-widest uppercase font-black text-[#1A1A1A] mb-10 block">Navigation</span>
            <nav aria-label="Footer Navigation">
              <ul className="space-y-6">
                <li>
                  <button onClick={() => { setPage("services"); scrollToTop(); }} className="text-[#1A1A1A]/70 hover:text-black transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-4"></span> Price List
                  </button>
                </li>
                <li>
                  <button onClick={() => { setPage("training"); scrollToTop(); }} className="text-[#1A1A1A]/70 hover:text-black transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-4"></span> Training
                  </button>
                </li>
                <li>
                  <button onClick={() => { setPage("gallery"); scrollToTop(); }} className="text-[#1A1A1A]/70 hover:text-black transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-4"></span> Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => { setPage("booking"); scrollToTop(); }} className="text-[#1A1A1A]/70 hover:text-black transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-4"></span> Book Now
                  </button>
                </li>
              </ul>
            </nav>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs tracking-widest uppercase font-black text-[#1A1A1A] mb-10 block">Contact</span>
            <ul className="space-y-5">
              <li>
                <a href="https://www.instagram.com/dng_beauty_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#1A1A1A]/70 hover:text-black transition-colors text-sm font-medium group">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform duration-300" /> @dng_beauty_
                </a>
              </li>
              <li>
                <a href="tel:+27787030732" className="flex items-center gap-3 text-[#1A1A1A]/70 hover:text-black transition-colors text-sm font-medium group">
                  <Phone size={18} className="group-hover:scale-110 transition-transform duration-300" /> +27 78 703 0732
                </a>
              </li>
              <li>
                <a href="mailto:dngbeauty@gmail.com" className="flex items-center gap-3 text-[#1A1A1A]/70 hover:text-black transition-colors text-sm font-medium group">
                  <Mail size={18} className="group-hover:scale-110 transition-transform duration-300" /> dngbeauty@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-[#1A1A1A]/70 text-sm font-medium pt-2">
                <MapPin size={18} className="shrink-0 mt-0.5" /> 
                <span>38 Welkom Street,<br/>Portlands</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-black/5 gap-8"
        >
           <span 
             onClick={() => { setPage("login"); scrollToTop(); }} 
             className="cursor-pointer hover:text-black transition-colors duration-300 text-sm font-medium text-[#1A1A1A]/60"
           >
             © {new Date().getFullYear()} DnG Beauty. All rights reserved.
           </span>
           
           <div className="flex items-center gap-10">
              <button 
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-black hover:text-white transition-colors duration-300 border border-black/5 shadow-sm"
                aria-label="Scroll to top of page"
              >
                <ArrowUp size={16} strokeWidth={3} />
              </button>
           </div>
        </motion.div>
      </div>
    </footer>
  );
}