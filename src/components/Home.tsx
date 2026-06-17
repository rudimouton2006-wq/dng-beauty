/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight, GraduationCap } from "lucide-react";
import Artist from "./Artist";
import Reviews from "./Reviews";

interface HomeProps {
  setPage: (page: string) => void;
}

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
    price: "From R50", 
    desc: "Sculpted perfection.",
    img: "/images/brow-shape.jpg" 
  }
];

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
        HERO SECTION - HIGH-END EDITORIAL LAYOUT 
        Features a gradient fade on the image bottom, elegant serif typography, and a warm champagne glow.
      */}
      <section className="relative min-h-[100vh] flex items-center pt-20 lg:pt-0 overflow-hidden bg-[#FAF9F6]">
        
        {/* Luxury Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
            {/* Elegant Serif Watermark */}
            <h1 className="text-[12vw] font-serif tracking-widest text-gray-200/50 leading-none uppercase whitespace-nowrap absolute top-[40%] lg:top-[50%] -translate-y-1/2">
                Lash Architecture
            </h1>
            
            {/* Soft Champagne / Warm Blush Glow Accent */}
            <div className="absolute top-[50%] lg:top-[60%] right-[-10%] lg:right-[10%] w-[80vw] lg:w-[40vw] h-[80vw] lg:h-[40vw] bg-gradient-to-tr from-[#E8D8CE]/60 to-[#F2EBE5]/40 rounded-full blur-[120px] mix-blend-multiply opacity-80 -translate-y-1/2"></div>
        </div>

        {/* Foreground Typography & CTA */}
        <div className="relative z-20 w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-16 lg:py-0">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ willChange: "opacity, transform" }}>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-[#1A1A1A]"></div>
                <span className="text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-[10px]">
                    Lead Lash Tech: Gabrielle
                </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-light tracking-tighter text-[#1A1A1A] leading-[0.85] mb-8 uppercase relative z-30 drop-shadow-sm">
              DnG <br/> Beauty
            </h1>
            
            <p className="text-gray-500 text-lg max-w-md font-light leading-relaxed mb-12 tracking-wide relative z-30 bg-[#FAF9F6]/40 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-3 lg:p-0 rounded-sm">
              Luxury lash extensions perfectly tailored to the natural architecture of your eye shape.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 relative z-30">
              <button 
                onClick={() => setPage("booking")}
                className="px-10 py-4 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors duration-300 shadow-xl"
              >
                Start Consultation
              </button>
              <button 
                onClick={() => setPage("services")}
                className="px-10 py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] flex items-center gap-3 hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 bg-[#FAF9F6]/80 backdrop-blur-md"
              >
                View Menu <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* 
            Scaled-Up Transparent PNG Cutout with Feathered Gradient Fade 
            The maskImage CSS makes the bottom 15% of her image fade seamlessly into the background!
        */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 right-[-15%] lg:right-[2%] w-[130%] lg:w-[55%] h-[70%] lg:h-[95%] z-10 pointer-events-none flex justify-center items-end"
            style={{ 
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' 
            }}
        >
            <img 
                src="/images/gabby-cutout.png" 
                alt="Gabby - Lead Lash Tech"
                fetchPriority="high"
                loading="eager"
                className="w-full h-full object-contain object-bottom drop-shadow-2xl"
            />
        </motion.div>
      </section>

      {/* ESSENTIALS GRID */}
      <section className="py-32 px-6 lg:px-20 bg-white relative z-20 border-t border-gray-100">
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

      <Artist />
      <Reviews />

      {/* HIGHLY VISIBLE MASTERCLASS SECTION */}
      <section className="py-32 px-6 lg:px-20 bg-white border-t border-gray-100 relative z-20">
         <div className="max-w-7xl mx-auto">
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-[#FAF9F6] border border-gray-200 p-8 lg:p-16 rounded-sm flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
            >
                <div className="w-full lg:w-1/2">
                    <div className="flex items-center gap-3 mb-6">
                        <GraduationCap className="text-[#1A1A1A]" size={24} strokeWidth={1.5} />
                        <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block">
                            Gabrielle Lashes Academy
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-6 uppercase leading-[1.1]">
                        Master the Art. <br/> Build Your Empire.
                    </h2>
                    <p className="text-gray-500 font-light text-lg tracking-wide leading-relaxed mb-8">
                        Ready to launch your beauty business? Join our comprehensive 2-Day Lash Masterclass. Hands-on training, complete starter kits, and insider business strategies.
                    </p>
                    <button 
                        onClick={() => setPage("training")}
                        className="pb-1 border-b border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] hover:text-gray-400 hover:border-gray-400 transition-colors flex items-center gap-2"
                    >
                        View Full Curriculum <ArrowRight size={12} />
                    </button>
                </div>
                
                <div className="w-full lg:w-1/2 relative aspect-video lg:aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                    <img 
                        src="/images/hero-welcome.jpg" 
                        alt="Masterclass Training"
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                    />
                </div>
            </motion.div>
         </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-40 bg-[#1A1A1A] text-center px-4 relative overflow-hidden z-20">
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