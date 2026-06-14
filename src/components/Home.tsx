/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Artist from "./Artist";
import Reviews from "./Reviews";

interface HomeProps {
  setPage: (page: string) => void;
}

// Static data kept completely outside the component to prevent memory reallocation on re-renders
const SERVICES = [
  { 
    title: "Classic Lashes", 
    price: "From R350", 
    desc: "A natural, mascara-like finish.",
    img: "/images/classic-extensions.jpg" 
  },
  { 
    title: "Volume Lashes", 
    price: "From R450", 
    desc: "Full, fluffy, and dramatic.",
    img: "/images/volume-extensions.jpg" 
  },
  { 
    title: "Brow Styling", 
    price: "From R200", 
    desc: "Sculpted perfection.",
    img: "/images/brow-shape-tint.jpg" 
  }
];

// GPU-accelerated variants for buttery-smooth DOM painting
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Home = memo(function Home({ setPage }: HomeProps) {
  return (
    <main className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#FAF9F6] relative overflow-x-hidden">
      
      {/* 
        HERO SECTION 
        Optimized for LCP (Largest Contentful Paint). 
        Using an absolute img tag with fetchPriority ensures zero-lag loading above the fold.
      */}
      <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
        <img 
            src="/images/home-bg.jpg" 
            alt="DnG Beauty Luxury Lashes"
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover z-0 scale-105"
        />
        
        {/* Minimalist Gradient Overlay */}
        <div className="absolute inset-0 bg-[#FAF9F6]/90 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#FAF9F6] lg:via-[#FAF9F6]/80 lg:to-transparent z-0"></div>
        
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-16 lg:py-0">
          <motion.div
             initial="hidden"
             animate="visible"
             variants={fadeUp}
             style={{ willChange: "opacity, transform" }}
          >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-[#1A1A1A]"></div>
                <span className="text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-[10px]">
                    Lead Lash Tech: Gabrielle
                </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[8rem] font-light tracking-tighter text-[#1A1A1A] leading-[0.85] mb-8 uppercase">
              DnG <br/> Beauty
            </h1>
            
            <p className="text-gray-500 text-lg max-w-md font-light leading-relaxed mb-12 tracking-wide">
              Luxury lash extensions perfectly tailored to the natural architecture of your eye shape.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button 
                onClick={() => setPage("booking")}
                className="px-10 py-4 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors duration-300"
              >
                Start Consultation
              </button>
              <button 
                onClick={() => setPage("services")}
                className="px-10 py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] flex items-center gap-3 hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300"
              >
                View Menu <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ESSENTIALS GRID */}
      <section className="py-32 px-6 lg:px-20 bg-white relative z-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4 uppercase">
                        The Essentials.
                    </h2>
                    <p className="text-gray-400 font-light text-lg tracking-wide">
                        Our most requested signature services.
                    </p>
                </div>
                <button 
                    onClick={() => setPage("services")}
                    className="pb-1 border-b border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] hover:text-gray-400 hover:border-gray-400 transition-colors"
                >
                    View All Services
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SERVICES.map((item, i) => (
                <motion.div 
                    key={item.title} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    variants={fadeUp}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer flex flex-col"
                    onClick={() => setPage("services")}
                    style={{ willChange: "opacity, transform" }}
                >
                    <div className="aspect-[4/5] mb-6 overflow-hidden bg-[#FAF9F6] relative rounded-sm">
                        <img 
                            src={item.img} 
                            alt={item.title}
                            decoding="async"
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    </div>
                    <div className="px-2">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-medium tracking-wide text-[#1A1A1A]">{item.title}</h4>
                            <span className="text-xs font-bold text-gray-400">{item.price}</span>
                        </div>
                        <p className="text-gray-400 font-light text-sm">{item.desc}</p>
                    </div>
                </motion.div>
              ))}
            </div>

        </div>
      </section>

      {/* COMPONENT INTEGRATION */}
      <Artist />
      <Reviews />

      {/* FOOTER CTA */}
      <section className="py-40 bg-[#1A1A1A] text-center px-4 relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-white text-4xl md:text-6xl font-light tracking-tighter mb-12 uppercase">
                Ready for your <br/> transformation?
            </h2>
            <button 
                onClick={() => setPage("booking")}
                className="px-12 py-5 bg-[#FAF9F6] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] hover:bg-white transition-colors duration-300 rounded-sm"
            >
                Secure Your Spot
            </button>
        </div>
      </section>

    </main>
  );
});

export default Home;