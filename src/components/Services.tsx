/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";

interface ServicesProps {
  setPage: (page: string) => void;
}

// Static data stored in memory once, preventing lag on re-renders
const SERVICES_DATA = [
  { id: "c-ext", name: "Classic Extensions", price: "R350", category: "Extensions", desc: "A 1:1 application for a natural, mascara-like finish.", img: "/images/classic-extensions.jpg", duration: "90 min" },
  { id: "h-ext", name: "Hybrid Extensions", price: "R400", category: "Extensions", desc: "A blend of Classic and Volume for textured, wispy perfection.", img: "/images/hybrid-extensions.jpg", duration: "105 min" },
  { id: "h-ext-alt", name: "Hybrid (Textured)", price: "R400", category: "Extensions", desc: "Alternative styling for a slightly denser, fluttery hybrid look.", img: "/images/hybrid-extensions-alt.jpg", duration: "105 min" },
  { id: "h-cat-1", name: "Hybrid Cat Eye", price: "R420", category: "Extensions", desc: "Elongated outer corners for a sultry, winged effect.", img: "/images/hybrid-cat-eye-1.jpg", duration: "110 min" },
  { id: "h-cat-2", name: "Hybrid Cat (Dramatic)", price: "R420", category: "Extensions", desc: "A bolder, fuller take on the classic cat eye mapping.", img: "/images/hybrid-cat-eye-2.jpg", duration: "110 min" },
  { id: "v-ext", name: "Volume Extensions", price: "R450", category: "Extensions", desc: "Handmade fans applied to a single lash for dramatic density.", img: "/images/volume-extensions.jpg", duration: "120 min" },
  { id: "b-lam", name: "Brow Lamination", price: "R300", category: "Brows", desc: "Restructures brow hairs to keep them in a desired, fluffy shape.", img: "/images/brow-lamination.jpg", duration: "45 min" },
  { id: "b-shape", name: "Brow Shape & Tint", price: "R200", category: "Brows", desc: "Precision shaping and custom tinting for defined, clean arches.", img: "/images/brow-shape-tint.jpg", duration: "30 min" },
  { id: "l-lift", name: "Lash Lift", price: "R350", category: "Lifts", desc: "A semi-permanent curl and tint for your natural lashes.", img: "/images/lash-lift.jpg", duration: "60 min" }
];

const CATEGORIES = ["All", "Extensions", "Brows", "Lifts"];

// Ultra-lightweight animation configurations
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

const Services = memo(function Services({ setPage }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices = activeCategory === "All" 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === activeCategory);

  return (
    <main className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        
        {/* Header Section */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-center mb-16"
            style={{ willChange: "opacity, transform" }}
        >
            <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-6 block">Our Menu</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 uppercase">Signature Services.</h1>
            <p className="text-gray-500 text-lg font-light max-w-xl mx-auto tracking-wide leading-relaxed">
                Bespoke enhancements tailored to your natural facial architecture.
            </p>
        </motion.div>

        {/* Minimalist Category Filter */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-wrap justify-center gap-6 mb-16 border-b border-gray-200 pb-4"
        >
            {CATEGORIES.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`pb-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 relative ${
                        activeCategory === category 
                        ? "text-[#1A1A1A]" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {category}
                    {/* Active underline indicator */}
                    {activeCategory === category && (
                        <motion.div 
                            layoutId="activeTab" 
                            className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#1A1A1A]" 
                        />
                    )}
                </button>
            ))}
        </motion.div>

        {/* High-Performance Animated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                    <motion.div 
                        key={service.id}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeUp}
                        className="flex flex-col group"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative mb-6 rounded-sm">
                            <img 
                                src={service.img} 
                                alt={service.name}
                                decoding="async"
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-sm flex items-center gap-1.5 border border-white/20 shadow-sm">
                                <Clock size={10} className="text-[#1A1A1A]" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]">{service.duration}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col flex-grow px-2">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-medium tracking-wide text-[#1A1A1A]">{service.name}</h3>
                                <span className="text-sm font-bold text-gray-500">{service.price}</span>
                            </div>
                            <p className="text-gray-400 font-light mb-6 flex-grow text-sm leading-relaxed">
                                {service.desc}
                            </p>
                            
                            <button 
                                onClick={() => setPage("booking")}
                                className="w-fit pb-1 border-b border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] flex items-center gap-2 hover:text-gray-500 hover:border-gray-500 transition-colors duration-300 mt-auto"
                            >
                                Book Session <ArrowRight size={12} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

      </div>
    </main>
  );
});

export default Services;