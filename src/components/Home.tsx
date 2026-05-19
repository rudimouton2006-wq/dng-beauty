/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

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

const SERVICES_PREVIEW = [
  { 
    title: "Classic Lashes", 
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
    desc: "Natural and simple"
  },
  { 
    title: "Volume Lashes", 
    img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=600",
    desc: "Full and dark"
  },
  { 
    title: "Brow Styling", 
    img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600",
    desc: "Shape and tint"
  }
];

const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1510017060271-45f217b0b414?auto=format&fit=crop&q=80&w=600"
];

const TESTIMONIALS = [
  {
    text: "Honestly the best! My lashes have never looked so good. They look so natural and I get so many compliments.",
    name: "Sarah Miller",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    text: "The studio is so clean and professional. I felt completely safe and relaxed during my set. Highly recommend DnG!",
    name: "Jessica Ross",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  },
  {
    text: "I'm so happy with my brows. The shape is exactly what I wanted and the tint lasted so long. I'm a client for life.",
    name: "Leanne King",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  },
  {
    text: "Precision is the right word. Every single lash is perfectly placed. I've never had a set last this long without gaps.",
    name: "Monique Du Preez",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
  }
];

// ----------------------------------------------------------------------
// MEMOIZED COMPONENT: Eliminates wasted render cycles
// ----------------------------------------------------------------------
const Home = memo(function Home({ setPage }: HomeProps) {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col md:flex-row items-stretch overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-12 md:px-20 py-20 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">
              Professional Lash & Brow Studio
            </span>
            <h1 className="text-6xl md:text-8xl leading-none mb-10 font-black">
              Beautiful <br /> Eyes.
            </h1>
            <p className="text-brand-charcoal/80 text-lg md:text-xl max-w-md mb-12 font-medium leading-relaxed">
              Based in Cape Town. We help you look and feel your best with expert lash extensions and brow styling.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setPage("booking")}
                className="minimal-btn"
                aria-label="Book An Appointment"
              >
                Book An Appointment
              </button>
              <button
                onClick={() => setPage("services")}
                className="secondary-btn"
                aria-label="See Our Prices"
              >
                See Our Prices
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="flex-1 relative overflow-hidden h-[40vh] md:h-full">
           <motion.img 
             initial={{ scale: 1.05 }}
             animate={{ scale: 1 }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
             src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200" 
             alt="Close up of beautiful lash extensions" 
             className="w-full h-full object-cover brightness-95"
             referrerPolicy="no-referrer"
             fetchPriority="high"
           />
        </div>
      </section>

      {/* Simple Value Proposition */}
      <section className="py-32 px-12 text-center bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold leading-tight text-brand-charcoal"
          >
            "We focus on every small detail to make sure you get a look that is perfect for you."
          </motion.h2>
          <div className="h-1 text-brand-gold w-20 mx-auto mt-12 bg-brand-gold rounded-full" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 luxury-container">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-20">
             <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeUp}
               className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 shadow-xl"
             >
                <img 
                  src="https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=800" 
                  alt="Professional beauty artist at work" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
             </motion.div>
             
             <div className="max-w-sm">
                <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-4 block">Safety First</span>
                <h2 className="text-4xl mb-6 font-bold">Safe for Your Eyes.</h2>
                <p className="text-brand-charcoal/60 font-medium leading-relaxed">
                  We use high-quality materials and clean tools for every client. Your eye health is our top priority.
                </p>
             </div>
          </div>

          <div className="space-y-20">
             <div className="max-w-sm">
                <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-4 block">Artistry</span>
                <h2 className="text-4xl mb-6 font-bold">Made for You.</h2>
                <p className="text-brand-charcoal/60 font-medium leading-relaxed">
                  Every person is different. We listen to what you want and create a look that matches your style.
                </p>
             </div>

             <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeUp}
               className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 shadow-xl"
             >
                <img 
                  src="https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=800" 
                  alt="A clean and professional beauty studio setup" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
             </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-40 bg-brand-charcoal text-white">
        <div className="luxury-container">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black mb-6">Our Services.</h2>
            <p className="text-white/80 text-lg">Choose from our popular beauty treatments.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES_PREVIEW.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="relative aspect-[4/5] cursor-pointer group rounded-xl overflow-hidden shadow-2xl"
                onClick={() => setPage("services")}
                role="button"
                tabIndex={0}
                aria-label={`View ${cat.title} services`}
              >
                 <img 
                   src={cat.img} 
                   alt={cat.title} 
                   className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700" 
                   loading="lazy"
                   decoding="async"
                   referrerPolicy="no-referrer" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                 <div className="absolute inset-x-8 bottom-8 text-white">
                    <h3 className="text-3xl font-bold mb-2">{cat.title}</h3>
                    <p className="text-white/80 font-medium uppercase text-xs tracking-widest">{cat.desc}</p>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Teaser */}
      <section className="py-40 luxury-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
           <div className="max-w-xl">
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-brand-gold mb-6 block">Curated Work</span>
              <h2 className="text-5xl font-bold leading-tight">Masterpieces in <br />Focus.</h2>
           </div>
           <button 
             onClick={() => setPage("gallery")}
             className="flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-bold text-brand-charcoal/60 hover:text-brand-gold transition-all"
             aria-label="View full gallery archive"
           >
             View Archive <ArrowRight size={14} />
           </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           {PORTFOLIO_IMAGES.map((url, i) => (
             <motion.div 
               key={i}
               whileHover={{ scale: 0.98 }}
               className="aspect-[1/1] overflow-hidden bg-gray-100 rounded-lg shadow-md"
             >
                <img 
                  src={url} 
                  alt={`Portfolio showcase piece ${i + 1}`} 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0 hover:scale-105" 
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer" 
                />
             </motion.div>
           ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 bg-gray-50 overflow-hidden">
        <div className="luxury-container">
          <div className="mb-24">
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Kind Words</span>
            <h2 className="text-5xl md:text-7xl font-black leading-tight">What Our <br /> Clients Say.</h2>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
            {TESTIMONIALS.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="min-w-[300px] md:min-w-[450px] bg-white p-12 rounded-3xl shadow-lg snap-center border border-black/5"
              >
                <p className="text-xl md:text-2xl font-black text-brand-charcoal mb-10 italic leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gold/20 shadow-inner">
                    <img 
                      src={t.img} 
                      alt={`Portrait of ${t.name}`} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-brand-charcoal">{t.name}</h4>
                    <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Verified Client</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-60 px-12 text-center bg-brand-cream/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3708_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-12 italic leading-tight">Artistry in <br />Every Sparkle.</h2>
          <button 
            onClick={() => setPage("booking")}
            className="minimal-btn mx-auto"
            aria-label="Start Your Journey"
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
});

export default Home;