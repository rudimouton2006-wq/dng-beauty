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

// Updated with Gabby's exact service list and local imagery
const SERVICES_DATA = [
  { 
    id: "c-ext", 
    name: "Classic Extensions", 
    price: "R350", 
    category: "Extensions", 
    desc: "A 1:1 application for a natural, mascara-like finish.",
    img: "/images/classic-extensions.jpg", 
    duration: "90 min" 
  },
  { 
    id: "h-ext", 
    name: "Hybrid Extensions", 
    price: "R400", 
    category: "Extensions", 
    desc: "A blend of Classic and Volume for textured, wispy perfection.",
    img: "/images/hybrid-extensions.jpg", 
    duration: "105 min" 
  },
  { 
    id: "h-ext-alt", 
    name: "Hybrid Extensions (Textured)", 
    price: "R400", 
    category: "Extensions", 
    desc: "Alternative styling for a slightly denser, fluttery hybrid look.",
    img: "/images/hybrid-extensions-alt.jpg", 
    duration: "105 min" 
  },
  { 
    id: "h-cat-1", 
    name: "Hybrid Cat Eye", 
    price: "R420", 
    category: "Extensions", 
    desc: "Elongated outer corners for a sultry, winged effect.",
    img: "/images/hybrid-cat-eye-1.jpg", 
    duration: "110 min" 
  },
  { 
    id: "h-cat-2", 
    name: "Hybrid Cat Eye (Dramatic)", 
    price: "R420", 
    category: "Extensions", 
    desc: "A bolder, fuller take on the classic cat eye mapping.",
    img: "/images/hybrid-cat-eye-2.jpg", 
    duration: "110 min" 
  },
  { 
    id: "v-ext", 
    name: "Volume Extensions", 
    price: "R450", 
    category: "Extensions", 
    desc: "Handmade fans applied to a single lash for dramatic density.",
    img: "/images/volume-extensions.jpg", 
    duration: "120 min" 
  },
  { 
    id: "b-lam", 
    name: "Brow Lamination", 
    price: "R300", 
    category: "Brows", 
    desc: "Restructures brow hairs to keep them in a desired, fluffy shape.",
    img: "/images/brow-lamination.jpg", 
    duration: "45 min" 
  },
  { 
    id: "b-shape", 
    name: "Normal Brow Shape & Tint", 
    price: "R200", 
    category: "Brows", 
    desc: "Precision shaping and custom tinting for defined, clean arches.",
    img: "/images/brow-shape-tint.jpg", 
    duration: "30 min" 
  },
  { 
    id: "l-lift", 
    name: "Lash Lift", 
    price: "R350", 
    category: "Lifts", 
    desc: "A semi-permanent curl and tint for your natural lashes.",
    img: "/images/lash-lift.jpg", 
    duration: "60 min" 
  }
];

const CATEGORIES = ["All", "Extensions", "Brows", "Lifts"];

// GPU-accelerated variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
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
            <span className="text-xs tracking-widest uppercase font-black text-gray-500 mb-6 block">Our Menu</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 uppercase">Signature Services.</h1>
            <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto tracking-wide">
                Bespoke enhancements tailored to your natural facial architecture.
            </p>
        </motion.div>

        {/* High-Performance Category Filter */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-wrap justify-center gap-3 mb-16"
        >
            {CATEGORIES.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                        activeCategory === category 
                        ? "bg-[#1A1A1A] text-white shadow-md" 
                        : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                    }`}
                >
                    {category}
                </button>
            ))}
        </motion.div>

        {/* Animated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                    <motion.div 
                        key={service.id}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeUp}
                        className="bg-white border border-gray-100 flex flex-col group overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500 rounded-sm"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                            <img 
                                src={service.img} 
                                alt={service.name}
                                // Asynchronous decoding to prevent main thread blocking
                                decoding="async"
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-sm">
                                <Clock size={12} className="text-gray-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">{service.duration}</span>
                            </div>
                        </div>
                        
                        <div className="p-8 flex flex-col flex-grow">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">{service.category}</span>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-medium tracking-wide text-[#1A1A1A]">{service.name}</h3>
                                <span className="text-lg font-medium text-[#1A1A1A]">{service.price}</span>
                            </div>
                            <p className="text-gray-500 font-medium mb-8 flex-grow text-sm leading-relaxed">
                                {service.desc}
                            </p>
                            
                            <button 
                                onClick={() => setPage("booking")}
                                className="w-full py-4 bg-[#FAF9F6] border border-gray-100 text-[#1A1A1A] font-black tracking-widest uppercase text-xs hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 rounded-sm"
                            >
                                Book Session <ArrowRight size={14} />
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