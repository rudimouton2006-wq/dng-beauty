/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Calendar, Clock, Phone, Mail, RefreshCcw, Loader2, Sparkles, AlertCircle, MessageSquare } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

interface DashboardProps {
  setPage: (page: string) => void;
}

interface BookingRecord {
  id: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  deposit_required: number;
  createdAt: any;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Dashboard = memo(function Dashboard({ setPage }: DashboardProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      setError("");
      // Fetch bookings from Firebase, ordered by the newest created first
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetchedData: BookingRecord[] = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as BookingRecord);
      });
      
      setBookings(fetchedData);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Unable to load bookings. Please check your internet connection.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings();
  };

  const handleLogout = () => {
    // In a full auth system, you would clear tokens here. 
    // For our static vault, we just send her back to the home page securely.
    setPage("home");
  };

  return (
    <main className="min-h-screen bg-brand-light font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white pb-20">
      
      {/* Dashboard Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-charcoal text-white rounded-xl flex items-center justify-center shadow-inner">
              <Sparkles size={20} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-brand-charcoal">Studio Command</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Welcome back, Gabby</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 text-brand-charcoal/50 hover:text-brand-charcoal hover:bg-gray-50 rounded-full transition-all disabled:opacity-50"
              title="Refresh Bookings"
            >
              <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-full transition-colors"
            >
              <LogOut size={14} /> Lock
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12">
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block mb-2">Total Bookings</span>
                <span className="text-4xl font-black text-brand-charcoal">{bookings.length}</span>
            </motion.div>
        </div>

        <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black tracking-tight text-brand-charcoal">Recent Appointments</h2>
        </div>

        {/* Error State */}
        {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 mb-8">
                <AlertCircle className="text-red-600 shrink-0" />
                <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
        )}

        {/* Loading State */}
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-brand-gold mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">Syncing with database...</p>
            </div>
        ) : (
            /* Bookings Grid */
            <AnimatePresence>
                {bookings.length === 0 && !error ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-black/5 p-16 rounded-3xl text-center shadow-sm">
                        <Calendar size={48} className="text-brand-charcoal/20 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-brand-charcoal mb-2">No bookings yet.</h3>
                        <p className="text-brand-charcoal/50 font-medium">When clients book through your website, they will appear here instantly.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {bookings.map((booking) => (
                            <motion.div 
                                key={booking.id}
                                variants={fadeUp}
                                className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
                                style={{ willChange: "opacity, transform" }}
                            >
                                {/* Card Header */}
                                <div className="flex justify-between items-start border-b border-black/5 pb-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-black text-brand-charcoal tracking-tight">{booking.customerName}</h3>
                                        <span className="text-xs font-black uppercase tracking-widest text-brand-gold">{booking.serviceName}</span>
                                    </div>
                                    <div className="bg-brand-light px-3 py-1.5 rounded-full border border-black/5 text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block">Deposit</span>
                                        <span className="text-sm font-black text-brand-charcoal">R{booking.deposit_required}</span>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex items-center gap-3 text-brand-charcoal/80 font-medium text-sm">
                                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0"><Calendar size={14} className="text-brand-gold" /></div>
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center gap-3 text-brand-charcoal/80 font-medium text-sm">
                                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0"><Clock size={14} className="text-brand-gold" /></div>
                                        {booking.time}
                                    </div>
                                    <div className="flex items-center gap-3 text-brand-charcoal/80 font-medium text-sm">
                                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0"><Mail size={14} className="text-brand-gold" /></div>
                                        <a href={`mailto:${booking.customerEmail}`} className="hover:text-brand-gold truncate">{booking.customerEmail}</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-brand-charcoal/80 font-medium text-sm">
                                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0"><Phone size={14} className="text-brand-gold" /></div>
                                        {booking.customerPhone}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <button 
                                    onClick={() => {
                                        const cleanPhone = booking.customerPhone.replace(/\D/g, '');
                                        const msg = `Hi ${booking.customerName.split(' ')[0]}! This is Gabby from DnG Beauty. I'm reaching out regarding your booking for the ${booking.serviceName} on ${booking.date} at ${booking.time}.`;
                                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
                                    }}
                                    className="w-full py-4 bg-[#25D366]/10 text-[#128C7E] font-black tracking-widest uppercase text-[10px] hover:bg-[#25D366] hover:text-white transition-colors rounded-xl flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={14} /> Message Client
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        )}
      </div>
    </main>
  );
});

export default Dashboard;