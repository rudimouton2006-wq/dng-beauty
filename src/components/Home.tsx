/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Artist from "./Artist";
import Reviews from "./Reviews";
// Ensure this path matches your actual image location
import bgImage from "../assets/HomePageBackground.jpg"; 

interface HomeProps {
  setPage: (page: string) => void;
}

// Moved static data OUTSIDE the component to prevent memory reallocation on every render
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

// GPU-accelerated animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

// React.memo prevents the Home component from re-rendering unless setPage changes
const Home = memo(function Home({ setPage }: HomeProps) {
  return (
    <main className="bg-brand-light min-h-screen font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white relative overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section 
        className="relative min-h-screen flex items-center pt-20 lg:pt-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Transparent gradient overlay for readability without blocking the image */}
        <div className="absolute inset-0 bg-brand-light/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-brand-light/95 lg:via-brand-light/70 lg:to-transparent z-0"></div>
        
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-16 lg:py-0">
          <motion.div
             initial="hidden"
             animate="visible"
             variants={fadeUp}
             // Forcing hardware acceleration for the hero text
             style={{ willChange: "opacity, transform" }}
          >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[1px] bg-brand-gold"></div>
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs drop-shadow-sm">
                    Cape Town's Premier Studio
                </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-black tracking-tighter text-brand-charcoal leading-[0.9] mb-8 drop-shadow-lg">
              Beautiful <br/> Eyes.
            </h1>
            
            <p className="text-brand-charcoal/90 text-lg md:text-xl max-w-md font-medium leading-relaxed mb-12 drop-shadow-md">
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
                className="px-10 py-4 bg-white/50 backdrop-blur-sm text-brand-charcoal font-bold tracking-widest uppercase text-xs flex items-center gap-3 hover:bg-white transition-colors duration-300 shadow-sm"
              >
                View Menu <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ESSENTIALS GRID */}
      <section className="py-32 px-6 lg:px-20 bg-white relative z-10 shadow-2xl">
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
                    <div className="aspect-[4/5] mb-6 overflow-hidden bg-brand-light relative">
                        <img 
                            src={item.img} 
                            alt={item.title}
                            // Crucial for performance: tells the browser to decode the image off the main thread
                            decoding="async"
                            loading="lazy"
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

      {/* COMPONENT INTEGRATION */}
      <Artist />
      <Reviews />

      {/* FOOTER CTA */}
      <section className="py-40 bg-brand-charcoal text-center px-4 relative overflow-hidden">
        {/* Hardware accelerated blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-brand-gold/5 blur-3xl rounded-full" style={{ transform: "translateZ(0)" }}></div>
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