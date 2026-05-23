/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Lock } from "lucide-react";

interface NavbarProps {
  setPage: (page: string) => void;
}

// Static navigation array to prevent memory reallocation
const NAV_LINKS = [
  { label: "Services", value: "services" },
  { label: "Training", value: "training" },
  { label: "Gallery", value: "gallery" },
];

const Navbar = memo(function Navbar({ setPage }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // High-performance scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // { passive: true } is crucial here: it tells the browser not to wait for React before painting the scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (page: string) => {
    setPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 will-change-transform ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-md shadow-sm py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex justify-between items-center">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick("home")}
            className="text-2xl font-black tracking-[0.2em] text-brand-charcoal uppercase hover:opacity-70 transition-opacity"
          >
            DnG Beauty
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.value}
                onClick={() => handleNavClick(link.value)}
                className="text-xs font-black uppercase tracking-widest text-brand-charcoal hover:text-brand-gold transition-colors"
              >
                {link.label}
              </button>
            ))}
            
            {/* The primary CTA */}
            <button
              onClick={() => handleNavClick("booking")}
              className="text-xs font-black uppercase tracking-widest text-brand-charcoal border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-colors"
            >
              Book Now
            </button>

            {/* Secret Admin Login Icon */}
            <button
                onClick={() => handleNavClick("login")}
                className="ml-4 text-brand-charcoal/20 hover:text-brand-gold transition-colors"
                title="Studio Command"
            >
                <Lock size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-brand-charcoal"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* GPU-Accelerated Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col p-6"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-black tracking-[0.2em] text-brand-charcoal uppercase">
                Menu
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-brand-charcoal p-2 bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-8 text-center flex-grow justify-center">
              <button onClick={() => handleNavClick("home")} className="text-3xl font-black text-brand-charcoal uppercase tracking-widest">Home</button>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.value}
                  onClick={() => handleNavClick(link.value)}
                  className="text-3xl font-black text-brand-charcoal uppercase tracking-widest hover:text-brand-gold transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="w-12 h-[2px] bg-brand-gold mx-auto my-4"></div>
              <button
                onClick={() => handleNavClick("booking")}
                className="text-3xl font-black text-brand-gold uppercase tracking-widest"
              >
                Book Now
              </button>
            </div>

            {/* Mobile Admin Link */}
            <button
                onClick={() => handleNavClick("login")}
                className="text-xs font-black uppercase tracking-widest text-brand-charcoal/30 pb-8 flex items-center justify-center gap-2"
            >
                <Lock size={12} /> Studio Command
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Navbar;