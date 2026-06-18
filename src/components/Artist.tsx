/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const Artist = memo(function Artist() {
  return (
    <section className="py-20 lg:py-32 px-6 lg:px-20 bg-white relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Image Side - Automatically uses the new image you just dragged in */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="w-full lg:w-1/2 aspect-[4/5] bg-[#FAF9F6] rounded-sm overflow-hidden border border-gray-100"
        >
          <img 
            src="/images/applying-lashes.jpg" 
            alt="DnG Beauty Lash Artistry Execution"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            loading="lazy"
          />
        </motion.div>

        {/* Text Side - Updated with Gabby's new bio */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="w-full lg:w-1/2 flex flex-col justify-center"
        >
          <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-[#1A1A1A]"></div>
              <span className="text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-[10px]">
                  The Artist
              </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-8 uppercase leading-tight">
              Mastery in every <br className="hidden lg:block"/> single isolation.
          </h2>
          
          <div className="text-gray-500 text-sm sm:text-base font-light leading-relaxed space-y-5 max-w-lg">
            <p>
              Internationally certified lash technician with 2 years experience, specializing in lash extensions, lash lifts, brow lamination, and professional lash training.
            </p>
            <p>
              My business is a fully registered beauty brand dedicated to enhancing natural beauty through high-quality, customized services. My goal is to help clients feel confident and empowered while also educating and training future lash artists to achieve excellence in the beauty industry.
            </p>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
});

export default Artist;