/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface ServicesProps {
  setPage: (page: string) => void;
}

// --- DATA ARCHITECTURE (With Luxury Copywriting) ---

const EXTENSIONS = [
  { 
    id: "classics", 
    name: "Classics", 
    duration: "3 Hours", 
    desc: "The epitome of understated elegance. A flawless, 1:1 application that enhances your natural lash line with a sophisticated, mascara-like finish.",
    images: ["/images/classic-extensions.jpg"],
    prices: [ { label: "Full Set", price: "R350" }, { label: "Cat Eye", price: "R380" }, { label: "2-3 Week Fill", price: "R250" }, { label: "3-4 Week Fill", price: "R300" } ]
  },
  { 
    id: "mega-classics", 
    name: "Mega Classics", 
    duration: "3 Hours", 
    desc: "A denser approach to the classic technique, utilizing slightly thicker extensions to deliver a bolder, more defined framework.",
    images: ["/images/mega-classics.jpg"],
    prices: [ { label: "Full Set", price: "R370" }, { label: "2-3 Week Fill", price: "R270" }, { label: "3-4 Week Fill", price: "R300" } ]
  },
  { 
    id: "hybrids", 
    name: "Hybrids", 
    duration: "3 Hours", 
    desc: "The perfect equilibrium. A bespoke blend of classic and volume techniques, offering textured density while maintaining an effortless, wispy aesthetic.",
    // Slider Images
    images: ["/images/hybrid-extensions.jpg", "/images/hybrid-extensions-alt.jpg", "/images/hybrid-cat-eye-1.jpg", "/images/hybrid-cat-eye-2.jpg"],
    prices: [ { label: "Full Set", price: "R400" }, { label: "Cat Eye", price: "R420" }, { label: "2-3 Week Fill", price: "R300" }, { label: "3-4 Week Fill", price: "R350" } ]
  },
  { 
    id: "volume", 
    name: "Volume", 
    duration: "3 Hours", 
    desc: "Uncompromising glamour. Hand-crafted fans of multiple ultra-fine extensions are applied to a single natural lash for maximum density and dramatic fluff.",
    images: ["/images/volume-extensions.jpg"],
    prices: [ { label: "Full Set", price: "R450" }, { label: "2-3 Week Fill", price: "R350" }, { label: "3-4 Week Fill", price: "R400" } ]
  },
  { 
    id: "wispy", 
    name: "Wispy + Spikes", 
    duration: "3 Hours", 
    desc: "Our signature editorial look. A highly customized, textured set combining closed volume spikes with soft, feathery bases for a modern, stripped-lash illusion.",
    images: ["/images/wispy-spikes.jpg"],
    prices: [ { label: "Full Set", price: "R500" }, { label: "2-3 Week Fill", price: "R390" }, { label: "3-4 Week Fill", price: "R400" } ]
  }
];

const CLUSTERS = [
  { id: "c1", name: "Classics", price: "R150", duration: "30 Min" },
  { id: "c2", name: "Classic Cat Eye", price: "R160", duration: "30 Min" },
  { id: "c3", name: "Hybrids", price: "R170", duration: "30 Min" },
  { id: "c4", name: "Hybrid Cat Eye", price: "R180", duration: "30 Min" },
  { id: "c5", name: "Volume", price: "R200", duration: "30 Min" },
  { id: "c6", name: "Volume Cat Eye", price: "R220", duration: "30 Min" },
  { id: "c7", name: "Wispy Set", price: "R250", duration: "30 Min" },
];

const ADD_ONS = [
  { id: "a1", name: "Brow Shape", price: "R50", duration: "30 Min", desc: "Precision waxing and tweezing to sculpt your arches perfectly to your bone structure.", img: "/images/brow-shape.jpg" },
  { id: "a2", name: "Brow Shape + Tint", price: "R100", duration: "1 Hour", desc: "Sculpting paired with custom color-matching to define and fill the brow architecture.", img: "/images/brow-shape-tint.jpg" },
  { id: "a3", name: "Brow Lamination + Free Tint", price: "R300", duration: "45 Min", desc: "A semi-permanent relaxing treatment that realigns brow hairs for a fuller, feathery aesthetic.", img: "/images/brow-lamination.jpg" },
  { id: "a4", name: "Lash Lift", price: "R350", duration: "60 Min", desc: "We permanently curl your natural lashes upward, opening the eye and delivering a flawless look.", img: "/images/lash-lift.jpg" }
];

const CATEGORIES = ["Extensions", "Clusters", "Add-Ons"];

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

// --- IMAGE CAROUSEL COMPONENT ---
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);

  if (images.length === 1) {
    return <img src={images[0]} alt="Service" decoding="async" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />;
  }

  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % images.length); };
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + images.length) % images.length); };

  return (
    <div className="relative w-full h-full overflow-hidden group/slider">
      <img key={index} src={images[index]} alt="Service" decoding="async" loading="lazy" className="w-full h-full object-cover" />
      
      {/* Slider Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
        <button onClick={prevImage} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-[#1A1A1A] hover:bg-white"><ChevronLeft size={16}/></button>
        <button onClick={nextImage} className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-[#1A1A1A] hover:bg-white"><ChevronRight size={16}/></button>
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Services = memo(function Services({ setPage }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState("Extensions");

  return (
    <main className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        
        {/* Header Section (Updated with Luxury Copy) */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16" style={{ willChange: "opacity, transform" }}>
            <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-6 block">Service Portfolio</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 uppercase">Bespoke Artistry.</h1>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
                Discover our curated portfolio of luxury lash and brow enhancements, meticulously tailored to complement your unique facial architecture.
            </p>
        </motion.div>

        {/* Minimalist Category Filter */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap justify-center gap-6 mb-16 border-b border-gray-200 pb-4">
            {CATEGORIES.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`pb-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 relative ${
                        activeCategory === category ? "text-[#1A1A1A]" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {category}
                    {activeCategory === category && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#1A1A1A]" />
                    )}
                </button>
            ))}
        </motion.div>

        <AnimatePresence mode="wait">
          
          {/* EXTENSIONS GRID */}
          {activeCategory === "Extensions" && (
            <motion.div key="extensions" initial="hidden" animate="visible" exit="exit" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {EXTENSIONS.map((service) => (
                  <div key={service.id} className="flex flex-col group">
                      <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative mb-6 rounded-sm">
                          <ImageCarousel images={service.images} />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-sm">
                              <Clock size={10} className="text-[#1A1A1A]" />
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]">{service.duration}</span>
                          </div>
                      </div>
                      
                      <div className="flex flex-col flex-grow px-2">
                          <h3 className="text-xl font-medium tracking-wide text-[#1A1A1A] mb-2">{service.name}</h3>
                          
                          {/* Injected Luxury Description */}
                          <p className="text-gray-500 font-light text-sm leading-relaxed mb-4 border-b border-gray-100 pb-4">{service.desc}</p>
                          
                          <div className="space-y-3 mb-6 flex-grow">
                            {service.prices.map((p, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{p.label}</span>
                                <span className="text-sm font-medium text-[#1A1A1A]">{p.price}</span>
                              </div>
                            ))}
                          </div>
                          
                          <button 
                              onClick={() => setPage("booking")}
                              className="w-full py-4 border border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 rounded-sm mt-auto"
                          >
                              Book Appointment
                          </button>
                      </div>
                  </div>
              ))}
            </motion.div>
          )}

          {/* CLUSTERS MENU (Text-Only High-End Layout) */}
          {activeCategory === "Clusters" && (
            <motion.div key="clusters" initial="hidden" animate="visible" exit="exit" variants={fadeUp} className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-sm p-8 md:p-12 shadow-sm">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-light uppercase text-[#1A1A1A] mb-2">Cluster Lashes</h3>
                <p className="text-gray-500 font-light text-sm mb-4">Express enhancements delivering temporary, flawless length and volume.</p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center justify-center gap-1"><Clock size={12}/> 30 Minutes</p>
              </div>
              
              <div className="space-y-6">
                {CLUSTERS.map((cluster) => (
                  <div key={cluster.id} className="group cursor-pointer" onClick={() => setPage("booking")}>
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-medium text-[#1A1A1A] group-hover:text-gray-500 transition-colors">{cluster.name}</span>
                      <div className="flex-grow border-b border-dotted border-gray-300 mx-4 mb-2"></div>
                      <span className="text-lg font-light text-[#1A1A1A]">{cluster.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setPage("booking")} className="w-full mt-12 py-4 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors duration-300 rounded-sm">
                Book Clusters
              </button>
            </motion.div>
          )}

          {/* ADD-ONS GRID */}
          {activeCategory === "Add-Ons" && (
            <motion.div key="addons" initial="hidden" animate="visible" exit="exit" variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ADD_ONS.map((addon) => (
                  <div key={addon.id} className="flex flex-col group">
                      <div className="aspect-square overflow-hidden bg-gray-100 relative mb-6 rounded-sm">
                          <img src={addon.img} alt={addon.name} decoding="async" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm">
                              <Clock size={10} className="text-[#1A1A1A]" />
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]">{addon.duration}</span>
                          </div>
                      </div>
                      <div className="flex flex-col flex-grow px-1">
                          <h3 className="text-sm font-medium tracking-wide text-[#1A1A1A] mb-1">{addon.name}</h3>
                          
                          {/* Injected Luxury Description */}
                          <p className="text-gray-500 font-light text-xs leading-relaxed mb-3 flex-grow">{addon.desc}</p>
                          
                          <span className="text-sm font-bold text-gray-500 mb-6">{addon.price}</span>
                          <button onClick={() => setPage("booking")} className="w-fit pb-1 border-b border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[9px] hover:text-gray-500 hover:border-gray-500 transition-colors duration-300 mt-auto">
                              Book Add-On
                          </button>
                      </div>
                  </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
});

export default Services;