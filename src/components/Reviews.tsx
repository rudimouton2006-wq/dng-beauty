/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

// Static data moved OUTSIDE the component. 
// Features the exact 6 real reviews from Gabby's Instagram DMs.
const REVIEWS = [
  {
    id: 1,
    text: "Thank u so much for my lashes 🥰 love it",
    rating: 5
  },
  {
    id: 2,
    text: "lashes looks absolutely gorgeous and everyone loves it too ❤️ thank you so much",
    rating: 5
  },
  {
    id: 3,
    text: "Thank you very much 🫶 she's loving her lashes 😍",
    rating: 5
  },
  {
    id: 4,
    text: "Hey Gabs, just want to say thank you again for my lashes and brows girl, I really appreciate it 🤗 my lashes is still lashing and its clusters mind you 💃💃",
    rating: 5
  },
  {
    id: 5,
    text: "Hey bbe, I just wanted to say thank u sm, firstly for the lashes and brows I absolutely love them!!!!! And secondly for the yapping, the venting and everything else that came with it, you wouldn't understand how much I needed to get those things off my chest you're such an open book and the way u spoke about god brought me sm peace... I LOVE UUUUUU",
    rating: 5
  },
  {
    id: 6,
    text: "Hey babes I'm safe. Thank you so much. I appreciate it. May God continue to bless you and your business. I always feel good when I come from an appointment with you. Take care my friend ❤️",
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
    <section className="py-32 px-6 lg:px-20 bg-[#FAF9F6] relative z-10">
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
                <div className="w-8 h-[1px] bg-[#1A1A1A]"></div>
                <span className="text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-xs drop-shadow-sm">
                    Client Experiences
                </span>
                <div className="w-8 h-[1px] bg-[#1A1A1A]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4 uppercase">
                Client Love.
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto tracking-wide">
                Real experiences and testimonials from our beautiful clients.
            </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
                <motion.div 
                    key={review.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                    variants={fadeUp}
                    // Staggering the animation so they cascade in beautifully
                    transition={{ delay: i * 0.15 }}
                    className="bg-white p-10 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col justify-between rounded-sm"
                    // Forcing the browser to use the GPU for these specific cards
                    style={{ willChange: "opacity, transform" }}
                >
                    <div>
                        <div className="flex gap-1 mb-6">
                            {[...Array(review.rating)].map((_, index) => (
                                <Star key={index} size={14} className="text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <p className="text-gray-700 italic leading-relaxed mb-8 text-sm md:text-base">
                            "{review.text}"
                        </p>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                        <div>
                            <h5 className="font-bold text-[#1A1A1A] tracking-tight uppercase text-sm">Verified Client</h5>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Instagram DM</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
});

export default Reviews;