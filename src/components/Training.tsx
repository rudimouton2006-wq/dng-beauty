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

// Exhaustive lists to prevent client questions
const CURRICULUM_DAY_1 = [
  "In-depth Lash Theory & Anatomy",
  "Sanitation, Health & Hygiene Standards",
  "Contraindications & Allergies",
  "Product & Adhesive Knowledge",
  "Eye Shapes & Custom Lash Mapping",
  "Tweezers Grip & Isolation Techniques",
  "Hands-on Mannequin Head Practice"
];

const CURRICULUM_DAY_2 = [
  "Live Model Preparation & Setup",
  "Client Consultation & Consent Forms",
  "Proper Taping & Eye Pad Placement",
  "Classic & Volume Application on Live Model",
  "Retention Troubleshooting",
  "Safe Lash Removals & Fills",
  "Pricing, Social Media & Business Branding"
];

const KIT_INCLUSIONS = [
  "Comprehensive Training Manual",
  "Premium Mixed Lash Trays (Classic & Volume)",
  "Professional Fast-Drying Adhesive",
  "Lash Primer & Superbonder",
  "Precision Isolation & Placement Tweezers",
  "Glass Lash Tile / Palette",
  "Hydrogel Under-Eye Pads",
  "Medical Grade Tape (Foam & Clear)",
  "Disposable Spoolies & Microbrushes",
  "Lash Cleansing Bath & Brushes",
  "Adhesive Wipes & Glue Rings",
  "Practice Mannequin Head & Sponges"
];

const REQUIREMENTS = [
  "A Live Model for Day 2 (Student must provide)",
  "Comfortable, professional studio attire (Black preferred)",
  "Notebook and pen for theory notes",
  "Full balance payment due on the morning of Day 1",
  "Positive attitude & readiness to learn!"
];

const INCLUSIONS = [
  { icon: BookOpen, text: "Full Training Manual" },
  { icon: Briefcase, text: "Extensive Lash Kit" },
  { icon: Scissors, text: "Hands-On Practice" },
  { icon: UserCheck, text: "Live Model Execution" },
  { icon: Award, text: "Accredited Certificate" },
  { icon: CheckCircle2, text: "Lifetime Mentorship" }
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
                    A comprehensive 2-day, hands-on masterclass designed to give you the exact blueprint, premium kit, and technical skills to launch a highly profitable lash career.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
                    <button 
                        onClick={() => setPage("booking")}
                        className="px-10 py-4 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors duration-300 rounded-sm shadow-sm"
                    >
                        Secure Your Seat
                    </button>
                    {/* Price updated to 3.5k as per Gabby's voice note */}
                    <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">R3,500 Total</span>
                </div>

                {/* Minimalist Schedule Snippet */}
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] border-l-2 border-[#1A1A1A] pl-4">
                    <span>Day 1: Theory & Mannequin</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Day 2: Live Model</span>
                </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
                <div className="absolute inset-0 border border-gray-200 transform translate-x-4 translate-y-4 rounded-sm -z-10"></div>
                <img 
                    src="/images/hero-welcome.jpg" 
                    alt="Lash Training Masterclass"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-[600px] object-cover object-top rounded-sm relative z-10 shadow-sm"
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
                <p className="text-gray-400 font-light tracking-wide text-lg max-w-2xl mx-auto">
                    Everything you need is explicitly outlined below. From theory to your physical kit, no details are left behind.
                </p>
            </motion.div>

            {/* Step-by-Step Layout */}
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
                
                {/* Left Column: The Steps */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="space-y-16" style={{ willChange: "opacity, transform" }}>
                    
                    {/* Day 1 */}
                    <div>
                        <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mb-4 block border-b border-gray-100 pb-4">
                            Step 01
                        </span>
                        <h3 className="text-2xl font-light text-[#1A1A1A] mb-8 uppercase">Day 1: The Foundation</h3>
                        <ul className="space-y-4">
                            {CURRICULUM_DAY_1.map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-500 font-light tracking-wide text-sm leading-relaxed">
                                    <div className="w-1 h-1 rounded-full bg-[#1A1A1A] shrink-0 mt-2.5"></div>
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Day 2 */}
                    <div>
                        <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mb-4 block border-b border-gray-100 pb-4">
                            Step 02
                        </span>
                        <h3 className="text-2xl font-light text-[#1A1A1A] mb-8 uppercase">Day 2: Execution</h3>
                        <ul className="space-y-4">
                            {CURRICULUM_DAY_2.map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-500 font-light tracking-wide text-sm leading-relaxed">
                                    <div className="w-1 h-1 rounded-full bg-[#1A1A1A] shrink-0 mt-2.5"></div>
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </div>

                </motion.div>

                {/* Right Column: Inclusions & Requirements */}
                <div className="space-y-16">
                    
                    {/* The Kit */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="bg-[#FAF9F6] p-8 border border-gray-200 rounded-sm" style={{ willChange: "opacity, transform" }}>
                        <h3 className="text-xl font-medium text-[#1A1A1A] mb-6 uppercase tracking-wide flex items-center gap-3">
                            <Briefcase size={18} /> What's Included (Your Kit)
                        </h3>
                        <ul className="space-y-3">
                            {KIT_INCLUSIONS.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-500 font-medium tracking-wide text-xs">
                                    <CheckCircle2 size={14} className="text-[#1A1A1A] shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Requirements */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} style={{ willChange: "opacity, transform" }}>
                        <span className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mb-4 block border-b border-gray-100 pb-4">
                            Preparation
                        </span>
                        <h3 className="text-2xl font-light text-[#1A1A1A] mb-6 uppercase">Student Requirements</h3>
                        <ul className="space-y-4 mb-8">
                            {REQUIREMENTS.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-gray-500 font-light tracking-wide text-sm leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0 mt-2"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Minimalist Alert Box */}
                        <div className="border-l-2 border-[#1A1A1A] pl-6 py-2">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="text-[#1A1A1A]" size={16} strokeWidth={1.5} />
                                <h3 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Booking Policy</h3>
                            </div>
                            <p className="text-gray-500 font-light tracking-wide leading-relaxed text-xs">
                                A non-refundable deposit secures your spot. The balance is due on day one. Spots are strictly limited.
                            </p>
                        </div>
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