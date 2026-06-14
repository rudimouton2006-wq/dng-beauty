/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";

interface GalleryProps {
  setPage: (page: string) => void;
}

// Stored in memory once to prevent layout thrashing
const GALLERY_IMAGES = [
  { id: 1, category: "Classic", img: "/images/classic-extensions.jpg" },
  { id: 2, category: "Volume", img: "/images/volume-extensions.jpg" },
  { id: 3, category: "Hybrid", img: "/images/hybrid-extensions.jpg" },
  { id: 4, category: "Hybrid", img: "/images/hybrid-extensions-alt.jpg" },
  { id: 5, category: "Hybrid", img: "/images/hybrid-cat-eye-1.jpg" },
  { id: 6, category: "Hybrid", img: "/images/hybrid-cat-eye-2.jpg" },
  { id: 7, category: "Brows", img: "/images/brow-lamination.jpg" },
  { id: 8, category: "Brows", img: "/images/brow-shape-tint.jpg" },
  { id: 9, category: "Lifts", img: "/images/lash-lift.jpg" },
];

const CATEGORIES = ["All", "Classic", "Volume", "Hybrid", "Brows", "Lifts"];

// Highly optimized variants
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

const Gallery = memo(function Gallery({ setPage }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = activeCategory === "All" 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  return (
    <main className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] pt-32 pb-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
            style={{ willChange: "opacity, transform" }}
        >
            <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-6 block">Our Portfolio</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 uppercase">The Gallery.</h1>
            <p className="text-gray-500 text-lg font-light max-w-xl mx-auto tracking-wide leading-relaxed">
                A curated collection of our signature enhancements and artistry.
            </p>
        </motion.div>

        {/* Minimalist Category Filter (Matching Services UI) */}
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
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
                            layoutId="activeGalleryTab" 
                            className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#1A1A1A]" 
                        />
                    )}
                </button>
            ))}
        </motion.div>

        {/* High-Performance Animated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
                {filteredImages.map((item) => (
                    <motion.div 
                        key={item.id}
                        layout 
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeUp}
                        className="group relative aspect-square overflow-hidden bg-gray-100 cursor-pointer rounded-sm"
                        style={{ willChange: "opacity, transform" }}
                        onClick={() => setSelectedImage(item.img)}
                    >
                        <img 
                            src={item.img} 
                            alt={`DnG Beauty ${item.category} Work`}
                            decoding="async"
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        
                        {/* Ultra-minimal hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                            <div className="flex items-center justify-between w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-[10px] tracking-widest uppercase font-bold text-white">
                                    {item.category}
                                </span>
                                <Plus size={16} className="text-white opacity-70" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

      </div>

      {/* GPU-Accelerated Minimalist Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF9F6]/95 backdrop-blur-md p-4 md:p-12"
                onClick={() => setSelectedImage(null)}
            >
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-8 right-8 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                >
                    <X size={32} strokeWidth={1} />
                </button>
                <motion.img 
                    initial={{ scale: 0.95, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 10 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    src={selectedImage} 
                    alt="Expanded View"
                    className="max-w-full max-h-full object-contain shadow-2xl"
                    style={{ willChange: "transform" }}
                    onClick={(e) => e.stopPropagation()}
                />
            </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
});

export default Gallery;