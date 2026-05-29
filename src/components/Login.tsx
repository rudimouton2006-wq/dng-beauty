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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const Login = memo(function Login({ setPage }: LoginProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulating a quick secure check so the UI feels physical and premium
    setTimeout(() => {
      // NOTE: For a real production app with high security, you'd use Firebase Auth here.
      // For this static studio site, a hardcoded PIN keeps it simple for Gabby.
      // Change "2026" to whatever 4-digit PIN she wants to use!
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
    <main className="min-h-screen bg-brand-light flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" style={{ transform: "translateZ(0)" }}></div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-3xl shadow-2xl relative z-10 border border-black/5"
        style={{ willChange: "opacity, transform" }}
      >
        <button 
          onClick={() => setPage("home")}
          className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 hover:text-brand-gold transition-colors mb-12 block"
        >
          ← Return to Site
        </button>

        <div className="w-16 h-16 bg-brand-charcoal text-white rounded-2xl flex items-center justify-center mb-8 shadow-inner">
          <Lock size={28} />
        </div>

        <h1 className="text-3xl font-black text-brand-charcoal mb-2 tracking-tight">Studio Command</h1>
        <p className="text-brand-charcoal/50 font-medium text-sm mb-10">
          Enter your authorized PIN to access the booking dashboard and client management system.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-charcoal mb-3">
              Security PIN
            </label>
            <input 
              type="password" 
              maxLength={4}
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-brand-light border border-black/5 p-6 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all font-black text-2xl tracking-[0.5em] text-center"
              placeholder="••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || passcode.length < 4}
            className="w-full py-5 bg-brand-charcoal text-white font-black tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Verifying...</>
            ) : (
              <>Unlock Dashboard <ArrowRight size={16} /></>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
});

export default Login;