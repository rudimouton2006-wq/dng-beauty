/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, Calendar as CalendarIcon, Clock, Phone, Mail, 
  RefreshCcw, Loader2, Sparkles, AlertCircle, MessageSquare, 
  CheckCircle2, ChevronLeft, ChevronRight, TrendingUp
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";

interface DashboardProps {
  setPage: (page: string) => void;
}

interface BookingRecord {
  id: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // Expected format: YYYY-MM-DD
  time: string;
  deposit_required: number;
  status?: "pending" | "completed"; // New field for tracking completion
  createdAt: any;
}

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const Dashboard = memo(function Dashboard({ setPage }: DashboardProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().toISOString().split('T')[0] // Defaults to today
  );

  const fetchBookings = async () => {
    try {
      setError("");
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

  // Mark a booking as completed in Firebase and locally
  const markAsCompleted = async (bookingId: string) => {
    try {
      // Optimistic UI update (makes it feel instant)
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: "completed" } : b
      ));

      // Background Firebase update
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "completed" });
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert if failed (optional, keeping it simple here)
      handleRefresh(); 
    }
  };

  // --- REVENUE & STATS LOGIC ---
  const stats = useMemo(() => {
    const currentMonthNum = currentMonth.getMonth();
    const currentYearNum = currentMonth.getFullYear();
    
    // Previous month logic
    const prevMonthNum = currentMonthNum === 0 ? 11 : currentMonthNum - 1;
    const prevYearNum = currentMonthNum === 0 ? currentYearNum - 1 : currentYearNum;

    let currentRev = 0;
    let prevRev = 0;
    let pendingCount = 0;

    bookings.forEach(b => {
      // Safely parse the booking date
      const bDate = new Date(b.date);
      const isCompleted = b.status === "completed";
      
      // We are tracking revenue based on the deposit/price collected
      const value = Number(b.deposit_required) || 0; 

      if (isCompleted) {
        if (bDate.getMonth() === currentMonthNum && bDate.getFullYear() === currentYearNum) {
          currentRev += value;
        } else if (bDate.getMonth() === prevMonthNum && bDate.getFullYear() === prevYearNum) {
          prevRev += value;
        }
      } else {
        pendingCount++;
      }
    });

    return { currentRev, prevRev, pendingCount };
  }, [bookings, currentMonth]);

  // --- CALENDAR LOGIC ---
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Empty slots for alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      // Format as YYYY-MM-DD to match Firebase data
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(dateString);
    }
    return days;
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  // Filter bookings for the selected day
  const selectedDayBookings = bookings.filter(b => b.date === selectedDate);

  return (
    <main className="min-h-screen bg-brand-light font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white pb-20">
      
      {/* HEADER */}
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
            <button onClick={handleRefresh} disabled={isRefreshing} className="p-3 text-brand-charcoal/50 hover:text-brand-charcoal hover:bg-gray-50 rounded-full transition-all">
              <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <button onClick={() => setPage("home")} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-full transition-colors">
              <LogOut size={14} /> Lock
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10">
        
        {/* REVENUE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block mb-2">This Month's Revenue</span>
                  <span className="text-3xl font-black text-brand-charcoal">R{stats.currentRev}</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><TrendingUp size={20} /></div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block mb-2">Last Month's Revenue</span>
                <span className="text-2xl font-black text-brand-charcoal/70">R{stats.prevRev}</span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block mb-2">Pending Appointments</span>
                <span className="text-2xl font-black text-brand-charcoal">{stats.pendingCount}</span>
            </motion.div>
        </div>

        {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 mb-8">
                <AlertCircle className="text-red-600 shrink-0" />
                <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: THE CALENDAR */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-full lg:w-1/3">
            <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-brand-charcoal tracking-tight">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={20} /></button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-[10px] font-black tracking-widest uppercase text-brand-charcoal/40">{day}</div>
                ))}
              </div>

              {/* Calendar Cubes */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dateString, i) => {
                  if (!dateString) return <div key={`empty-${i}`} className="aspect-square" />;
                  
                  const dayNum = parseInt(dateString.split('-')[2]);
                  const isSelected = selectedDate === dateString;
                  const dayBookings = bookings.filter(b => b.date === dateString);
                  const hasPending = dayBookings.some(b => b.status !== "completed");
                  
                  return (
                    <button
                      key={dateString}
                      onClick={() => setSelectedDate(dateString)}
                      className={`relative aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 border ${
                        isSelected 
                          ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-md scale-105 z-10' 
                          : 'bg-brand-light/50 border-black/5 hover:border-brand-gold hover:bg-white text-brand-charcoal'
                      }`}
                    >
                      {dayNum}
                      {/* Indicator dot if there are bookings this day */}
                      {dayBookings.length > 0 && (
                        <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${hasPending ? 'bg-brand-gold' : 'bg-green-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: BOOKINGS FOR SELECTED DAY */}
          <div className="w-full lg:w-2/3">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-brand-charcoal">Schedule</h2>
                <p className="text-sm font-bold text-brand-charcoal/50">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center"><Loader2 size={32} className="animate-spin text-brand-gold mx-auto" /></div>
            ) : selectedDayBookings.length === 0 ? (
              <div className="bg-white border border-black/5 p-16 rounded-3xl text-center shadow-sm">
                <CalendarIcon size={48} className="text-brand-charcoal/20 mx-auto mb-6" />
                <h3 className="text-xl font-black text-brand-charcoal mb-2">Schedule Clear.</h3>
                <p className="text-brand-charcoal/50 font-medium">No bookings on this specific day.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {selectedDayBookings.map((booking) => {
                    const isCompleted = booking.status === "completed";

                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={booking.id}
                        // Grays out the booking entirely if completed
                        className={`bg-white border border-black/5 rounded-3xl p-6 shadow-sm transition-all duration-500 flex flex-col md:flex-row gap-6 ${isCompleted ? 'opacity-50 grayscale hover:grayscale-0' : 'hover:shadow-xl'}`}
                      >
                        {/* Booking Info */}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-black text-brand-charcoal tracking-tight">{booking.customerName}</h3>
                                <span className="text-xs font-black uppercase tracking-widest text-brand-gold">{booking.serviceName}</span>
                            </div>
                            <div className="bg-brand-light px-3 py-1.5 rounded-full border border-black/5 text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block">Collected</span>
                                <span className="text-sm font-black text-brand-charcoal">R{booking.deposit_required}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="flex items-center gap-2 text-brand-charcoal/80 font-medium text-sm">
                                  <Clock size={14} className="text-brand-gold" /> {booking.time}
                              </div>
                              <div className="flex items-center gap-2 text-brand-charcoal/80 font-medium text-sm">
                                  <Phone size={14} className="text-brand-gold" /> {booking.customerPhone}
                              </div>
                              <div className="flex items-center gap-2 text-brand-charcoal/80 font-medium text-sm col-span-2">
                                  <Mail size={14} className="text-brand-gold" /> {booking.customerEmail}
                              </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            {!isCompleted ? (
                              <button 
                                onClick={() => markAsCompleted(booking.id)}
                                className="flex-1 py-3 bg-brand-charcoal text-white font-black tracking-widest uppercase text-[10px] hover:bg-brand-gold transition-colors rounded-xl flex items-center justify-center gap-2"
                              >
                                <CheckCircle2 size={16} /> Mark Completed
                              </button>
                            ) : (
                              <div className="flex-1 py-3 bg-gray-100 text-gray-500 font-black tracking-widest uppercase text-[10px] rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                <CheckCircle2 size={16} /> Completed
                              </div>
                            )}

                            <button 
                                onClick={() => {
                                    const cleanPhone = booking.customerPhone.replace(/\D/g, '');
                                    const msg = `Hi ${booking.customerName.split(' ')[0]}! This is Gabby from DnG Beauty.`;
                                    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
                                }}
                                className="px-5 py-3 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors rounded-xl flex items-center justify-center"
                                title="WhatsApp Client"
                            >
                                <MessageSquare size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
});

export default Dashboard;