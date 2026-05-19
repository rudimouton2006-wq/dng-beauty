/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// ----------------------------------------------------------------------
// STATIC HOISTING: Objects extracted to prevent memory reallocation
// ----------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const CATEGORY_IMAGES: Record<string, string> = {
  extensions: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200",
  brows: "https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=1200",
  training: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=1200",
};

const SERVICES_MENU: Record<string, Array<{ name: string; price: string; description: string; img: string }>> = {
  extensions: [
    { name: "Classics Full Set", price: "R350", description: "Natural, timeless elegance.", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=200" },
    { name: "Classics 2-3w Fill", price: "R250", description: "Regular maintenance set.", img: "https://images.unsplash.com/photo-1510017060271-45f217b0b414?auto=format&fit=crop&q=80&w=200" },
    { name: "Hybrids Full Set", price: "R400", description: "Artistic mix of classic and volume.", img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=200" },
    { name: "Volume Full Set", price: "R450", description: "Luxurious, fluffy fullness.", img: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=200" },
    { name: "Wispy Masterpiece", price: "R490", description: "Kim K inspired layered spikes.", img: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=200" },
  ],
  brows: [
    { name: "Brow Lamination", price: "R300", description: "Feathered, full look.", img: "https://images.unsplash.com/photo-1563172771-1ebe3f9e3466?auto=format&fit=crop&q=80&w=200" },
    { name: "Lash Lift & Tint", price: "R350", description: "Perfect upward curve.", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=200" },
    { name: "Precision Wax", price: "R100", description: "Expert brow mapping.", img: "https://images.unsplash.com/photo-1621333100653-5477dae7323b?auto=format&fit=crop&q=80&w=200" },
  ],
  training: [
    { name: "Beginner Masterclass", price: "POE", description: "Comprehensive lash education.", img: "https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=200" },
    { name: "Advanced Volume", price: "POE", description: "Advanced fan techniques.", img: "https://images.unsplash.com/photo-1583241475879-11c769f37c35?auto=format&fit=crop&q=80&w=200" },
  ]
};

// ----------------------------------------------------------------------
// MEMOIZED COMPONENT: Eliminates wasted render cycles
// ----------------------------------------------------------------------
const Services = memo(function Services() {
  const [activeTab, setActiveTab] = useState("extensions");

  return (
    <div className="pt-40 pb-32 min-h-screen bg-white">
      <div className="luxury-container">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-24"
        >
          <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Our Pricing</span>
          <h1 className="text-6xl md:text-8xl mb-8 font-black leading-none">Simple <br /> Prices.</h1>
          <p className="text-brand-charcoal/80 text-lg md:text-xl max-w-md font-medium leading-relaxed">
            Transparent pricing for all our beauty works. We use only the best materials for your eyes.
          </p>
        </motion.div>

        {/* Dynamic Navigation Tabs */}
        <div 
          className="flex gap-10 mb-20 border-b border-black/10 overflow-x-auto pb-6 scrollbar-hide"
          role="tablist"
          aria-label="Service Categories"
        >
          {Object.keys(SERVICES_MENU).map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeTab === cat}
              aria-controls={`${cat}-panel`}
              onClick={() => setActiveTab(cat)}
              className={`text-sm tracking-widest uppercase font-black transition-all whitespace-nowrap px-6 py-3 rounded-xl ${
                activeTab === cat ? "bg-brand-charcoal text-white shadow-lg" : "text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* State-Driven Hero Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[16/6] w-full mb-32 overflow-hidden bg-gray-100 rounded-2xl shadow-2xl relative"
          >
             <img 
               src={CATEGORY_IMAGES[activeTab]} 
               alt={`${activeTab} hero showcase`} 
               className="absolute inset-0 w-full h-full object-cover"
               loading="lazy"
               decoding="async"
               referrerPolicy="no-referrer"
             />
          </motion.div>
        </AnimatePresence>

        {/* Animated Menu Roster */}
        <div className="max-w-4xl" id={`${activeTab}-panel`} role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + "-list"}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 20 }}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
              }}
              className="space-y-8"
            >
               {SERVICES_MENU[activeTab].map((item, i) => (
                 <motion.div 
                    key={item.name} 
                    variants={fadeUp}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 pb-8 group"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm hidden sm:block bg-gray-100 relative">
                         <img 
                           src={item.img} 
                           alt={item.name} 
                           className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                           loading="lazy"
                           decoding="async"
                           referrerPolicy="no-referrer"
                         />
                      </div>
                      <div className="max-w-md">
                         <h3 className="text-3xl font-black mb-2 group-hover:text-brand-gold transition-colors">{item.name}</h3>
                         <p className="text-brand-charcoal/80 font-medium text-lg">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-brand-charcoal bg-gray-50 px-8 py-4 rounded-xl border border-black/5 shadow-sm group-hover:shadow-md group-hover:border-brand-gold/30 transition-all">
                       {item.price}
                    </div>
                 </motion.div>
               ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer CTA */}
        <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={fadeUp}
           className="mt-40 text-center py-32 bg-gray-50 rounded-3xl border border-black/5 shadow-inner"
        >
            <h2 className="text-4xl md:text-5xl font-black mb-12 text-brand-charcoal">Are you ready to book?</h2>
            <div className="flex justify-center gap-6">
               <button 
                 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                 className="minimal-btn shadow-xl hover:shadow-brand-gold/20"
                 aria-label="Scroll to top to book appointment"
               >
                 Book Appointment
               </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
});

export default Services;