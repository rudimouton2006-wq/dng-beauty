/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { motion } from "motion/react";
import { LogOut, Calendar, Users, TrendingUp, Clock, Loader2, User } from "lucide-react";

interface DashboardProps {
  setPage: (page: string) => void;
}

interface BookingData {
  id: string;
  name?: string;
  service?: string;
  date?: string;
  time?: string;
  phone?: string;
}

export default function Dashboard({ setPage }: DashboardProps) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Security Check & Data Fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Kick out anyone who isn't authenticated
      if (!auth.currentUser) {
        setPage("login");
        return;
      }

      // 2. Fetch recent bookings from Firestore
      try {
        const bookingsRef = collection(db, "bookings");
        // Pull the 10 most recent bookings, ordered by creation time
        const q = query(bookingsRef, orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        const fetchedBookings: BookingData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBookings.push({ id: doc.id, ...doc.data() } as BookingData);
        });
        
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setPage]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage("home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center relative z-20">
        <Loader2 className="animate-spin text-brand-gold mb-4" size={40} />
        <p className="text-brand-charcoal/50 font-bold tracking-widest uppercase text-sm">Decrypting Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] relative z-20 px-4 pt-32 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-black/5 pb-8"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-brand-charcoal mb-2">STUDIO DASHBOARD</h1>
            <p className="text-brand-charcoal/50 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Secure Connection Active
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 font-bold uppercase tracking-widest text-xs border border-red-100"
          >
            <LogOut size={16} /> Lock Vault
          </button>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white p-6 shadow-sm border border-black/5">
            <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
              <Calendar size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">{bookings.length}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Recent Bookings</p>
          </div>
          <div className="bg-white p-6 shadow-sm border border-black/5">
            <div className="w-10 h-10 bg-brand-charcoal/5 text-brand-charcoal flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">Active</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Client Status</p>
          </div>
          <div className="bg-white p-6 shadow-sm border border-black/5">
            <div className="w-10 h-10 bg-brand-charcoal/5 text-brand-charcoal flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">Online</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">System Status</p>
          </div>
        </motion.div>

        {/* Bookings Ledger */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white shadow-xl border border-black/5 overflow-hidden">
          <div className="p-8 border-b border-black/5 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-widest uppercase text-brand-charcoal">Recent Inquiries</h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-16 text-center">
              <Clock className="mx-auto text-brand-charcoal/20 mb-4" size={48} />
              <p className="text-brand-charcoal/50 font-medium">No recent bookings found in the database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-black/5 text-xs uppercase tracking-widest text-brand-charcoal/50">
                    <th className="p-6 font-bold">Client</th>
                    <th className="p-6 font-bold">Service Requested</th>
                    <th className="p-6 font-bold">Preferred Date</th>
                    <th className="p-6 font-bold">Contact</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-black/5 hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-bold text-brand-charcoal flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                          <User size={14} />
                        </div>
                        {booking.name || "Unknown"}
                      </td>
                      <td className="p-6 text-brand-charcoal/70 font-medium">{booking.service || "Not specified"}</td>
                      <td className="p-6 text-brand-charcoal/70 font-medium">
                        {booking.date ? `${booking.date} at ${booking.time || 'TBD'}` : "Not specified"}
                      </td>
                      <td className="p-6 text-brand-charcoal/70 font-medium">{booking.phone || "No phone provided"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}