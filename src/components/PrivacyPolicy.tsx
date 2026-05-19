/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Shield, Lock, EyeOff } from "lucide-react";

export default function PrivacyPolicy() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-24"
        >
          <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Our Commitment</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-none">Privacy <br /> Policy.</h1>
          <p className="text-brand-charcoal/70 text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Your trust is our most valuable asset. Here is a transparent overview of how we protect and handle your data at DnG Beauty.
          </p>
        </motion.div>

        {/* Policy Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.section variants={fadeUp} className="p-10 md:p-12 rounded-3xl bg-gray-50 border border-black/5 shadow-sm hover:shadow-md transition-shadow duration-500">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                <Shield className="text-brand-gold" size={24} />
              </div>
              <h2 className="text-3xl font-black text-brand-charcoal">Data Protection.</h2>
            </div>
            <p className="text-brand-charcoal/80 leading-relaxed font-medium mb-4">
              We collect minimal information to provide you with the best lash and brow services. This includes your name, contact details, and relevant health information for treatment safety.
            </p>
            <p className="text-brand-charcoal/80 leading-relaxed font-medium">
              Your personal information is stored securely and never shared with third parties for marketing purposes.
            </p>
          </motion.section>

          <motion.section variants={fadeUp} className="p-10 md:p-12 rounded-3xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow duration-500">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                <Lock className="text-brand-gold" size={24} />
              </div>
              <h2 className="text-3xl font-black text-brand-charcoal">Booking Security.</h2>
            </div>
            <p className="text-brand-charcoal/80 leading-relaxed font-medium">
              When you book through our system, your data is handled according to industry-standard security protocols. We only use this data to manage your appointments, prevent scheduling conflicts, and send automated reminders.
            </p>
          </motion.section>

          <motion.section variants={fadeUp} className="p-10 md:p-12 rounded-3xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow duration-500">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                <EyeOff className="text-brand-gold" size={24} />
              </div>
              <h2 className="text-3xl font-black text-brand-charcoal">Consent Forms.</h2>
            </div>
            <p className="text-brand-charcoal/80 leading-relaxed font-medium">
              Consent forms sent via WhatsApp are used strictly to verify your suitability for treatments. These records are kept strictly confidential as part of your localized client history.
            </p>
          </motion.section>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-32 pt-12 border-t border-black/5 text-center"
        >
          <p className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest font-black leading-relaxed">
            Last Updated: Jan 2024<br />
            © DnG Beauty (Pty) Ltd
          </p>
        </motion.div>
      </div>
    </div>
  );
}