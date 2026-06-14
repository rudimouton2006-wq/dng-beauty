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

// Extracted exact data from Gabby's WhatsApp message
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const Training = memo(function Training({ setPage }: TrainingProps) {
  return (
    <main className="bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A] pt-32 pb-20">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 mb-32">
        <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col lg:flex-row items-center gap-16"
            style={{ willChange: "opacity, transform" }}
        >
            <div className="w-full lg:w-1/2">
                <span className="text-xs tracking-widest uppercase font-black text-gray-500 mb-6 block">Gabrielle Lashes Academy</span>
                <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-8 leading-[1.1] uppercase">
                    Master the Art. <br/> Build Your Empire.
                </h1>
                <p className="text-gray-700 text-lg font-medium leading-relaxed mb-10 tracking-wide">
                    This is a 2-day, 8-hour hands-on training designed to give you the knowledge, confidence, and skills to begin your lash career.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                    <button 
                        onClick={() => setPage("booking")}
                        className="px-10 py-5 bg-[#1A1A1A] text-white font-black tracking-widest uppercase text-xs hover:bg-gray-800 transition-colors duration-300 shadow-sm flex items-center gap-3 rounded-sm"
                    >
                        Secure Your Seat <ArrowRight size={16} />
                    </button>
                </div>

                {/* Course Schedule Snippet */}
                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-500 border-l-2 border-[#1A1A1A] pl-4">
                    <span>Day 1: 4 Hours</span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span>Day 2: 4 Hours</span>
                </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gray-200 transform translate-x-4 translate-y-4 rounded-sm -z-10"></div>
                <img 
                    src="/images/hero-welcome.jpg" 
                    alt="Lash Training Masterclass"
                    decoding="async"
                    loading="lazy"
                    className="w-full h-[600px] object-cover object-top rounded-sm shadow-lg relative z-10"
                />
            </div>
        </motion.div>
      </section>

      {/* Curriculum Section */}
      <section className="bg-white py-32 px-6 lg:px-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
            <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                className="text-center mb-20"
                style={{ willChange: "opacity, transform" }}
            >
                <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4 uppercase">The Curriculum.</h2>
                <p className="text-gray-500 font-medium tracking-wide">Everything you need to launch a successful lash business.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 mb-20">
                {/* What You'll Learn */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                    className="bg-[#FAF9F6] p-10 md:p-12 border border-gray-100 transition-colors shadow-sm rounded-sm"
                    style={{ willChange: "opacity, transform" }}
                >
                    <span className="text-gray-400 font-black tracking-widest uppercase text-sm mb-4 block">Comprehensive Study</span>
                    <h3 className="text-3xl font-light text-[#1A1A1A] mb-8 uppercase">What You'll Learn</h3>
                    <ul className="space-y-4">
                        {WHAT_YOULL_LEARN.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-4 text-gray-700 font-medium tracking-wide">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0 mt-2.5"></div>
                                {topic}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <div className="space-y-12">
                    {/* What To Bring */}
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                        className="bg-white p-10 md:p-12 border border-gray-100 transition-colors shadow-sm rounded-sm"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <span className="text-gray-400 font-black tracking-widest uppercase text-sm mb-4 block">Preparation</span>
                        <h3 className="text-3xl font-light text-[#1A1A1A] mb-8 uppercase">What To Bring</h3>
                        <ul className="space-y-4">
                            {WHAT_TO_BRING.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-700 font-medium tracking-wide">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0 mt-2.5"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Booking & Deposit Policy */}
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                        className="bg-orange-50 p-10 md:p-12 border border-orange-100 shadow-sm rounded-sm"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-orange-500" size={24} />
                            <h3 className="text-2xl font-light text-[#1A1A1A] uppercase">Booking & Deposit</h3>
                        </div>
                        <p className="text-gray-700 font-medium tracking-wide leading-relaxed">
                            A non-refundable deposit is required to secure your spot. The remaining balance is due before or on the first day of training. 
                            <br/><br/>
                            Please send your desired training date when inquiring, as spots are limited and booked on a first-come, first-served basis. Your seat is officially secured once your deposit is received.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Inclusions Grid */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
                {INCLUSIONS.map((item, idx) => (
                    <motion.div 
                        key={idx} variants={fadeUp}
                        className="bg-[#FAF9F6] border border-gray-100 p-8 text-center flex flex-col items-center justify-center gap-4 rounded-sm shadow-sm hover:shadow-md transition-shadow"
                        style={{ willChange: "opacity, transform" }}
                    >
                        <div className="w-12 h-12 bg-white border border-gray-100 text-[#1A1A1A] rounded-full flex items-center justify-center shadow-sm">
                            <item.icon size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-relaxed">
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