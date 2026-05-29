/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";

// Animation variants separated to prevent recreation on each render
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Artist = memo(function Artist() {
  return (
    <section className="py-32 px-6 lg:px-20 bg-brand-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        
        {/* Left Side: Accelerated Image Rendering */}
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={fadeUp}
            className="w-full lg:w-1/2 relative"
            style={{ willChange: "opacity, transform" }}
        >
            {/* Soft background drop shadow */}
            <div className="absolute -inset-4 bg-brand-gold/10 blur-2xl rounded-full z-0" style={{ transform: "translateZ(0)" }}></div>
            
            <div className="aspect-[3/4] relative z-10 overflow-hidden shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" 
                    alt="Master Lash Artist"
                    // Crucial for performance: tells the browser to decode off the main thread
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-brand-gold/30 rounded-full z-0"></div>
        </motion.div>

        {/* Right Side: Typography */}
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            variants={fadeUp}
            className="w-full lg:w-1/2"
            style={{ willChange: "opacity, transform" }}
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[1px] bg-brand-gold"></div>
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs drop-shadow-sm">
                    The Artist
                </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-brand-charcoal mb-8 leading-[1.1]">
                Mastery in every <br/> single isolation.
            </h2>

            <div className="space-y-6 text-brand-charcoal/80 font-medium text-lg leading-relaxed">
                <p>
                    With over five years of dedicated experience in the art of lash extension, Gabby has cultivated a reputation for unparalleled precision and aesthetic intuition.
                </p>
                <p>
                    Every set is a bespoke creation. We don't believe in templates; we believe in mapping the natural architecture of your eye to create enhancements that are both safe and breathtakingly beautiful.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 pt-12 border-t border-black/5">
                <div>
                    <h4 className="text-3xl font-black text-brand-charcoal mb-2">5+</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Years Mastered</p>
                </div>
                <div>
                    <h4 className="text-3xl font-black text-brand-charcoal mb-2">3k+</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Sets Completed</p>
                </div>
            </div>
        </motion.div>

      </div>
    </section>
  );
});

export default Artist;