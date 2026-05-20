/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import Artist from "./Artist";
import Reviews from "./Reviews";

interface HomeProps {
  setPage: (page: string) => void;
}

const COLLECTIONS = [
  { title: "Glamour", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" },
  { title: "Natural", img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=800" },
  { title: "Full Volume", img: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=800" },
  { title: "Cat Eye", img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=800" }
];

const Home = memo(function Home({ setPage }: HomeProps) {
  return (
    <main className="bg-brand-light min-h-screen font-sans text-brand-charcoal">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-charcoal">
        <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1615296016200-c486807f7b3e?auto=format&fit=crop&q=80&w=1600" 
              alt="Glowing skin macro beauty shot" 
              className="w-full h-full object-cover object-center opacity-70"
            />
            {/* Dirty brown gradient overlay for luxury warmth */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-gold/20 to-transparent mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-20">
            {/* Left side empty for image focus, or small text */}
            <div className="hidden md:block md:w-1/3">
                <p className="text-white/60 tracking-[0.4em] uppercase text-xs border-l border-brand-gold pl-4 py-2">
                    Only the most <br/> beautiful pieces.
                </p>
            </div>

            {/* Right side heavy typography */}
            <div className="w-full md:w-2/3 text-center md:text-right flex flex-col items-center md:items-end">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center md:items-end"
                >
                    {/* The elegant script/serif look */}
                    <span className="text-6xl md:text-8xl lg:text-[9rem] font-serif italic text-white/90 -mb-6 md:-mb-12 relative z-20 pr-4 md:pr-12">
                        Lash
                    </span>
                    {/* The bold block look */}
                    <span className="text-[5rem] md:text-[9rem] lg:text-[12rem] font-black tracking-tighter text-white leading-none">
                        QUEEN
                    </span>
                </motion.h1>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-8 md:mt-12 md:pr-4"
                >
                    <button 
                        onClick={() => setPage("booking")}
                        className="px-12 py-4 bg-brand-gold/90 backdrop-blur-sm text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-brand-charcoal transition-all duration-500 border border-brand-gold/50"
                    >
                        Shop Now
                    </button>
                </motion.div>
            </div>
        </div>
      </section>

      {/* 2. THE COLLECTIONS GRID (Matches the moodboard) */}
      <section className="py-24 md:py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center md:text-left mb-16 border-b border-brand-charcoal/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <h2 className="text-3xl md:text-4xl font-serif tracking-[0.2em] uppercase text-brand-charcoal">
                Our Collections
            </h2>
            <p className="text-brand-gold font-bold tracking-widest uppercase text-xs">
                Premium Lashes Only
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {COLLECTIONS.map((item, i) => (
            <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group cursor-pointer flex flex-col"
                onClick={() => setPage("services")}
            >
                {/* Thin border around image to match moodboard */}
                <div className="aspect-[3/4] mb-4 overflow-hidden border border-brand-gold/30 bg-brand-light relative p-1">
                    <img 
                        src={item.img} 
                        alt={item.title}
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute top-3 left-3 w-4 h-4 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-brand-charcoal/60 uppercase">{`0${i + 1}`}</span>
                    <h4 className="text-xs md:text-sm font-black tracking-widest text-brand-charcoal uppercase">{item.title}</h4>
                </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. MACRO PHOTOGRAPHY BANNER */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=1600" 
            alt="Macro eye shot" 
            className="absolute inset-0 w-full h-full object-cover object-center"
         />
         <div className="absolute inset-0 bg-brand-charcoal/40 mix-blend-multiply"></div>
         <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay"></div>
         
         <div className="relative z-10 text-center px-4 bg-brand-charcoal/20 backdrop-blur-sm py-12 w-full border-y border-white/10">
            <p className="text-white/80 tracking-[0.4em] uppercase text-xs mb-6 font-bold">We Only Have</p>
            <h2 className="text-4xl md:text-7xl font-serif italic text-white shadow-sm">Luxury Lashes</h2>
            <button 
                onClick={() => setPage("booking")}
                className="mt-8 px-8 py-3 bg-white text-brand-charcoal font-bold tracking-widest uppercase text-[10px] hover:bg-brand-gold hover:text-white transition-colors duration-300"
            >
                Shop Now
            </button>
         </div>
      </section>

      {/* 4. COMPONENT INTEGRATION */}
      {/* (Artist profile flows perfectly here) */}
      <Artist />

      {/* 5. STYLED REVIEWS WRAPPER (To match moodboard "What are clients saying?") */}
      <div className="bg-brand-light border-t border-brand-charcoal/10 relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-gold/5" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-8 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
             <h2 className="text-2xl md:text-4xl font-black tracking-widest uppercase text-brand-charcoal">What our Clients</h2>
             <span className="text-4xl md:text-6xl font-serif italic text-brand-gold">are saying?</span>
          </div>
          <Reviews />
      </div>

      {/* 6. EDITORIAL FOOTER VIBE */}
      <section className="py-32 px-4 text-center bg-white flex flex-col items-center justify-center border-t border-black/5">
        <h2 className="text-4xl md:text-6xl font-serif italic text-brand-charcoal max-w-2xl leading-relaxed mb-6">
            "Thank you for checking out our website."
        </h2>
        <p className="text-brand-charcoal/50 font-serif italic text-2xl md:text-3xl">
            Follow us @DnGBeauty
        </p>
      </section>

    </main>
  );
});

export default Home;