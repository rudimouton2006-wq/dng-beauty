/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Check, ArrowRight, MessageSquare } from "lucide-react";

export default function Training() {
  const syllabus = [
    "Biological Lash Health & Safety",
    "Ergonomic Isolation techniques",
    "Face Mapping & Eye-Shape Theory",
    "Adhesive Science & Placement",
    "Brand Building & Growth Strategy",
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="luxury-container">
        
        {/* Header Section */}
        <motion.div
           initial="hidden"
           animate="visible"
           variants={fadeUp}
           className="mb-24"
        >
          <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Our Training</span>
          <h1 className="text-6xl md:text-8xl mb-10 leading-none font-black">Learn To <br /> Lash.</h1>
          <p className="text-brand-charcoal/80 text-xl font-medium leading-relaxed max-w-xl">
             We teach you everything you need to know to start your own beauty business. Master the art of application with our comprehensive, hands-on curriculum.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-start mb-40">
           
           {/* Dual-Image Visual Composition */}
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeUp}
             className="relative"
           >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl relative z-10 w-11/12">
                 <img 
                   src="https://images.unsplash.com/photo-1541533260371-b8fabc4b0652?auto=format&fit=crop&q=80&w=1200" 
                   alt="Professional lash training session" 
                   className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                   loading="lazy"
                   decoding="async"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
              </div>
              <div className="absolute -bottom-12 -right-4 aspect-square w-2/3 overflow-hidden rounded-2xl shadow-xl border-4 border-white z-20 hidden md:block">
                 <img 
                   src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" 
                   alt="Close up detail of perfect lash placement" 
                   className="w-full h-full object-cover"
                   loading="lazy"
                   decoding="async"
                   referrerPolicy="no-referrer"
                 />
              </div>
           </motion.div>
           
           {/* Content & Syllabus */}
           <div className="space-y-16 lg:pl-10 lg:pt-10">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
              >
                 <h2 className="text-4xl font-black mb-10 text-brand-charcoal">What You Learn.</h2>
                 <div className="space-y-6">
                    {syllabus.map((item, i) => (
                      <motion.div 
                        key={i} 
                        variants={fadeUp}
                        className="flex items-center gap-6 border-b border-black/5 pb-6 group"
                      >
                         <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold transition-colors duration-300">
                           <Check size={16} className="text-brand-gold group-hover:text-white transition-colors duration-300" strokeWidth={3} />
                         </div>
                         <span className="text-xl font-bold text-brand-charcoal group-hover:text-brand-gold transition-colors">{item}</span>
                      </motion.div>
                    ))}
                 </div>
              </motion.div>

              {/* Investment Block */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-brand-charcoal text-white p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                 <h2 className="text-3xl font-black mb-8 relative z-10">Investment.</h2>
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-white/10 pb-8 gap-4 relative z-10">
                    <span className="text-xs font-black uppercase tracking-widest text-white/50">Full Masterclass</span>
                    <span className="text-6xl font-black text-brand-gold">R3,500</span>
                 </div>
                 <p className="mt-8 text-white/80 font-medium leading-relaxed relative z-10">
                   Includes your complete professional starter kit, comprehensive manual, and ongoing mentorship to ensure your success in the industry.
                 </p>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col gap-6 pt-4"
              >
                 <button 
                   onClick={() => window.open("https://wa.me/27787030732?text=Hi!%20I%20would%20like%20to%20inquire%20about%20the%20Beginner%20Lash%20Masterclass.", "_blank")} 
                   className="minimal-btn shadow-xl flex items-center justify-center gap-4 py-6"
                   aria-label="Inquire about training via WhatsApp"
                 >
                   <MessageSquare size={18} /> Inquire Now
                 </button>
              </motion.div>
           </div>
        </div>

        {/* Footer Teaser */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center py-40 border-t border-black/5"
        >
           <h2 className="text-4xl md:text-5xl font-black text-brand-charcoal/20 leading-tight">
             Inspiring the next generation <br />of lash artists.
           </h2>
        </motion.div>
      </div>
    </div>
  );
}