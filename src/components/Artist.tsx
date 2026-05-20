/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export default function Artist() {
  return (
    <section className="py-32 bg-white relative overflow-hidden" aria-label="Meet the Artist">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] bg-brand-light border border-black/5 flex items-center justify-center overflow-hidden"
          >
            {/* Replace this div with an actual <img> tag when she provides the photo */}
            <p className="text-brand-charcoal/30 font-bold tracking-widest uppercase text-sm">Professional Photo Placement</p>
            
            {/* Decorative Accent */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl"></div>
          </motion.div>

          {/* Bio Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h2 className="text-sm font-black tracking-widest uppercase text-brand-gold mb-4">Meet The Artist</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-brand-charcoal mb-8">
              Expertistry & Precision.
            </h3>
            <div className="space-y-6 text-brand-charcoal/70 text-lg leading-relaxed font-medium">
              <p>
                With years of dedicated experience in the beauty industry, I specialize in creating flawless, natural enhancements tailored to your unique facial architecture. 
              </p>
              <p>
                My philosophy is simple: beauty is not about changing how you look, but elevating how you feel. Every set of lashes and every brow shape is meticulously crafted using only premium, industry-leading products.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}