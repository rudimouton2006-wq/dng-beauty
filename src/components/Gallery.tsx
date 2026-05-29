/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Maximize2 } from "lucide-react";

interface GalleryProps {
  setPage: (page: string) => void;
}

// Static Data extracted to prevent memory reallocation on every render
const GALLERY_IMAGES = [
  { id: 1, category: "Volume", img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=800" },
  { id: 2, category: "Classic", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" },
  { id: 3, category: "Brows", img: "https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=800" },
  { id: 4, category: "Volume", img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=800" },
  { id: 5, category: "Lifts", img: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=800" },
  { id: 6, category: "Classic", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800" },
  { id: 7, category: "Volume", img: "https://images.unsplash.com/photo-1516975080661-46bfa20224b1?auto=format&fit=crop&q=80&w=800" },
  { id: 8, category: "Brows", img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800" },
  { id: 9, category: "Lifts", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800" },
];

const CATEGORIES = ["All", "Volume", "Classic", "Brows", "Lifts"];

// GPU-accelerated variants
const fadeUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const Gallery = memo(function Gallery({ setPage }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = activeCategory === "All" 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  return (
    <main className="bg-brand-light min-h-screen font-sans text-brand-charcoal pt-32 pb-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
            style={{ willChange: "opacity, transform" }}
        >
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Our Portfolio</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">The Gallery.</h1>
            <p className="text-brand-charcoal/60 text-lg font-medium max-w-xl mx-auto">
                A curated collection of our signature enhancements and artistry.
            </p>
        </motion.div>

        {/* High-Performance Category Filter */}
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
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

        {/* Animated Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {filteredImages.map((item) => (
                    <motion.div 
                        key={item.id}
                        layout // Enables smooth position swapping when filtering
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeUp}
                        className="group relative aspect-square overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-500 rounded-2xl"
                        style={{ willChange: "opacity, transform" }}
                        onClick={() => setSelectedImage(item.img)}
                    >
                        <img 
                            src={item.img} 
                            alt={`DnG Beauty ${item.category} Work`}
                            // Critical performance attributes
                            decoding="async"
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/30">
                                <Maximize2 size={20} />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <span className="text-[10px] tracking-widest uppercase font-black text-white bg-brand-charcoal/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                                {item.category}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

      </div>

      {/* GPU-Accelerated Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/95 backdrop-blur-xl p-4 md:p-12"
                onClick={() => setSelectedImage(null)}
            >
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                    <X size={32} />
                </button>
                <motion.img 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    src={selectedImage} 
                    alt="Expanded View"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    style={{ willChange: "transform" }}
                    // Stop click event from bubbling up and instantly closing the modal
                    onClick={(e) => e.stopPropagation()}
                />
            </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
});

export default Gallery;