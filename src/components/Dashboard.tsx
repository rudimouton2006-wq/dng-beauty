/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { motion } from "motion/react";
import { LogOut, Calendar, Users, Clock, Loader2, User, Banknote } from "lucide-react";

interface DashboardProps {
  setPage: (page: string) => void;
}

// Updated interface to perfectly match your database labels
interface BookingData {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceName?: string;
  date?: string;
  time?: string;
  totalPrice?: number;
  status?: string;
}

export default function Dashboard({ setPage }: DashboardProps) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [uniqueClients, setUniqueClients] = useState(0);
  const [loading, setLoading] = useState(true);

  // Security Check & Data Fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Kick out anyone who isn't authenticated
      if (!auth.currentUser) {
        setPage("login");
        return;
      }

      try {
        const bookingsRef = collection(db, "bookings");
        // Pull the 20 most recent bookings
        const q = query(bookingsRef, orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        
        const fetchedBookings: BookingData[] = [];
        let revenue = 0;
        const clients = new Set();
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        querySnapshot.forEach((doc) => {
          const data = doc.data() as BookingData;
          fetchedBookings.push({ id: doc.id, ...data });
          
          // Count unique clients by email
          if (data.customerEmail) {
            clients.add(data.customerEmail);
          }

          // Calculate revenue for the current month
          if (data.date && data.totalPrice) {
            const bookingDate = new Date(data.date);
            if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
              revenue += Number(data.totalPrice);
            }
          }
        });
        
        setBookings(fetchedBookings);
        setMonthlyRevenue(revenue);
        setUniqueClients(clients.size);

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
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Total Bookings</p>
          </div>
          <div className="bg-white p-6 shadow-sm border border-black/5">
            <div className="w-10 h-10 bg-brand-charcoal/5 text-brand-charcoal flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">{uniqueClients}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Unique Clients</p>
          </div>
          <div className="bg-white p-6 shadow-sm border border-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-bl-full -z-10"></div>
            <div className="w-10 h-10 bg-green-50 text-green-600 flex items-center justify-center mb-4 border border-green-100">
              <Banknote size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">R{monthlyRevenue}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Revenue (This Month)</p>
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
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white border-b border-black/5 text-xs uppercase tracking-widest text-brand-charcoal/50">
                    <th className="p-6 font-bold">Client</th>
                    <th className="p-6 font-bold">Service</th>
                    <th className="p-6 font-bold">Date & Time</th>
                    <th className="p-6 font-bold">Contact</th>
                    <th className="p-6 font-bold text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-black/5 hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-bold text-brand-charcoal flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span>{booking.customerName || "Unknown"}</span>
                          <span className="text-xs font-normal text-brand-charcoal/40">{booking.customerEmail}</span>
                        </div>
                      </td>
                      <td className="p-6 text-brand-charcoal/70 font-bold">{booking.serviceName || "Not specified"}</td>
                      <td className="p-6 text-brand-charcoal/70 font-medium">
                        {booking.date ? `${booking.date} @ ${booking.time || 'TBD'}` : "Not specified"}
                      </td>
                      <td className="p-6 text-brand-charcoal/70 font-medium">{booking.customerPhone || "No phone"}</td>
                      <td className="p-6 text-brand-gold font-black text-right">
                        {booking.totalPrice ? `R${booking.totalPrice}` : "—"}
                      </td>
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