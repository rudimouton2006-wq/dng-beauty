/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Award, BookOpen, Briefcase, Scissors, UserCheck, AlertCircle } from "lucide-react";

interface TrainingProps {
  setPage: (page: string) => void;
}

// Extracted exact data to prevent memory reallocation
const WHAT_YOULL_LEARN = [
  "Lash theory & safety",
  "Sanitation & hygiene",
  "Lash mapping",
  "Proper isolation",
  "Classic application technique",
  "Adhesive knowledge",
  "Client consultation",
  "Aftercare instructions",
  "Lash fills & removals",
  "Pricing & business fundamentals"
];

const WHAT_TO_BRING = [
  "Notebook & pen",
  "Professional, comfortable attire",
  "A live model (on Day 2)"
];

const INCLUSIONS = [
  { icon: BookOpen, text: "Full Training Manual" },
  { icon: Briefcase, text: "Comprehensive Lash Kit" },
  { icon: Scissors, text: "Hands-On Training" },
  { icon: UserCheck, text: "Live Model Practice" },
  { icon: Award, text: "Certificate of Completion" },
  { icon: CheckCircle2, text: "Business & Beginner Tips" }
];

// GPU-accelerated animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Training = memo(function Training({ setPage }: TrainingProps) {
  return (
    <main className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] pt-32 pb-20">
      
      {/* Editorial Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 mb-32">
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
            style={{ willChange: "opacity, transform" }}
        >
            <div className="w-full lg:w-1/2">
                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-6 block">
                    Gabrielle Lashes Academy
                </span>
                <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 leading-[1.1] uppercase">
                    Master the Art. <br/> Build Your Empire.
                </h1>
                <p className="text-gray-500 text-lg font-light leading-relaxed mb-10 tracking-wide">
                    A 2-day, 8-hour hands-on training designed to give you the knowledge, confidence, and highly technical skills to launch your lash career.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
                    <button 
                        onClick={() => setPage("booking")}
                        className="px-10 py-4 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors duration-300"
                    >
                        Secure Your Seat
                    </button>
                    <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">R3,000 Total</span>
                </div>

                {/* Minimalist Schedule Snippet */}
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-l border-[#1A1A1A] pl-4">
                    <span>Day 1: 4 Hours</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Day 2: 4 Hours</span>
                </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
                {/* Thin elegant border instead of a heavy drop shadow block */}
                <div className="absolute inset-0 border border-gray-200 transform translate-x-4 translate-y-4 rounded-sm -z-10"></div>
                <img 
                    src="/images/hero-welcome.jpg" 
                    alt="Lash Training Masterclass"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-[600px] object-cover object-top rounded-sm relative z-10"
                />
            </div>
        </motion.div>
      </section>

      {/* Curriculum Section */}
      <section className="bg-white py-32 px-6 lg:px-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                className="text-center mb-24"
                style={{ willChange: "opacity, transform" }}
            >
                <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4 uppercase">
                    The Curriculum.
                </h2>
                <p className="text-gray-400 font-light tracking-wide text-lg">
                    Everything required to architect a successful beauty business.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 mb-24">
                {/* What You'll Learn - Flat & Clean */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                    style={{ willChange: "opacity, transform" }}
                >
                    <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mb-4 block border-b border-gray-100 pb-4">
                        Comprehensive Study
                    </span>
                    <h3 className="text-2xl font-light text-[#1A1A1A] mb-8 uppercase">What You'll Learn</h3>
                    <ul className="space-y-4">
                        {WHAT_YOULL_LEARN.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-4 text-gray-500 font-light tracking-wide text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0 mt-2"></div>
                                {topic}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <div className="space-y-16">
                    {/* What To Bring - Flat & Clean */}
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                        style={{ willChange: "opacity, transform" }}
                    >
                        <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mb-4 block border-b border-gray-100 pb-4">
                            Preparation
                        </span>
                        <h3 className="text-2xl font-light text-[#1A1A1A] mb-8 uppercase">What To Bring</h3>
                        <ul className="space-y-4">
                            {WHAT_TO_BRING.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-500 font-light tracking-wide text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0 mt-2"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Booking & Deposit Policy - Minimalist Alert Box */}
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                        className="border-l-2 border-[#1A1A1A] pl-6 py-2"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-[#1A1A1A]" size={18} strokeWidth={1.5} />
                            <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest">Booking Policy</h3>
                        </div>
                        <p className="text-gray-500 font-light tracking-wide leading-relaxed text-sm">
                            A non-refundable deposit secures your spot. The balance is due on day one. Spots are limited and booked on a first-come, first-served basis.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Inclusions Grid - Floating Icons without Boxes */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pt-16 border-t border-gray-100"
            >
                {INCLUSIONS.map((item, idx) => (
                    <motion.div 
                        key={idx} variants={fadeUp}
                        className="text-center flex flex-col items-center justify-center gap-4"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="text-[#1A1A1A]">
                            <item.icon size={28} strokeWidth={1} />
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-relaxed max-w-[120px]">
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