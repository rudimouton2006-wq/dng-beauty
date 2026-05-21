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
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    title: "Volume Lashes", 
    price: "From R450", 
    desc: "Full, fluffy, and dramatic.",
    img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=800" 
  },
  { 
    title: "Brow Styling", 
    price: "From R200", 
    desc: "Sculpted perfection.",
    img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=800" 
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const Home = memo(function Home({ setPage }: HomeProps) {
  return (
    /* We keep the 'bg-brand-light' on the main tag as the fallback, 
       but the Hero section will now be transparent. */
    <main className="bg-brand-light/95 min-h-screen font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white relative">
      
      {/* 1. ULTRA-CLEAN HERO SECTION */}
      {/* We add 'backdrop-blur-sm' here to enhance the effect from the index.css */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch pt-20 lg:pt-0 backdrop-blur-sm">
        
        {/* Left Side: Typography */}
        {/* THE FIX: We removed 'bg-white' and made this container transparent to show the universal background image */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-20 py-16 lg:py-0 z-10 bg-transparent">
          <motion.div
             initial="hidden"
             animate="visible"
             variants={fadeUp}
          >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-brand-gold"></div>
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs">
                    Cape Town's Premier Studio
                </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-black tracking-tighter text-brand-charcoal leading-[0.9] mb-8">
              Beautiful <br/> Eyes.
            </h1>
            
            <p className="text-brand-charcoal/60 text-lg md:text-xl max-w-md font-medium leading-relaxed mb-12">
              Expertistry and precision. We create flawless, natural enhancements tailored to your unique facial architecture.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <button 
                onClick={() => setPage("booking")}
                className="px-10 py-4 bg-brand-charcoal text-white font-bold tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors duration-300 shadow-xl"
              >
                Book Appointment
              </button>
              <button 
                onClick={() => setPage("services")}
                className="px-10 py-4 bg-transparent text-brand-charcoal font-bold tracking-widest uppercase text-xs flex items-center gap-3 hover:opacity-60 transition-opacity duration-300"
              >
                View Menu <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: We keep this side image for a layered effect, which adds amazing depth */}
        <div className="flex-1 relative min-h-[50vh] lg:min-h-screen">
            <motion.img 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              src="https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=1200" 
              alt="Flawless lash extensions" 
              className="absolute inset-0 w-full h-full object-cover object-center grayscale-[0.2]"
            />
            {/* Subtly darkened overlay on this side image to match the luxury mood */}
            <div className="absolute inset-0 bg-brand-charcoal/10" />
        </div>
      </section>

      {/* 2. THE ESSENTIALS (CLEAN GRID) */}
      {/* We keep this section 'bg-white' so it provides a solid contrast block, 
         making the site feel dynamic and professional. */}
      <section className="py-32 px-6 lg:px-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-brand-charcoal mb-4">
                        The Essentials.
                    </h2>
                    <p className="text-brand-charcoal/50 font-medium text-lg">
                        Our most requested signature services.
                    </p>
                </div>
                <button 
                    onClick={() => setPage("services")}
                    className="pb-1 border-b border-brand-gold text-brand-charcoal font-bold tracking-widest uppercase text-xs hover:text-brand-gold transition-colors"
                >
                    View All Services
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {SERVICES.map((item, i) => (
                <motion.div 
                    key={i} 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeUp}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer flex flex-col"
                    onClick={() => setPage("services")}
                >
                    <div className="aspect-[4/5] mb-6 overflow-hidden bg-brand-light relative">
                        <img 
                            src={item.img} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xl font-bold tracking-tight text-brand-charcoal">{item.title}</h4>
                            <span className="text-sm font-black text-brand-gold">{item.price}</span>
                        </div>
                        <p className="text-brand-charcoal/60 font-medium">{item.desc}</p>
                    </div>
                </motion.div>
              ))}
            </div>

        </div>
      </section>

      {/* 3. SEAMLESS COMPONENT INTEGRATION */}
      {/* These will still have their white/structured backgrounds as built, which provides clean contrast blocks against the universal background. */}
      <Artist />
      <Reviews />

      {/* 4. MINIMALIST FOOTER CTA */}
      <section className="py-40 bg-brand-charcoal text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-brand-gold/5 blur-3xl rounded-full"></div>
        <div className="relative z-10">
            <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-10">
                Ready for your <br/> transformation?
            </h2>
            <button 
                onClick={() => setPage("booking")}
                className="px-12 py-5 bg-white text-brand-charcoal font-black tracking-widest uppercase text-xs hover:bg-brand-gold hover:text-white transition-all duration-300"
            >
                Secure Your Spot
            </button>
        </div>
      </section>

    </main>
  );
});

export default Home;