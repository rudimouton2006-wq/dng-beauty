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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Home = memo(function Home({ setPage }: HomeProps) {
  return (
    <main className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] selection:bg-black selection:text-white relative overflow-x-hidden">
      
      {/* HERO SECTION - Now mapped to your local home-bg.jpg */}
      <section 
        className="relative min-h-screen flex items-center pt-20 lg:pt-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url('/images/home-bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-[#FAF9F6]/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#FAF9F6]/95 lg:via-[#FAF9F6]/70 lg:to-transparent z-0"></div>
        
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-16 lg:py-0">
          <motion.div
             initial="hidden"
             animate="visible"
             variants={fadeUp}
             style={{ willChange: "opacity, transform" }}
          >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-[#1A1A1A]"></div>
                <span className="text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-xs drop-shadow-sm">
                    Lead Lash Tech: Gabrielle
                </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[7.5rem] font-light tracking-tighter text-[#1A1A1A] leading-[0.9] mb-8 drop-shadow-lg uppercase">
              DnG <br/> Beauty
            </h1>
            
            <p className="text-gray-700 text-lg md:text-xl max-w-md font-medium leading-relaxed mb-12 drop-shadow-md tracking-wide">
              Luxury Lash Extensions Tailored To Your Eye Shape.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <button 
                onClick={() => setPage("booking")}
                className="px-10 py-4 bg-black text-white font-bold tracking-widest uppercase text-xs hover:bg-gray-800 transition-colors duration-300 shadow-xl"
              >
                Start Consultation
              </button>
              <button 
                onClick={() => setPage("services")}
                className="px-10 py-4 bg-white/50 backdrop-blur-sm text-black font-bold tracking-widest uppercase text-xs flex items-center gap-3 hover:bg-white transition-colors duration-300 shadow-sm"
              >
                View Menu <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ESSENTIALS GRID */}
      <section className="py-32 px-6 lg:px-20 bg-white relative z-10 shadow-2xl border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4 uppercase">
                        The Essentials.
                    </h2>
                    <p className="text-gray-500 font-medium text-lg tracking-wide">
                        Our most requested signature services.
                    </p>
                </div>
                <button 
                    onClick={() => setPage("services")}
                    className="pb-1 border-b border-black text-[#1A1A1A] font-bold tracking-widest uppercase text-xs hover:text-gray-500 transition-colors"
                >
                    View All Services
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
                    <div className="aspect-[4/5] mb-6 overflow-hidden bg-[#FAF9F6] relative">
                        <img 
                            src={item.img} 
                            alt={item.title}
                            decoding="async"
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xl font-light tracking-wide text-[#1A1A1A]">{item.title}</h4>
                            <span className="text-sm font-medium text-gray-700">{item.price}</span>
                        </div>
                        <p className="text-gray-500 font-medium">{item.desc}</p>
                    </div>
                </motion.div>
              ))}
            </div>

        </div>
      </section>

      <Artist />
      <Reviews />

      {/* FOOTER CTA */}
      <section className="py-40 bg-[#1A1A1A] text-center px-4 relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-white text-4xl md:text-6xl font-light tracking-tighter mb-10">
                Ready for your <br/> transformation?
            </h2>
            <button 
                onClick={() => setPage("booking")}
                className="px-12 py-5 bg-white text-[#1A1A1A] font-black tracking-widest uppercase text-xs hover:bg-gray-200 transition-all duration-300"
            >
                Secure Your Spot
            </button>
        </div>
      </section>

    </main>
  );
});

export default Home;