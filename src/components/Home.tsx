/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Artist from "./components/Artist";
import Reviews from "./components/Reviews";

interface HomeProps {
  setPage: (page: string) => void;
}

// ----------------------------------------------------------------------
// STATIC HOISTING: Objects extracted to prevent memory reallocation
// ----------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const COLLECTIONS = [
  {
    title: "Classic Series",
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800",
    price: "From R350"
  },
  {
    title: "Volume Master",
    img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=800",
    price: "From R450"
  },
  {
    title: "Hybrid Mix",
    img: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=800",
    price: "From R400"
  },
  {
    title: "Brow Sculpt",
    img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=800",
    price: "From R200"
  }
];

// ----------------------------------------------------------------------
// MEMOIZED COMPONENT
// ----------------------------------------------------------------------
const Home = memo(function Home({ setPage }: HomeProps) {
  return (
    <main className="bg-brand-light min-h-screen">
      
      {/* HERO SECTION: The "Lash Queen" Vibe */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1600" 
              alt="High fashion lash portrait" 
              className="w-full h-full object-cover object-top brightness-[0.6] grayscale-[0.2]"
            />
            {/* Dark overlay to ensure text readability */}
            <div className="absolute inset-0 bg-brand-charcoal/40 mix-blend-multiply" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center mt-20">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="mb-8"
          >
             <span className="text-white/80 font-bold tracking-[0.3em] uppercase text-xs">
                Premium Studio Services
             </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter text-white leading-none mb-12"
          >
            LASH <br/> QUEEN
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <button 
              onClick={() => setPage("booking")}
              className="px-12 py-5 bg-brand-gold text-white font-black tracking-widest uppercase text-sm hover:bg-white hover:text-brand-charcoal transition-all duration-300 shadow-xl"
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* COLLECTIONS PREVIEW */}
      <section className="py-32 luxury-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-black/10 pb-8">
            <div>
                <h2 className="text-sm font-black tracking-[0.2em] uppercase text-brand-gold mb-2">Our Signature Styles</h2>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-brand-charcoal">The Collections.</h3>
            </div>
            <button 
                onClick={() => setPage("services")}
                className="flex items-center gap-3 text-xs font-black tracking-widest uppercase text-brand-charcoal/60 hover:text-brand-gold transition-colors"
            >
                View Full Menu <ArrowRight size={16} />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((item, i) => (
            <motion.div 
                key={i} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setPage("services")}
            >
                <div className="aspect-[3/4] mb-6 overflow-hidden bg-brand-charcoal/5 relative border border-black/5">
                    <img 
                        src={item.img} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/90 text-brand-charcoal px-6 py-2 text-xs font-black uppercase tracking-widest">Explore</span>
                    </div>
                </div>
                <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold tracking-wide text-brand-charcoal uppercase">{item.title}</h4>
                    <span className="text-sm font-black text-brand-gold">{item.price}</span>
                </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW COMPONENTS */}
      <Artist />
      <Reviews />

      {/* FINAL CTA */}
      <section className="py-40 bg-brand-charcoal text-center px-4 border-t-8 border-brand-gold">
        <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-8">Ready for flawless?</h2>
        <button 
            onClick={() => setPage("booking")}
            className="px-10 py-4 border border-white/20 text-white font-bold tracking-widest uppercase text-sm hover:bg-brand-gold hover:border-brand-gold transition-colors duration-300"
        >
            Secure Your Spot
        </button>
      </section>

    </main>
  );
});

export default Home;