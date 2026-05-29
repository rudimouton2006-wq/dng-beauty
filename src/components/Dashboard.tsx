/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, Calendar as CalendarIcon, Clock, Phone, Mail, 
  RefreshCcw, Loader2, Sparkles, AlertCircle, MessageSquare, 
  CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, X, User
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
  status?: "pending" | "completed";
  createdAt: any;
}

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const drawerVariant = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
  exit: { opacity: 0, x: "100%", transition: { duration: 0.2 } }
};

const Dashboard = memo(function Dashboard({ setPage }: DashboardProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Calendar & Drawer State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // Opens the side drawer and sets the active date
  const openDaySchedule = (dateString: string) => {
    setSelectedDate(dateString);
    setIsDrawerOpen(true);
  };

  // Mark a booking as completed in Firebase and locally
  const markAsCompleted = async (bookingId: string) => {
    try {
      // Optimistic UI update for instant feedback
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: "completed" } : b
      ));

      // Background Firebase update
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "completed" });
    } catch (err) {
      console.error("Error updating status:", err);
      handleRefresh(); // Revert on failure
    }
  };

  // --- REVENUE ENGINE ---
  const stats = useMemo(() => {
    const currentMonthNum = currentMonth.getMonth();
    const currentYearNum = currentMonth.getFullYear();
    
    const prevMonthNum = currentMonthNum === 0 ? 11 : currentMonthNum - 1;
    const prevYearNum = currentMonthNum === 0 ? currentYearNum - 1 : currentYearNum;

    let currentRev = 0;
    let prevRev = 0;
    let pendingCount = 0;

    bookings.forEach(b => {
      const bDate = new Date(b.date);
      const isCompleted = b.status === "completed";
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

  // --- CALENDAR ENGINE ---
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push(dateString);
    }
    return days;
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const selectedDayBookings = bookings.filter(b => b.date === selectedDate);

  return (
    <main className="min-h-screen bg-brand-light font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white pb-20 relative overflow-hidden">
      
      {/* HEADER */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex justify-between items-center">
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

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-10">
        
        {/* REVENUE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block mb-2">This Month's Revenue</span>
                  <span className="text-4xl font-black text-brand-charcoal">R{stats.currentRev}</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100"><TrendingUp size={24} /></div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block mb-2">Last Month's Revenue</span>
                <span className="text-2xl font-black text-brand-charcoal/70">R{stats.prevRev}</span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block mb-2">Total Pending Appointments</span>
                <span className="text-2xl font-black text-brand-charcoal">{stats.pendingCount}</span>
            </motion.div>
        </div>

        {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 mb-8">
                <AlertCircle className="text-red-600 shrink-0" />
                <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
        )}

        {/* FULL PAGE CALENDAR GRID */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-brand-charcoal tracking-tight">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })} Schedule
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-3 bg-brand-light hover:bg-gray-200 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={nextMonth} className="p-3 bg-brand-light hover:bg-gray-200 rounded-full transition-colors"><ChevronRight size={20} /></button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-4 mb-4 text-center">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="text-xs font-black tracking-widest uppercase text-brand-charcoal/40 hidden md:block">{day}</div>
              ))}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-xs font-black tracking-widest uppercase text-brand-charcoal/40 md:hidden">{day}</div>
              ))}
            </div>

            {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center">
                <Loader2 size={40} className="animate-spin text-brand-gold mb-4" />
                <span className="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">Syncing Calendar...</span>
              </div>
            ) : (
              /* The Cubes */
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {calendarDays.map((dateString, i) => {
                  if (!dateString) return <div key={`empty-${i}`} className="aspect-square md:aspect-[4/3]" />;
                  
                  const dayNum = parseInt(dateString.split('-')[2]);
                  const dayBookings = bookings.filter(b => b.date === dateString);
                  const hasPending = dayBookings.some(b => b.status !== "completed");
                  
                  return (
                    <button
                      key={dateString}
                      onClick={() => openDaySchedule(dateString)}
                      className={`relative aspect-square md:aspect-[4/3] rounded-2xl flex flex-col items-center md:items-start justify-center md:justify-start md:p-4 transition-all duration-300 border group ${
                        dayBookings.length > 0
                          ? 'bg-brand-charcoal text-white border-brand-charcoal hover:scale-105 shadow-md z-10' 
                          : 'bg-brand-light/30 border-black/5 hover:border-brand-gold hover:bg-white text-brand-charcoal'
                      }`}
                    >
                      <span className="text-lg md:text-xl font-black">{dayNum}</span>
                      
                      {/* Visual Indicator for Bookings inside the cube */}
                      {dayBookings.length > 0 && (
                        <div className="mt-auto hidden md:flex flex-col w-full gap-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-left truncate ${hasPending ? 'bg-brand-gold text-white' : 'bg-white/20 text-white'}`}>
                            {dayBookings.length} Client{dayBookings.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Mobile dot indicator */}
                      {dayBookings.length > 0 && (
                        <div className={`absolute bottom-2 w-2 h-2 rounded-full md:hidden ${hasPending ? 'bg-brand-gold' : 'bg-white/50'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
        </motion.div>
      </div>

      {/* --- SIDE DRAWER FOR DAILY SCHEDULE --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-40"
            />
            
            {/* The Drawer */}
            <motion.div 
              variants={drawerVariant} initial="hidden" animate="visible" exit="exit"
              className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-brand-light shadow-2xl z-50 flex flex-col border-l border-black/5"
            >
              {/* Drawer Header */}
              <div className="bg-white p-6 border-b border-black/5 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-black text-brand-charcoal tracking-tight">Daily Schedule</h2>
                  <p className="text-sm font-bold text-brand-charcoal/50">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ""}
                  </p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-brand-charcoal" />
                </button>
              </div>

              {/* Drawer Content (Bookings) */}
              <div className="flex-grow overflow-y-auto p-6">
                {selectedDayBookings.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <CalendarIcon size={48} className="mb-4" />
                    <h3 className="text-lg font-black text-brand-charcoal">Schedule Clear</h3>
                    <p className="text-sm font-medium">No bookings on this day.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Sort bookings by time before displaying */}
                    {selectedDayBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => {
                      const isCompleted = booking.status === "completed";

                      return (
                        <motion.div 
                          layout
                          key={booking.id}
                          // MAGIC SAUCE: Grays out the booking entirely if completed
                          className={`bg-white border border-black/5 rounded-2xl p-5 shadow-sm transition-all duration-500 ${isCompleted ? 'opacity-50 grayscale hover:grayscale-0' : 'hover:shadow-md'}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                                <User size={16} className="text-brand-charcoal" />
                              </div>
                              <div>
                                  <h3 className="text-base font-black text-brand-charcoal tracking-tight leading-tight">{booking.customerName}</h3>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">{booking.serviceName}</span>
                              </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block">Value</span>
                                <span className="text-sm font-black text-brand-charcoal">R{booking.deposit_required}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-5 bg-brand-light/50 p-3 rounded-xl border border-black/5">
                              <div className="flex items-center gap-2 text-brand-charcoal font-medium text-xs">
                                  <Clock size={12} className="text-brand-gold" /> {booking.time}
                              </div>
                              <div className="flex items-center gap-2 text-brand-charcoal font-medium text-xs">
                                  <Phone size={12} className="text-brand-gold" /> {booking.customerPhone}
                              </div>
                              <div className="flex items-center gap-2 text-brand-charcoal font-medium text-xs col-span-2">
                                  <Mail size={12} className="text-brand-gold" /> {booking.customerEmail}
                              </div>
                          </div>

                          <div className="flex gap-2">
                            {!isCompleted ? (
                              <button 
                                onClick={() => markAsCompleted(booking.id)}
                                className="flex-1 py-2.5 bg-brand-charcoal text-white font-black tracking-widest uppercase text-[10px] hover:bg-brand-gold transition-colors rounded-lg flex items-center justify-center gap-2 shadow-md"
                              >
                                <CheckCircle2 size={14} /> Mark Done
                              </button>
                            ) : (
                              <div className="flex-1 py-2.5 bg-gray-100 text-gray-500 font-black tracking-widest uppercase text-[10px] rounded-lg flex items-center justify-center gap-2 border border-black/5">
                                <CheckCircle2 size={14} /> Completed
                              </div>
                            )}

                            <button 
                                onClick={() => {
                                    const cleanPhone = booking.customerPhone.replace(/\D/g, '');
                                    const msg = `Hi ${booking.customerName.split(' ')[0]}! This is Gabby from DnG Beauty. I am reaching out regarding your booking today at ${booking.time}.`;
                                    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
                                }}
                                className="px-4 py-2.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors rounded-lg flex items-center justify-center shadow-sm"
                                title="WhatsApp Client"
                            >
                                <MessageSquare size={14} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </main>
  );
});

export default Dashboard;