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

// Static data extracted to prevent memory reallocation
const SERVICES_DATA = [
  { 
    id: "c-full", 
    name: "Classics Full Set", 
    price: "R350", 
    category: "Extensions", 
    desc: "A 1:1 application for a natural, mascara-like finish.",
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600", 
    duration: "90 min" 
  },
  { 
    id: "h-full", 
    name: "Hybrids Full Set", 
    price: "R400", 
    category: "Extensions", 
    desc: "A blend of Classic and Volume for textured, wispy perfection.",
    img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=600", 
    duration: "105 min" 
  },
  { 
    id: "v-full", 
    name: "Volume Full Set", 
    price: "R450", 
    category: "Extensions", 
    desc: "Handmade fans applied to a single lash for dramatic density.",
    img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600", 
    duration: "120 min" 
  },
  { 
    id: "b-lam", 
    name: "Brow Lamination", 
    price: "R300", 
    category: "Brows", 
    desc: "Restructures brow hairs to keep them in a desired shape.",
    img: "https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=600", 
    duration: "45 min" 
  },
  { 
    id: "l-lift", 
    name: "Lash Lift & Tint", 
    price: "R350", 
    category: "Lifts", 
    desc: "A semi-permanent curl and tint for your natural lashes.",
    img: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=600", 
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
    <main className="bg-brand-light min-h-screen font-sans text-brand-charcoal pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        
        {/* Header Section */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-center mb-16"
            style={{ willChange: "opacity, transform" }}
        >
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Our Menu</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Signature Services.</h1>
            <p className="text-brand-charcoal/60 text-lg font-medium max-w-xl mx-auto">
                Bespoke enhancements tailored to your natural facial architecture.
            </p>
        </motion.div>

        {/* High-Performance Category Filter */}
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-wrap justify-center gap-2 mb-16"
        >
            {CATEGORIES.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                        activeCategory === category 
                        ? "bg-brand-charcoal text-white shadow-lg scale-105" 
                        : "bg-white text-brand-charcoal/50 hover:bg-gray-50 border border-black/5"
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
                        className="bg-white border border-black/5 flex flex-col group overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 rounded-2xl"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                            <img 
                                src={service.img} 
                                alt={service.name}
                                // Asynchronous decoding to prevent main thread blocking
                                decoding="async"
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Clock size={12} className="text-brand-gold" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal">{service.duration}</span>
                            </div>
                        </div>
                        
                        <div className="p-8 flex flex-col flex-grow">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-2 block">{service.category}</span>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-black tracking-tight text-brand-charcoal">{service.name}</h3>
                                <span className="text-xl font-black text-brand-charcoal">{service.price}</span>
                            </div>
                            <p className="text-brand-charcoal/60 font-medium mb-8 flex-grow">
                                {service.desc}
                            </p>
                            
                            <button 
                                onClick={() => setPage("booking")}
                                className="w-full py-4 bg-brand-light text-brand-charcoal font-black tracking-widest uppercase text-xs hover:bg-brand-charcoal hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 rounded-xl"
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