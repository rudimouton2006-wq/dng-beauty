/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    text: "Absolutely incredible work. My lashes have never looked this natural and lasted this long. She is a true perfectionist!",
    service: "Volume Full Set"
  },
  {
    name: "Michelle T.",
    text: "The studio is gorgeous and her attention to detail is unmatched. I won't trust anyone else with my brows.",
    service: "Brow Lamination & Tint"
  },
  {
    name: "Amanda Le Roux",
    text: "So professional and gentle! I actually fell asleep during my appointment. The results were flawless.",
    service: "Classics Full Set"
  }
];

export default function Reviews() {
  return (
    <section className="py-32 bg-brand-light relative" aria-label="Client Reviews">
      <div className="luxury-container">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-sm font-black tracking-widest uppercase text-brand-gold mb-4">Client Testimonials</h2>
          <h3 className="text-4xl font-black tracking-tighter text-brand-charcoal">The Studio Experience.</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white p-10 shadow-sm border border-black/5 relative group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex gap-1 text-brand-gold mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-brand-charcoal/80 font-medium leading-relaxed mb-8 text-lg">
                "{review.text}"
              </p>
              <div>
                <p className="font-black text-brand-charcoal tracking-wide uppercase text-sm">{review.name}</p>
                <p className="text-xs font-bold tracking-widest uppercase text-brand-gold mt-1">{review.service}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}