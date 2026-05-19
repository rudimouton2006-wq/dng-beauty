/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram } from "lucide-react";

interface GalleryProps {
  setPage: (page: string) => void;
}

// ----------------------------------------------------------------------
// STATIC HOISTING: Arrays and Physics extracted to prevent reallocation
// ----------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const WORKS_GALLERY = [
  { title: "Signature Hybrid", category: "Lashes", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" },
  { title: "Royal Volume", category: "Lashes", img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=800" },
  { title: "Sculpted Lift", category: "Lifts", img: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=800" },
  { title: "Feathered Arches", category: "Brows", img: "https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=800" },
  { title: "Wispy Spikes", category: "Lashes", img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=800" },
  { title: "Natural Classic", category: "Lashes", img: "https://images.unsplash.com/photo-1510017060271-45f217b0b414?auto=format&fit=crop&q=80&w=800" },
  { title: "Fox Eye Styling", category: "Lashes", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800" },
  { title: "Bold Tint & Shape", category: "Brows", img: "https://images.unsplash.com/photo-1621333100653-5477dae7323b?auto=format&fit=crop&q=80&w=800" },
  { title: "Soft Glam Volume", category: "Lashes", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800" }
];

const TRANSFORMATIONS_DATA = [
  {
    id: 1,
    category: "Lashes",
    title: "Classic Extension Set",
    before: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
    after: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    category: "Brows",
    title: "Brow Lamination",
    before: "https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=600",
    after: "https://images.unsplash.com/photo-1621333100653-5477dae7323b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    category: "Lashes",
    title: "Lash Lift & Tint",
    before: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=600",
    after: "https://images.unsplash.com/photo-1510017060271-45f217b0b414?auto=format&fit=crop&q=80&w=600"
  }
];

const FILTER_CATEGORIES = ["All", "Lashes", "Brows"];

// ----------------------------------------------------------------------
// MEMOIZED COMPONENT: Eliminates wasted render cycles
// ----------------------------------------------------------------------
const Gallery = memo(function Gallery({ setPage }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTransformations = activeFilter === "All" 
    ? TRANSFORMATIONS_DATA 
    : TRANSFORMATIONS_DATA.filter(t => t.category === activeFilter);

  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="luxury-container">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-24"
        >
          <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Our Work</span>
          <h1 className="text-6xl md:text-8xl mb-8 font-black leading-none">The <br /> Gallery.</h1>
          <p className="text-brand-charcoal/80 max-w-xl font-medium text-xl leading-relaxed">
            Take a look at some of the lash and brow transformations we have created for our clients.
          </p>
        </motion.div>

        {/* Primary 3x3 Gallery Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {WORKS_GALLERY.map((work, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group aspect-[3/4] overflow-hidden bg-gray-100 relative rounded-2xl shadow-lg cursor-pointer"
            >
              <img 
                src={work.img} 
                alt={`${work.title} showcase`} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-8 bottom-8 p-6 bg-white/95 backdrop-blur-md rounded-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 shadow-xl border border-white/20">
                <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-2 block">{work.category}</span>
                <h3 className="text-2xl font-black text-brand-charcoal">{work.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Transformations Section */}
        <div className="mt-40">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">The Results</span>
            <h2 className="text-5xl font-black mb-10">Before & After.</h2>
            
            {/* Interactive Filter Control */}
            <div className="flex gap-4 flex-wrap" role="group" aria-label="Filter transformations">
              {FILTER_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  aria-pressed={activeFilter === cat}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeFilter === cat 
                      ? "bg-brand-charcoal text-white shadow-lg scale-105" 
                      : "bg-gray-50 border border-black/5 text-brand-charcoal/40 hover:bg-gray-100 hover:text-brand-charcoal"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-12">
            <AnimatePresence mode="wait">
              {filteredTransformations.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-3xl p-8 md:p-12 border border-black/5 shadow-xl hover:shadow-2xl transition-shadow duration-500"
                >
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 w-full grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-inner bg-gray-100">
                          <img 
                            src={t.before} 
                            alt={`Before ${t.title}`} 
                            className="w-full h-full object-cover grayscale opacity-80" 
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 block text-center">Before</span>
                      </div>
                      <div className="space-y-4">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-brand-gold/20 relative">
                          <img 
                            src={t.after} 
                            alt={`After ${t.title}`} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)] pointer-events-none" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block text-center">After</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                      <span className="text-xs font-black uppercase tracking-widest text-brand-gold">{t.category}</span>
                      <h3 className="text-4xl font-black">{t.title}</h3>
                      <p className="text-brand-charcoal/70 text-lg font-medium leading-relaxed">
                        A dramatic transformation that highlights the natural beauty of the eyes while maintaining health and integrity. Meticulously applied to complement the client's unique facial structure.
                      </p>
                      <button 
                        onClick={() => {
                          setPage("booking");
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="minimal-btn shadow-lg hover:shadow-brand-gold/20 mx-auto lg:mx-0"
                      >
                        Get This Look
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Teaser */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-40 text-center py-40 border-t border-black/5"
        >
          <h2 className="text-4xl md:text-6xl font-light italic text-brand-charcoal/30 leading-snug mb-16">
            Witness the evolution <br />of excellence.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-10">
            <a 
              href="https://www.instagram.com/dng_beauty_/" 
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-btn flex items-center justify-center gap-4 py-6"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={16} /> Follow The Journey
            </a>
            <button 
              onClick={() => {
                setPage("booking");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="minimal-btn py-6 shadow-xl"
            >
              Book Your Session
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default Gallery;