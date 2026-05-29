/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Award, BookOpen, Briefcase } from "lucide-react";

interface TrainingProps {
  setPage: (page: string) => void;
}

// Static Data extracted to prevent memory reallocation on scroll
const CURRICULUM = [
  {
    day: "Day 01",
    title: "The Foundation & Architecture",
    topics: [
      "Anatomy of the natural lash and eye styling.",
      "Health, safety, and workspace sanitation.",
      "Adhesive science and perfect retention ratios.",
      "Isolation mastery and directional placement."
    ]
  },
  {
    day: "Day 02",
    title: "Volume Mastery & Business",
    topics: [
      "Handmaking flawless volume fans (2D - 6D).",
      "Wrapping techniques for seamless bonds.",
      "Live model practical application.",
      "Pricing, marketing, and client photography."
    ]
  }
];

const INCLUSIONS = [
  { icon: Briefcase, text: "Comprehensive Starter Kit (Value R1,500)" },
  { icon: BookOpen, text: "In-depth DnG Training Manual" },
  { icon: Award, text: "Official Certificate of Completion" },
  { icon: CheckCircle2, text: "Ongoing Mentorship & WhatsApp Support" }
];

// GPU-accelerated animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const Training = memo(function Training({ setPage }: TrainingProps) {
  return (
    <main className="bg-white min-h-screen font-sans text-brand-charcoal pt-32 pb-20">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 mb-32">
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col lg:flex-row items-center gap-16"
            style={{ willChange: "opacity, transform" }}
        >
            <div className="w-full lg:w-1/2">
                <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">DnG Academy</span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
                    Master the art. <br/> Build an empire.
                </h1>
                <p className="text-brand-charcoal/70 text-lg font-medium leading-relaxed mb-10">
                    Our intensive 2-Day Masterclass is designed to take you from a complete beginner to a confident, practicing lash artist. We don't just teach application; we teach the architecture of a successful beauty business.
                </p>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setPage("booking")}
                        className="px-10 py-5 bg-brand-charcoal text-white font-black tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors duration-300 shadow-xl flex items-center gap-3"
                    >
                        Secure Your Seat <ArrowRight size={16} />
                    </button>
                    <span className="text-2xl font-black text-brand-gold">R3,000</span>
                </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
                <div className="absolute inset-0 bg-brand-gold/5 transform translate-x-4 translate-y-4 rounded-3xl -z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1559564484-e48b3e040ff4?auto=format&fit=crop&q=80&w=800" 
                    alt="Lash Training Masterclass"
                    decoding="async"
                    loading="lazy"
                    className="w-full h-[500px] object-cover rounded-3xl shadow-2xl relative z-10"
                />
            </div>
        </motion.div>
      </section>

      {/* Curriculum Section */}
      <section className="bg-brand-light py-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                className="text-center mb-20"
                style={{ willChange: "opacity, transform" }}
            >
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-brand-charcoal mb-4">The Curriculum.</h2>
                <p className="text-brand-charcoal/50 font-medium">A structured breakdown of your 2-day intensive.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 mb-20">
                {CURRICULUM.map((module) => (
                    <motion.div 
                        key={module.day}
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                        className="bg-white p-10 md:p-12 border border-black/5 hover:border-brand-gold/30 transition-colors shadow-sm rounded-3xl"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <span className="text-brand-gold font-black tracking-widest uppercase text-sm mb-4 block">{module.day}</span>
                        <h3 className="text-3xl font-black text-brand-charcoal mb-8">{module.title}</h3>
                        <ul className="space-y-4">
                            {module.topics.map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-brand-charcoal/70 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2"></div>
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            {/* Inclusions Grid */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
                {INCLUSIONS.map((item, idx) => (
                    <motion.div 
                        key={idx} variants={fadeUp}
                        className="bg-white border border-black/5 p-8 text-center flex flex-col items-center justify-center gap-4 rounded-2xl shadow-sm"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center">
                            <item.icon size={24} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-brand-charcoal leading-relaxed">
                            {item.text}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

    </main>
  );
});

export default Training;