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
    <footer className="bg-white pt-32 pb-16 border-t border-black/5 relative overflow-hidden" aria-label="Site Footer">
      <div className="luxury-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="md:col-span-2"
          >
            <button 
              onClick={() => { setPage("home"); scrollToTop(); }} 
              className="text-4xl font-black tracking-tighter mb-8 block hover:text-brand-gold transition-colors duration-500"
              aria-label="Back to home"
            >
              DnG BEAUTY.
            </button>
            <p className="text-brand-charcoal/60 text-lg leading-relaxed font-medium max-w-sm">
              We provide professional, elite-tier beauty services in Cape Town. Elevate your aesthetic and feel beautiful every single day.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-10 block">Navigation</span>
            <nav aria-label="Footer Navigation">
              <ul className="space-y-6">
                <li>
                  <button onClick={() => { setPage("services"); scrollToTop(); }} className="text-brand-charcoal/70 hover:text-brand-gold transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-4"></span> Price List
                  </button>
                </li>
                <li>
                  <button onClick={() => { setPage("training"); scrollToTop(); }} className="text-brand-charcoal/70 hover:text-brand-gold transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-4"></span> Training
                  </button>
                </li>
                <li>
                  <button onClick={() => { setPage("gallery"); scrollToTop(); }} className="text-brand-charcoal/70 hover:text-brand-gold transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-4"></span> Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => { setPage("booking"); scrollToTop(); }} className="text-brand-charcoal/70 hover:text-brand-gold transition-all duration-300 text-sm uppercase tracking-widest font-black flex items-center gap-3 group">
                    <span className="w-0 h-[2px] bg-brand-gold transition-all duration-300 group-hover:w-4"></span> Book Now
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
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-10 block">Connect</span>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/dng_beauty_/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-brand-charcoal hover:bg-brand-charcoal hover:text-white hover:border-brand-charcoal transition-all duration-500 hover:-translate-y-1 shadow-sm" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="tel:+27787030732" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-brand-charcoal hover:bg-brand-charcoal hover:text-white hover:border-brand-charcoal transition-all duration-500 hover:-translate-y-1 shadow-sm" aria-label="Phone">
                <Phone size={20} />
              </a>
              <a href="mailto:info@dngbeauty.co.za" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-brand-charcoal hover:bg-brand-charcoal hover:text-white hover:border-brand-charcoal transition-all duration-500 hover:-translate-y-1 shadow-sm" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
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
  onClick={() => setPage("login")} 
  className="cursor-pointer"
>
  © 2026 DnG Beauty. All rights reserved.
</span>
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-2 text-[10px] text-brand-charcoal/40 font-black uppercase tracking-widest">
                 <MapPin size={12} className="text-brand-gold" /> Cape Town, South Africa
              </div>
              <button 
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-charcoal hover:bg-brand-gold hover:text-white transition-colors duration-300 border border-black/5 shadow-sm"
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