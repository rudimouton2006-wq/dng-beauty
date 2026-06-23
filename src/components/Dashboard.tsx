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
  CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, X, User, History, CreditCard, ClipboardList, Lock, Unlock, Trash2
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";

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
  totalPrice?: number; 
  status?: "pending" | "completed" | "cancelled" | "closed_day" | "blocked_slot";
  createdAt: any;
  depositPaid?: boolean; 
  paymentMethod?: "EFT" | "Gateway" | "Pending" | "Cash";
  eyeShape?: string;
  lashStyle?: string;
  preferredMapping?: string;
  allergies?: string;
  isDay2Ghost?: boolean; 
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

const modalVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const ALL_TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const Dashboard = memo(function Dashboard({ setPage }: DashboardProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"calendar" | "history">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClientBooking, setSelectedClientBooking] = useState<BookingRecord | null>(null);

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
      setError("Could not load bookings. Please check your internet connection.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (isDrawerOpen || selectedClientBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen, selectedClientBooking]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings();
  };

  const openDaySchedule = (dateString: string) => {
    setSelectedDate(dateString);
    setIsDrawerOpen(true);
  };

  const openClientDetails = (booking: BookingRecord) => {
    setSelectedClientBooking(booking);
  };

  const markAsCompleted = async (bookingId: string) => {
    try {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: "completed" } : b
      ));
      if (selectedClientBooking?.id === bookingId) {
        setSelectedClientBooking(prev => prev ? { ...prev, status: "completed" } : null);
      }
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "completed" });
    } catch (err) {
      console.error("Error updating:", err);
      handleRefresh(); 
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment? This will instantly free up the slot for other clients.")) return;
    try {
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      ));
      if (selectedClientBooking?.id === bookingId) {
        setSelectedClientBooking(prev => prev ? { ...prev, status: "cancelled" } : null);
      }
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "cancelled" });
    } catch (err) {
      console.error("Error cancelling:", err);
      handleRefresh(); 
    }
  };

  const toggleDayClose = async () => {
    if (!selectedDate) return;
    const dayBlock = bookings.find(b => b.date === selectedDate && b.status === "closed_day");
    
    try {
      if (dayBlock) {
        setBookings(prev => prev.filter(b => b.id !== dayBlock.id));
        await deleteDoc(doc(db, "bookings", dayBlock.id));
      } else {
        if (!window.confirm("Are you sure you want to close this entire day? Clients will not be able to book any slots.")) return;
        const newBlock = {
          date: selectedDate,
          status: "closed_day" as const,
          serviceName: "System Day Block",
          customerName: "System",
          time: "ALL_DAY",
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, "bookings"), newBlock);
        setBookings(prev => [{ id: docRef.id, ...newBlock } as BookingRecord, ...prev]);
      }
    } catch (err) {
      console.error("Error toggling day status:", err);
      handleRefresh();
    }
  };

  const toggleSlotBlock = async (time: string) => {
    if (!selectedDate) return;
    const existingBlock = bookings.find(b => b.date === selectedDate && b.time === time && b.status === "blocked_slot");

    try {
        if (existingBlock) {
            setBookings(prev => prev.filter(b => b.id !== existingBlock.id));
            await deleteDoc(doc(db, "bookings", existingBlock.id));
        } else {
            const newBlock = {
                date: selectedDate,
                time: time,
                status: "blocked_slot" as const,
                serviceName: "Time Slot Locked",
                customerName: "System",
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, "bookings"), newBlock);
            setBookings(prev => [{ id: docRef.id, ...newBlock } as BookingRecord, ...prev]);
        }
    } catch (err) {
        console.error("Error toggling slot:", err);
        handleRefresh();
    }
  };

  const sendWhatsAppReminder = (clientName: string, phone: string, time: string, service: string) => {
    const formattedPhone = phone.startsWith('0') ? `+27${phone.substring(1)}` : phone;
    const cleanPhone = formattedPhone.replace(/[\s-]/g, '');
    const msg = `Hi ${clientName.split(' ')[0]}! ✨ Just a friendly reminder from Gabby at DnG Beauty regarding your appointment tomorrow at ${time} for your ${service}. Please arrive with clean, makeup-free eyes. See you soon!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

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
      const isCancelled = b.status === "cancelled";
      const isClosedDay = b.status === "closed_day";
      const isBlockedSlot = b.status === "blocked_slot";
      const value = Number(b.totalPrice) || 0; 

      if (isCompleted && !b.isDay2Ghost && !isClosedDay && !isBlockedSlot) {
        if (bDate.getMonth() === currentMonthNum && bDate.getFullYear() === currentYearNum) {
          currentIncome += value;
        } else if (bDate.getMonth() === prevMonthNum && bDate.getFullYear() === prevYearNum) {
          prevIncome += value;
        }
      } else if (!isCompleted && !isCancelled && !isClosedDay && !isBlockedSlot && !b.isDay2Ghost) {
        upcomingCount++;
      }
    });

    return { currentIncome, prevIncome, upcomingCount };
  }, [bookings, currentMonth]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) { days.push(null); }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
    }
    return days;
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const selectedDayBookings = bookings.filter(b => b.date === selectedDate);
  const isSelectedDayClosed = selectedDayBookings.some(b => b.status === "closed_day");
  const actualAppointments = selectedDayBookings.filter(b => b.status !== "closed_day" && b.status !== "blocked_slot");

  // 1. Daily Schedule Drawer (Fully Overhauled iOS App Aesthetic)
  const DayDrawer = () => {
    if (!isDrawerOpen) return null;

    const dateObj = selectedDate ? new Date(selectedDate) : new Date();
    const dayName = dateObj.toLocaleDateString('default', { weekday: 'long' });
    const formattedDate = dateObj.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });

    return createPortal(
      <div className="fixed inset-0 z-[90] flex justify-end">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-sm" />
        <motion.div variants={drawerVariant} initial="hidden" animate="visible" exit="exit" className="relative w-full md:w-[480px] h-full bg-[#FAF9F6] shadow-2xl flex flex-col">
          
          {/* iOS-Style App Header */}
          <div className="bg-white px-8 py-10 border-b border-gray-100 flex justify-between items-start shrink-0 rounded-b-3xl shadow-sm z-10">
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{dayName}</p>
              <h2 className="text-3xl font-light text-[#1A1A1A] tracking-tight">{formattedDate}</h2>
              <div className="mt-6 flex items-center gap-3">
                <button onClick={toggleDayClose} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 transition-all ${isSelectedDayClosed ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-gray-50 text-[#1A1A1A] hover:bg-gray-100 border border-gray-200'}`}>
                    {isSelectedDayClosed ? <Lock size={12}/> : <Unlock size={12}/>}
                    {isSelectedDayClosed ? "Day Locked" : "Lock Entire Day"}
                </button>
              </div>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-200">
              <X size={20} className="text-[#1A1A1A]" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-6 py-8">
            {isSelectedDayClosed && (
                <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                    <Lock className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="text-sm font-bold text-red-700 uppercase tracking-widest mb-1">Schedule Locked</h4>
                        <p className="text-xs text-red-600 leading-relaxed font-medium">This day is completely closed. Clients cannot access these time slots.</p>
                    </div>
                </div>
            )}

            {actualAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center opacity-40 py-12">
                <CalendarIcon size={40} className="mb-4 text-gray-400" />
                <h3 className="text-lg font-light text-[#1A1A1A] uppercase">Schedule Clear</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {actualAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => {
                  const isCompleted = booking.status === "completed";
                  const isCancelled = booking.status === "cancelled";
                  
                  // NEW WARM PASTEL LOGIC
                  let cardStyle = "bg-[#FFF0E6] hover:shadow-md hover:-translate-y-0.5 border border-[#FFE5D4]"; // Warm Peach Active
                  let textPrimary = "text-[#1A1A1A]";
                  let textSecondary = "text-gray-600";
                  
                  if (isCancelled) {
                      cardStyle = "bg-gray-50 opacity-60 grayscale border border-gray-200";
                      textPrimary = "text-gray-500 line-through";
                      textSecondary = "text-gray-400 line-through";
                  } else if (isCompleted) {
                      cardStyle = "bg-white opacity-70 border border-gray-200";
                  } else if (booking.isDay2Ghost) {
                      cardStyle = "bg-[#F3F4F6] border border-[#E5E7EB]"; // Soft neutral block
                  }

                  return (
                    <motion.div layout key={booking.id} 
                      onClick={() => openClientDetails(booking)}
                      className={`relative p-5 rounded-2xl transition-all duration-300 cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black bg-white/50 px-2 py-1 rounded-md text-[#1A1A1A] tracking-widest">
                                  {booking.time}
                              </span>
                              {booking.isDay2Ghost && !isCancelled && <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 bg-gray-200/50 px-2 py-1 rounded-md">Auto-Block</span>}
                              {isCancelled && <span className="text-[8px] font-bold uppercase tracking-widest text-red-500 bg-red-100/50 px-2 py-1 rounded-md">Cancelled</span>}
                          </div>
                          
                          {/* Stacked Layout as requested */}
                          <h3 className={`text-base sm:text-lg font-bold leading-tight ${textPrimary}`}>
                              {booking.serviceName}
                          </h3>
                          <p className={`text-sm font-medium mt-1 ${textSecondary}`}>
                              with {booking.customerName}
                          </p>
                        </div>

                        <div className="text-right shrink-0 pt-1">
                            <span className={`text-base font-black ${isCancelled ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
                                {booking.isDay2Ghost ? '-' : `R${booking.totalPrice || 0}`}
                            </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Manage Individual Slots (Matches new smooth UI) */}
            {!isSelectedDayClosed && (
                <div className="mt-12 pt-8">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2 px-2">
                        <Clock size={12} /> Manage Specific Time Slots
                    </h3>
                    <div className="space-y-3">
                        {ALL_TIME_SLOTS.map(time => {
                            const clientBooking = actualAppointments.find(b => b.time === time && b.status !== "cancelled");
                            const isManuallyBlocked = bookings.some(b => b.date === selectedDate && b.time === time && b.status === "blocked_slot");

                            return (
                                <div key={time} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isManuallyBlocked ? 'bg-red-50/50 border border-red-100' : 'bg-white border border-gray-100'}`}>
                                    <span className={`text-xs font-bold ${isManuallyBlocked ? 'text-red-500' : 'text-[#1A1A1A]'}`}>{time}</span>
                                    
                                    {clientBooking ? (
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                            Reserved
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => toggleSlotBlock(time)}
                                            className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-1.5 ${
                                                isManuallyBlocked 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#1A1A1A]'
                                            }`}
                                        >
                                            {isManuallyBlocked ? <Lock size={12} /> : <Unlock size={12} />}
                                            {isManuallyBlocked ? "Unlock Slot" : "Lock Slot"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

          </div>
        </motion.div>
      </div>,
      document.body
    );
  };

  // 2. Comprehensive Client & Booking Detail Modal (Updated with rounded-2xl to match)
  const ClientDetailModal = () => {
    if (!selectedClientBooking) return null;
    
    const clientHistory = bookings.filter(b => b.customerEmail === selectedClientBooking.customerEmail && !b.isDay2Ghost && b.status !== "closed_day" && b.status !== "blocked_slot");
    const lifetimeValue = clientHistory.filter(b => b.status === 'completed').reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
    const isCompleted = selectedClientBooking.status === 'completed';
    const isCancelled = selectedClientBooking.status === 'cancelled';

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedClientBooking(null)} className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm" />
        <motion.div variants={modalVariant} initial="hidden" animate="visible" exit="exit" className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FAF9F6] shadow-2xl rounded-2xl flex flex-col">
          
          <div className="bg-white p-6 sm:p-8 border-b border-gray-100 sticky top-0 z-10 flex justify-between items-start rounded-t-2xl">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center shrink-0">
                <User size={28} className="text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-light text-[#1A1A1A] tracking-tight uppercase">{selectedClientBooking.customerName}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs sm:text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1.5"><Mail size={14}/> {selectedClientBooking.customerEmail}</span>
                  <span className="flex items-center gap-1.5"><Phone size={14}/> {selectedClientBooking.customerPhone}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedClientBooking(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-100"><X size={20} className="text-[#1A1A1A]" /></button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {selectedClientBooking.isDay2Ghost && !isCancelled && (
                <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest">This is a system-generated block for Day 2 of a Masterclass.</p>
                </div>
            )}
            {isCancelled && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold uppercase tracking-widest">This appointment has been cancelled. The slot is open.</p>
                </div>
            )}

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Selected Appointment</h3>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-[#1A1A1A]">{selectedClientBooking.serviceName}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1.5"><CalendarIcon size={16} /> {selectedClientBooking.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} /> {selectedClientBooking.time}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Total Fee</span>
                    <span className="text-2xl font-black text-[#1A1A1A]">{selectedClientBooking.isDay2Ghost ? 'Included' : `R${selectedClientBooking.totalPrice || 0}`}</span>
                  </div>
                </div>

                {!selectedClientBooking.isDay2Ghost && selectedClientBooking.eyeShape !== "N/A" && (
                    <div className="bg-[#FAF9F6] rounded-xl p-4 mb-6">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                        <ClipboardList size={14} /> Consultation Form
                    </h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-400 block text-xs mb-1">Eye Shape:</span><span className="font-bold">{selectedClientBooking.eyeShape || 'N/A'}</span></div>
                        <div><span className="text-gray-400 block text-xs mb-1">Mapping:</span><span className="font-bold">{selectedClientBooking.preferredMapping || 'N/A'}</span></div>
                        <div className="col-span-2"><span className="text-gray-400 block text-xs mb-1">Allergies/Notes:</span><span className="font-bold text-orange-600">{selectedClientBooking.allergies || 'None reported'}</span></div>
                    </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Deposit Status</span>
                      <span className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                        <AlertCircle size={14} className="text-orange-500" /> Pending Verification
                      </span>
                    </div>
                    <CreditCard size={20} className="text-gray-300" />
                  </div>
                  
                  {/* ACTIONS TRAY */}
                  <div className="flex-1 flex gap-2">
                    {!isCompleted && !isCancelled ? (
                      <>
                        <button onClick={() => markAsCompleted(selectedClientBooking.id)} className="flex-1 py-3 bg-[#1A1A1A] text-white font-black uppercase text-[10px] hover:bg-gray-800 transition-colors rounded-xl flex items-center justify-center gap-2 shadow-sm border border-[#1A1A1A]">
                          <CheckCircle2 size={16} /> Mark Done
                        </button>
                        <button onClick={() => cancelBooking(selectedClientBooking.id)} className="px-5 py-3 bg-red-50 text-red-600 font-black uppercase text-[10px] hover:bg-red-100 transition-colors rounded-xl flex items-center justify-center border border-red-100" title="Cancel Appointment">
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : isCompleted ? (
                      <div className="flex-1 py-3 bg-gray-50 text-gray-500 font-black uppercase text-[10px] rounded-xl flex items-center justify-center gap-2 border border-gray-100">
                        <CheckCircle2 size={16} /> Completed
                      </div>
                    ) : (
                      <div className="flex-1 py-3 bg-red-50 text-red-600 font-black uppercase text-[10px] rounded-xl flex items-center justify-center gap-2 border border-red-100">
                        <X size={16} /> Cancelled
                      </div>
                    )}
                    
                    {!selectedClientBooking.isDay2Ghost && !isCancelled && (
                        <button onClick={() => sendWhatsAppReminder(selectedClientBooking.customerName, selectedClientBooking.customerPhone, selectedClientBooking.time, selectedClientBooking.serviceName)} 
                        className="px-5 py-3 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors rounded-xl flex items-center justify-center border border-[#25D366]/20"
                        title="Send Reminder via WhatsApp"
                        >
                            <MessageSquare size={18} />
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!selectedClientBooking.isDay2Ghost && (
                <div>
                <div className="flex justify-between items-end mb-3 ml-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Client History</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Value: R{lifetimeValue}</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {clientHistory.length <= 1 ? (
                    <div className="p-8 text-center text-sm font-medium text-gray-400">This is the client's first booking.</div>
                    ) : (
                    <div className="divide-y divide-gray-50 max-h-[250px] overflow-y-auto">
                        {clientHistory.map(hist => (
                        <div key={hist.id} className={`p-5 flex items-center justify-between hover:bg-gray-50 transition-colors ${hist.id === selectedClientBooking.id ? 'bg-[#FAF9F6]' : ''}`}>
                            <div>
                            <p className={`text-sm font-bold ${hist.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-[#1A1A1A]'}`}>{hist.serviceName}</p>
                            <p className="text-xs font-medium text-gray-400 mt-0.5">{hist.date} • {hist.time}</p>
                            </div>
                            <div className="text-right">
                            <span className={`text-sm font-black block ${hist.status === 'cancelled' ? 'text-gray-300' : 'text-[#1A1A1A]'}`}>R{hist.totalPrice || 0}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 block ${hist.status === 'completed' ? 'text-gray-400' : hist.status === 'cancelled' ? 'text-red-400' : 'text-orange-400'}`}>
                                {hist.status === 'completed' ? 'Done' : hist.status === 'cancelled' ? 'Cancelled' : 'Upcoming'}
                            </span>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
            )}
          </div>
        </motion.div>
      </div>,
      document.body
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] font-sans text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white pb-20">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-24 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-[#1A1A1A] uppercase">Dashboard</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Hello, Gabby</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} disabled={isRefreshing} className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-all">
              <RefreshCcw size={18} className={`text-[#1A1A1A] ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => setPage("home")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A] bg-white border border-gray-200 hover:bg-gray-50 px-6 py-3.5 rounded-full transition-colors">
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-10">
        <div className="flex gap-3 mb-8 border-b border-gray-200 pb-4 overflow-x-auto hide-scrollbar">
            <button onClick={() => setActiveTab("calendar")} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap border ${activeTab === "calendar" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}>
                <CalendarIcon size={14} /> Calendar
            </button>
            <button onClick={() => setActiveTab("history")} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap border ${activeTab === "history" ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}>
                <History size={14} /> Booking History
            </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Income This Month</span>
                  <span className="text-4xl font-light text-[#1A1A1A]">R{stats.currentIncome}</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-[#FFF0E6] text-[#1A1A1A] flex items-center justify-center"><TrendingUp size={24} /></div>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Income Last Month</span>
                <span className="text-2xl font-light text-gray-500">R{stats.prevIncome}</span>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Upcoming Bookings</span>
                <span className="text-2xl font-light text-[#1A1A1A]">{stats.upcomingCount}</span>
            </motion.div>
        </div>

        {error && (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 mb-8">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
        )}

        {/* Calendar Grid View */}
        {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <Loader2 size={40} className="animate-spin text-gray-300 mb-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Workspace...</span>
            </div>
        ) : activeTab === "calendar" ? (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight uppercase">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-3 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={20} className="text-[#1A1A1A]" /></button>
                    <button onClick={nextMonth} className="p-3 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={20} className="text-[#1A1A1A]" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <div key={day} className="text-[10px] font-black tracking-widest uppercase text-gray-400 hidden md:block">{day}</div>
                  ))}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[10px] font-black tracking-widest uppercase text-gray-400 md:hidden">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4">
                  {calendarDays.map((dateString, i) => {
                    if (!dateString) return <div key={`empty-${i}`} className="aspect-square md:aspect-[4/3]" />;
                    const dayNum = parseInt(dateString.split('-')[2]);
                    const dayBookings = bookings.filter(b => b.date === dateString);
                    const isClosed = dayBookings.some(b => b.status === "closed_day");
                    const validAppts = dayBookings.filter(b => b.status !== "closed_day" && b.status !== "blocked_slot" && b.status !== "cancelled");
                    const hasPending = validAppts.some(b => b.status !== "completed");
                    
                    return (
                      <button key={dateString} onClick={() => openDaySchedule(dateString)} className={`relative aspect-square md:aspect-[4/3] rounded-2xl flex flex-col items-center md:items-start justify-center md:justify-start md:p-4 transition-all duration-300 border group ${isClosed ? 'bg-red-50/50 border-red-100 text-red-400 hover:bg-red-50' : validAppts.length > 0 ? 'bg-[#FFF0E6] text-[#1A1A1A] border-[#FFE5D4] hover:shadow-md z-10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-300 text-gray-500'}`}>
                        <div className="flex w-full justify-between items-start">
                            <span className="text-lg md:text-xl font-bold">{dayNum}</span>
                            {isClosed && <Lock size={14} className="text-red-300 mt-1 md:mt-1.5" />}
                        </div>
                        {validAppts.length > 0 && !isClosed && (
                          <div className="mt-auto hidden md:flex flex-col w-full gap-1">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg text-left truncate ${hasPending ? 'bg-white shadow-sm text-[#1A1A1A]' : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'}`}>
                              {validAppts.length} Appt{validAppts.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        {validAppts.length > 0 && !isClosed && <div className={`absolute bottom-3 w-2 h-2 rounded-full md:hidden ${hasPending ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/30'}`} />}
                      </button>
                    );
                  })}
                </div>
            </motion.div>
        ) : (
            
            /* All Bookings History View */
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-light uppercase text-[#1A1A1A] mb-8">All Bookings</h2>
                {bookings.filter(b => b.status !== "closed_day" && b.status !== "blocked_slot").length === 0 ? (
                    <p className="text-gray-400 text-sm font-medium">No bookings have been made yet.</p>
                ) : (
                    <div className="space-y-4">
                        {bookings.filter(b => b.status !== "closed_day" && b.status !== "blocked_slot").map(booking => {
                            const isCancelled = booking.status === "cancelled";
                            
                            // History Card Pastel Logic
                            let cardStyle = "bg-[#FFF0E6] hover:shadow-md border border-[#FFE5D4]"; 
                            if (isCancelled) cardStyle = "bg-gray-50 opacity-60 grayscale border border-gray-200";
                            else if (booking.status === "completed") cardStyle = "bg-white border border-gray-200 opacity-80 hover:opacity-100";
                            else if (booking.isDay2Ghost) cardStyle = "bg-[#F3F4F6] border border-[#E5E7EB]";

                            return (
                                <div key={booking.id} onClick={() => openClientDetails(booking)} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl transition-all cursor-pointer gap-4 ${cardStyle}`}>
                                    <div>
                                        <div className="flex items-center gap-3">
                                          <h4 className={`text-base font-bold ${isCancelled ? 'text-gray-500 line-through' : 'text-[#1A1A1A]'}`}>{booking.serviceName}</h4>
                                          {booking.isDay2Ghost && !isCancelled && <span className="bg-gray-200 text-gray-600 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Auto-Block</span>}
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 mt-1">with {booking.customerName}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 bg-white/50 px-4 py-2 rounded-lg">
                                        <div className="flex items-center gap-1.5"><CalendarIcon size={14} className="text-[#1A1A1A]" /> {booking.date}</div>
                                        <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#1A1A1A]" /> {booking.time}</div>
                                    </div>
                                    <div className="text-right flex items-center justify-between md:flex-col md:items-end md:justify-center">
                                        <span className={`text-base font-black block ${isCancelled ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>{booking.isDay2Ghost ? 'Included' : `R${booking.totalPrice || 0}`}</span>
                                        <span className={`text-[9px] uppercase tracking-widest font-black mt-1 ${booking.status === "completed" ? "text-gray-400" : isCancelled ? "text-red-500" : "text-[#1A1A1A]/50"}`}>
                                            {booking.status === "completed" ? "Done" : isCancelled ? "Cancelled" : "Upcoming"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isDrawerOpen && <DayDrawer />}
        {selectedClientBooking && <ClientDetailModal />}
      </AnimatePresence>
    </main>
  );
});

export default Dashboard;