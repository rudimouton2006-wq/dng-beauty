/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./components/Home.tsx";
import Services from "./components/Services.tsx";
import Training from "./components/Training.tsx";
import Booking from "./components/Booking.tsx";
import Gallery from "./components/Gallery.tsx";
import PrivacyPolicy from "./components/PrivacyPolicy.tsx";
import Login from "./components/Login.tsx";

export default function App() {
  const [currentPage, setPage] = useState("home");

  // Scroll to top on page change to ensure pristine viewing state
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home setPage={setPage} />;
      case "services":
        return <Services />;
      case "training":
        return <Training />;
      case "booking":
        return <Booking />;
      case "gallery":
        return <Gallery setPage={setPage} />;
      case "privacy":
        return <PrivacyPolicy />;
      case "login":
        return <Login setPage={setPage} />;
      case "dashboard":
        return (
          <div className="min-h-[60vh] flex items-center justify-center relative z-20">
            <h1 className="text-3xl font-black tracking-widest text-brand-charcoal">STUDIO DASHBOARD (Component Pending)</h1>
          </div>
        );
      default:
        return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-gold selection:text-white flex flex-col bg-white overflow-x-hidden relative font-sans text-brand-charcoal">
      <Navbar currentPage={currentPage} setPage={setPage} />
      
      <main className="flex-grow relative z-10 w-full" id="main-content" role="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setPage={setPage} />
      
      {/* Absolute Masterpiece Background Elements - Hardware Accelerated */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" aria-hidden="true">
        {/* Subtle Parallax Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#D4AF3705_1px,transparent_1px),linear-gradient(to_bottom,#D4AF3705_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        {/* Atmospheric Floating Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
          className="absolute top-[-10%] -right-20 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[140px] opacity-40 mix-blend-multiply" 
        />
        
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, 70, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ willChange: "transform" }}
          className="absolute bottom-[-10%] -left-20 w-[700px] h-[700px] bg-gray-200/50 rounded-full blur-[160px] opacity-50 mix-blend-multiply" 
        />
      </div>
    </div>
  );
}