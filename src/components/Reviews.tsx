/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

// Static data moved OUTSIDE the component. 
// This prevents JavaScript from rebuilding this array in memory every time the user scrolls.
const REVIEWS = [
  {
    name: "Sarah Jenkins",
    date: "2 weeks ago",
    text: "Gabby is an absolute perfectionist. My volume sets have never looked this fluffy, and the retention is insane. The studio is a complete sanctuary.",
    rating: 5
  },
  {
    name: "Chloë Du Plessis",
    date: "1 month ago",
    text: "I booked the Classic Set for my wedding and it was flawless. It felt so light and natural but gave my eyes the exact lift and elegance I wanted.",
    rating: 5
  },
  {
    name: "Amanda M.",
    date: "2 months ago",
    text: "The 2-Day Masterclass changed my entire technique. Gabby’s attention to isolation and styling is unmatched. Best investment for my own business.",
    rating: 5
  }
];

// GPU-accelerated animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Reviews = memo(function Reviews() {
  return (
    <section className="py-32 px-6 lg:px-20 bg-white relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            variants={fadeUp}
            className="mb-20 text-center"
            style={{ willChange: "opacity, transform" }}
        >
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-[1px] bg-brand-gold"></div>
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs drop-shadow-sm">
                    Client Experiences
                </span>
                <div className="w-8 h-[1px] bg-brand-gold"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-brand-charcoal mb-4">
                The Verdict.
            </h2>
            <p className="text-brand-charcoal/50 font-medium text-lg max-w-xl mx-auto">
                Don't just take our word for it. Here is what our beautiful clients have to say about the DnG experience.
            </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
                <motion.div 
                    key={review.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    variants={fadeUp}
                    // Staggering the animation so they cascade in beautifully
                    transition={{ delay: i * 0.15 }}
                    className="bg-brand-light p-10 border border-black/5 hover:border-brand-gold/30 transition-colors duration-500 flex flex-col justify-between"
                    // Forcing the browser to use the GPU for these specific cards
                    style={{ willChange: "opacity, transform" }}
                >
                    <div>
                        <div className="flex gap-1 mb-6">
                            {[...Array(review.rating)].map((_, index) => (
                                <Star key={index} size={14} className="text-brand-gold fill-brand-gold" />
                            ))}
                        </div>
                        <p className="text-brand-charcoal/80 font-medium leading-relaxed mb-8 text-sm md:text-base">
                            "{review.text}"
                        </p>
                    </div>
                    
                    <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                        <div>
                            <h5 className="font-black text-brand-charcoal tracking-tight">{review.name}</h5>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">Verified Client</span>
                        </div>
                        <span className="text-xs font-bold text-brand-charcoal/30">{review.date}</span>
                    </div>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
});

export default Reviews;