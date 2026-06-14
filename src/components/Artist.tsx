/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";

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
    <section className="py-32 px-6 lg:px-20 bg-[#FAF9F6] relative overflow-hidden">
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
            <div className="absolute -inset-4 bg-gray-200 blur-2xl rounded-full z-0" style={{ transform: "translateZ(0)" }}></div>
            
            <div className="aspect-[3/4] relative z-10 overflow-hidden shadow-sm rounded-sm">
                {/* Now mapped directly to your local artist-gabby.jpg file */}
                <img 
                    src="/images/artist-gabby.jpg" 
                    alt="Master Lash Artist Gabrielle"
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-gray-200 rounded-full z-0"></div>
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
                <div className="w-8 h-[1px] bg-[#1A1A1A]"></div>
                <span className="text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-xs drop-shadow-sm">
                    The Artist
                </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-[#1A1A1A] mb-8 leading-[1.1] uppercase">
                Mastery in every <br/> single isolation.
            </h2>

            <div className="space-y-6 text-gray-700 font-medium text-lg leading-relaxed tracking-wide">
                <p>
                    With over five years of dedicated experience in the art of lash extension, Gabby has cultivated a reputation for unparalleled precision and aesthetic intuition.
                </p>
                <p>
                    Every set is a bespoke creation. We don't believe in templates; we believe in mapping the natural architecture of your eye to create enhancements that are both safe and breathtakingly beautiful.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 pt-12 border-t border-gray-200">
                <div>
                    <h4 className="text-3xl font-bold text-[#1A1A1A] mb-2">5+</h4>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Years Mastered</p>
                </div>
                <div>
                    <h4 className="text-3xl font-bold text-[#1A1A1A] mb-2">3k+</h4>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Sets Completed</p>
                </div>
            </div>
        </motion.div>

      </div>
    </section>
  );
});

export default Artist;