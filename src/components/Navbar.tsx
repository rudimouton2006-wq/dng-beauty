/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

export default function Navbar({ currentPage, setPage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const navItems = [
    { name: "Services", id: "services" },
    { name: "Training", id: "training" },
    { name: "Gallery", id: "gallery" },
    { name: "Book Now", id: "booking" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm py-4" : "bg-transparent py-6"
      }`}
      aria-label="Main Navigation"
    >
      <div className="luxury-container flex items-center justify-between">
        <button 
          onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="text-2xl tracking-tighter font-black uppercase transition-transform duration-500 hover:scale-105 active:scale-95 z-50 relative"
          aria-label="DnG Beauty Home"
        >
          DnG <span className="font-light text-brand-gold">BEAUTY</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer font-black relative py-2 ${
                currentPage === item.id ? "text-brand-gold" : "text-brand-charcoal hover:text-brand-gold"
              }`}
              aria-current={currentPage === item.id ? "page" : undefined}
            >
              {item.name}
              {currentPage === item.id && (
                <motion.div 
                  layoutId="navTab"
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand-gold"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-brand-charcoal transition-transform duration-300 hover:scale-110 z-50 p-2 relative"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={28} strokeWidth={2} /> : <Menu size={28} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-12 h-[100dvh]"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => { 
                  setPage(item.id); 
                  setIsOpen(false); 
                  window.scrollTo({ top: 0, behavior: "smooth" }); 
                }}
                className={`text-4xl tracking-tighter font-black uppercase transition-all duration-300 hover:text-brand-gold hover:scale-105 active:scale-95 ${
                  currentPage === item.id ? "text-brand-gold" : "text-brand-charcoal"
                }`}
              >
                {item.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}