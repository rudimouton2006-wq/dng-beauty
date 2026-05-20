/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Lock, ArrowRight, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  setPage: (page: string) => void;
}

export default function Login({ setPage }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Authenticate with Firebase using the credentials you created in the console
      await signInWithEmailAndPassword(auth, email, password);
      // If successful, unlock the vault and go to the dashboard
      setPage("dashboard"); 
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative z-20 px-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white p-10 shadow-2xl border border-black/5 relative overflow-hidden"
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold"></div>

        <button 
          onClick={() => setPage("home")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-charcoal/50 hover:text-brand-gold transition-colors duration-300 mb-10"
        >
          <ArrowLeft size={14} /> Return to Site
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-brand-charcoal text-white flex items-center justify-center rounded-full shadow-md">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-brand-charcoal">SECURE VAULT</h1>
            <p className="text-xs uppercase tracking-widest text-brand-gold font-bold">Authorized Personnel Only</p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3"
          >
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-brand-charcoal/70 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-black/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all duration-300 text-brand-charcoal font-medium"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-brand-charcoal/70 mb-2">
              Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-black/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all duration-300 text-brand-charcoal font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-charcoal text-white py-4 font-black uppercase tracking-widest text-sm hover:bg-brand-gold transition-colors duration-500 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Unlock Vault <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}