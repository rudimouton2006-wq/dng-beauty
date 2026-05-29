/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, Calendar as CalendarIcon, Clock, Phone, Mail, 
  RefreshCcw, Loader2, AlertCircle, MessageSquare, 
  CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, X, User, History
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
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<"calendar" | "history">("calendar");

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
      console.error("Failed to load:", err);
      setError("Could not load bookings. Please check your internet.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Lock the background from scrolling when the drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings();
  };

  const openDaySchedule = (dateString: string) => {
    setSelectedDate(dateString);
    setIsDrawerOpen(true);
  };

  const markAsCompleted = async (bookingId: string) => {
    try {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: "completed" } : b
      ));
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "completed" });
    } catch (err) {
      console.error("Error updating:", err);
      handleRefresh(); 
    }
  };

  // --- MONEY MATH ---
  const stats = useMemo(() => {
    const currentMonthNum = currentMonth.getMonth();
    const currentYearNum = currentMonth.getFullYear();
    
    const prevMonthNum = currentMonthNum === 0 ? 11 : currentMonthNum - 1;
    const prevYearNum = currentMonthNum === 0 ? currentYearNum - 1 : currentYearNum;

    let currentIncome = 0;
    let prevIncome = 0;
    let upcomingCount = 0;

    bookings.forEach(b => {
      const bDate = new Date(b.date);
      const isCompleted = b.status === "completed";
      const value = Number(b.deposit_required) || 0; 

      if (isCompleted) {
        if (bDate.getMonth() === currentMonthNum && bDate.getFullYear() === currentYearNum) {
          currentIncome += value;
        } else if (bDate.getMonth() === prevMonthNum && bDate.getFullYear() === prevYearNum) {
          prevIncome += value;
        }
      } else {
        upcomingCount++;
      }
    });

    return { currentIncome, prevIncome, upcomingCount };
  }, [bookings, currentMonth]);

  // --- CALENDAR MATH ---
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

  // The actual Drawer Component rendered via Portal to escape scroll trapping
  const Drawer = () => {
    if (!isDrawerOpen) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Dark Overlay */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setIsDrawerOpen(false)}
          className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
        />
        
        {/* The Drawer Panel */}
        <motion.div 
          variants={drawerVariant} initial="hidden" animate="visible" exit="exit"
          className="relative w-full md:w-[500px] h-full bg-brand-light shadow-2xl flex flex-col border-l border-black/5"
        >
          {/* Drawer Header */}
          <div className="bg-white p-6 border-b border-black/5 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-xl font-black text-brand-charcoal tracking-tight">Daily Schedule</h2>
              <p className="text-sm font-bold text-brand-charcoal/50">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ""}
              </p>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-brand-charcoal" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {selectedDayBookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <CalendarIcon size={48} className="mb-4 text-brand-charcoal/30" />
                <h3 className="text-lg font-black text-brand-charcoal">No Bookings</h3>
                <p className="text-sm font-medium">Your schedule is clear for today.</p>
              </div>
            ) : (
              <div className="space-y-4 pb-20">
                {selectedDayBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => {
                  const isCompleted = booking.status === "completed";

                  return (
                    <motion.div layout key={booking.id} className={`bg-white border border-black/5 rounded-2xl p-5 shadow-sm transition-all duration-300 ${isCompleted ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                            <User size={16} className="text-brand-charcoal" />
                          </div>
                          <div>
                              <h3 className="text-base font-black text-brand-charcoal leading-tight">{booking.customerName}</h3>
                              <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">{booking.serviceName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 block">Paid</span>
                            <span className="text-sm font-black text-brand-charcoal">R{booking.deposit_required}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-5 bg-brand-light/50 p-3 rounded-xl border border-black/5">
                          <div className="flex items-center gap-2 text-brand-charcoal font-medium text-xs"><Clock size={12} className="text-brand-gold" /> {booking.time}</div>
                          <div className="flex items-center gap-2 text-brand-charcoal font-medium text-xs"><Phone size={12} className="text-brand-gold" /> {booking.customerPhone}</div>
                          <div className="flex items-center gap-2 text-brand-charcoal font-medium text-xs col-span-2"><Mail size={12} className="text-brand-gold" /> {booking.customerEmail}</div>
                      </div>

                      <div className="flex gap-2">
                        {!isCompleted ? (
                          <button onClick={() => markAsCompleted(booking.id)} className="flex-1 py-3 bg-brand-charcoal text-white font-black uppercase text-[10px] hover:bg-brand-gold transition-colors rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle2 size={14} /> Finish
                          </button>
                        ) : (
                          <div className="flex-1 py-3 bg-gray-100 text-gray-500 font-black uppercase text-[10px] rounded-lg flex items-center justify-center gap-2 border border-black/5">
                            <CheckCircle2 size={14} /> Done
                          </div>
                        )}

                        <button onClick={() => {
                            const cleanPhone = booking.customerPhone.replace(/\D/g, '');
                            const msg = `Hi ${booking.customerName.split(' ')[0]}! This is Gabby from DnG Beauty. I am messaging about your booking today at ${booking.time}.`;
                            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
                          }} 
                          className="px-4 py-3 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors rounded-lg flex items-center justify-center"
                        >
                            <MessageSquare size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>,
      document.body
    );
  };

  return (
    <main className="min-h-screen bg-brand-light font-sans text-brand-charcoal selection:bg-brand-gold selection:text-white pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-24 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-brand-charcoal">Dashboard</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/40 mt-1">Hello, Gabby</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} disabled={isRefreshing} className="p-3 bg-brand-light hover:bg-gray-200 rounded-full transition-all">
              <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <button onClick={() => setPage("home")} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 px-5 py-3 rounded-full transition-colors">
              <LogOut size={14} /> Lock
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-10">
        
        {/* TOP TABS */}
        <div className="flex gap-4 mb-8 border-b border-black/5 pb-4 overflow-x-auto">
            <button 
                onClick={() => setActiveTab("calendar")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === "calendar" ? "bg-brand-charcoal text-white" : "bg-white text-brand-charcoal/50 hover:bg-gray-50 border border-black/5"}`}
            >
                <CalendarIcon size={14} /> Calendar
            </button>
            <button 
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === "history" ? "bg-brand-charcoal text-white" : "bg-white text-brand-charcoal/50 hover:bg-gray-50 border border-black/5"}`}
            >
                <History size={14} /> Booking History
            </button>
        </div>

        {/* INCOME BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-charcoal/50 block mb-1">Income This Month</span>
                  <span className="text-4xl font-black text-brand-charcoal">R{stats.currentIncome}</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100"><TrendingUp size={24} /></div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 flex flex-col justify-center">
                <span className="text-xs font-bold text-brand-charcoal/50 block mb-1">Income Last Month</span>
                <span className="text-2xl font-black text-brand-charcoal/70">R{stats.prevIncome}</span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 flex flex-col justify-center">
                <span className="text-xs font-bold text-brand-charcoal/50 block mb-1">Upcoming Bookings</span>
                <span className="text-2xl font-black text-brand-charcoal">{stats.upcomingCount}</span>
            </motion.div>
        </div>

        {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4 mb-8">
                <AlertCircle className="text-red-600 shrink-0" />
                <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
        )}

        {/* CONDITIONALLY RENDER TAB CONTENT */}
        {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 size={40} className="animate-spin text-brand-gold mb-4" />
            <span className="text-xs font-black uppercase tracking-widest text-brand-charcoal/50">Loading Bookings...</span>
            </div>
        ) : activeTab === "calendar" ? (
            
            /* --- CALENDAR VIEW --- */
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-brand-charcoal tracking-tight">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-3 bg-brand-light hover:bg-gray-200 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} className="p-3 bg-brand-light hover:bg-gray-200 rounded-full transition-colors"><ChevronRight size={20} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <div key={day} className="text-xs font-black tracking-widest uppercase text-brand-charcoal/40 hidden md:block">{day}</div>
                  ))}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-black tracking-widest uppercase text-brand-charcoal/40 md:hidden">{day}</div>
                  ))}
                </div>

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
                        
                        {dayBookings.length > 0 && (
                          <div className="mt-auto hidden md:flex flex-col w-full gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-left truncate ${hasPending ? 'bg-brand-gold text-white' : 'bg-white/20 text-white'}`}>
                              {dayBookings.length} Client{dayBookings.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        
                        {dayBookings.length > 0 && (
                          <div className={`absolute bottom-2 w-2 h-2 rounded-full md:hidden ${hasPending ? 'bg-brand-gold' : 'bg-white/50'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
            </motion.div>
        ) : (
            
            /* --- HISTORY VIEW --- */
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-black text-brand-charcoal mb-8">All Bookings</h2>
                {bookings.length === 0 ? (
                    <p className="text-brand-charcoal/50 text-sm">No bookings have been made yet.</p>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(booking => (
                            <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-black/5 rounded-2xl hover:bg-gray-50 transition-colors gap-4">
                                <div>
                                    <h4 className="text-base font-black text-brand-charcoal">{booking.customerName}</h4>
                                    <p className="text-xs font-bold text-brand-charcoal/50">{booking.serviceName}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-brand-charcoal/70">
                                    <div className="flex items-center gap-1"><CalendarIcon size={14} className="text-brand-gold" /> {booking.date}</div>
                                    <div className="flex items-center gap-1"><Clock size={14} className="text-brand-gold" /> {booking.time}</div>
                                </div>
                                <div className="text-right flex items-center justify-between md:block">
                                    <span className="text-sm font-black block">R{booking.deposit_required}</span>
                                    <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md ${booking.status === "completed" ? "bg-gray-200 text-gray-500" : "bg-brand-gold/10 text-brand-gold"}`}>
                                        {booking.status === "completed" ? "Done" : "Upcoming"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        )}
      </div>

      {/* Render the Drawer completely outside the layout traps */}
      <AnimatePresence>
        {isDrawerOpen && <Drawer />}
      </AnimatePresence>
    </main>
  );
});

export default Dashboard;