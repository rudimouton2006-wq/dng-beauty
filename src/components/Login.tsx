/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState } from "react";
import { motion } from "motion/react";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

interface LoginProps {
  setPage: (page: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Login = memo(function Login({ setPage }: LoginProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulating a secure check so the UI feels physical and premium
    setTimeout(() => {
      // NOTE: Hardcoded PIN for Gabby's studio setup is confirmed as 2026.
      if (passcode === "2026") {
        setPage("dashboard");
      } else {
        setError("Invalid credentials. Access denied.");
        setIsLoading(false);
        setPasscode("");
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gray-200/50 rounded-full blur-3xl pointer-events-none" style={{ transform: "translateZ(0)" }}></div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-sm shadow-sm relative z-10 border border-gray-200"
        style={{ willChange: "opacity, transform" }}
      >
        <button 
          onClick={() => setPage("home")}
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] transition-colors mb-12 block border-b border-transparent hover:border-[#1A1A1A] pb-1"
        >
          ← Return to Site
        </button>

        <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-sm flex items-center justify-center mb-8 shadow-sm">
          <Lock size={20} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-light text-[#1A1A1A] mb-2 tracking-tight uppercase">Studio Command</h1>
        <p className="text-gray-500 font-light text-sm mb-10 tracking-wide leading-relaxed">
          Enter your authorized PIN to access the booking dashboard and client management system.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-sm text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Security PIN
            </label>
            <input 
              type="password" 
              maxLength={4}
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 p-6 rounded-sm outline-none focus:border-[#1A1A1A] transition-colors font-medium text-2xl tracking-[0.5em] text-center text-[#1A1A1A]"
              placeholder="••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || passcode.length < 4}
            className="w-full py-5 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors rounded-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <><Loader2 size={14} className="animate-spin" /> Verifying...</>
            ) : (
              <>Unlock Dashboard <ArrowRight size={14} /></>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
});

export default Login;