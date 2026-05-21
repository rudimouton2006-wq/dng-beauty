/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { 
  LogOut, Calendar, Clock, Loader2, User, Banknote, 
  CheckCircle2, Trash2, AlertCircle, Sparkles
} from "lucide-react";

interface DashboardProps {
  setPage: (page: string) => void;
}

// PART 3: Expanded Interface to handle the new smart timestamps and deposits
interface BookingData {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceName?: string;
  date?: string;
  time?: string;
  totalPrice?: number;
  status?: 'pending' | 'confirmed' | 'completed';
  appointment_timestamp?: string; 
  deposit_required?: number;
}

export default function Dashboard({ setPage }: DashboardProps) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!auth.currentUser) {
      setPage("login");
      return;
    }

    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetchedBookings: BookingData[] = [];
      let revenue = 0;
      let pending = 0;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      querySnapshot.forEach((doc) => {
        const data = doc.data() as BookingData;
        const status = data.status || 'pending'; 
        
        fetchedBookings.push({ id: doc.id, ...data, status });
        
        if (status === 'pending') pending++;

        if (data.date && data.totalPrice && (status === 'completed' || status === 'confirmed')) {
          const bookingDate = new Date(data.date);
          if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
            revenue += Number(data.totalPrice);
          }
        }
      });
      
      setBookings(fetchedBookings);
      setMonthlyRevenue(revenue);
      setPendingCount(pending);

    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [setPage]);

  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'completed') => {
    setProcessingId(id);
    try {
      const bookingRef = doc(db, "bookings", id);
      await updateDoc(bookingRef, { status: newStatus });
      await fetchDashboardData(); 
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // PART 3: The 1-Hour Cancellation Detector Algorithm
  const handleDelete = async (booking: BookingData) => {
    if (booking.appointment_timestamp) {
      const aptTime = new Date(booking.appointment_timestamp).getTime();
      const now = new Date().getTime();
      const hoursUntilAppointment = (aptTime - now) / (1000 * 60 * 60);

      // If the appointment is in the future, but LESS than 1 hour away
      if (hoursUntilAppointment > 0 && hoursUntilAppointment <= 1) {
        const confirmFee = window.confirm(
          "⚠️ CANCELLATION PENALTY DETECTED ⚠️\n\nThis cancellation is within 1 hour of the scheduled time. The client forfeits their deposit and is liable for the cancellation fee.\n\nDo you want to proceed and flag this client?"
        );
        if (!confirmFee) return; 
      } else {
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmDelete) return;
      }
    } else {
      // Fallback for older bookings before we added timestamps
      if (!window.confirm("Are you sure you want to delete this booking?")) return;
    }
    
    setProcessingId(booking.id);
    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await deleteDoc(bookingRef);
      await fetchDashboardData(); 
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setProcessingId(null);
    }
  };

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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] uppercase tracking-widest font-bold rounded-full flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Confirmed</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-[10px] uppercase tracking-widest font-bold rounded-full flex items-center gap-1 w-max"><Sparkles size={12}/> Completed</span>;
      default:
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] uppercase tracking-widest font-bold rounded-full flex items-center gap-1 w-max"><Clock size={12}/> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center relative z-20">
        <Loader2 className="animate-spin text-brand-gold mb-4" size={40} />
        <p className="text-brand-charcoal/50 font-bold tracking-widest uppercase text-sm">Syncing Vault...</p>
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
            <h1 className="text-4xl font-black tracking-tighter text-brand-charcoal mb-2">STUDIO COMMAND</h1>
            <p className="text-brand-charcoal/50 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Encrypted Admin Session Active
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 font-bold uppercase tracking-widest text-xs border border-red-100"
          >
            <LogOut size={16} /> Lock Vault
          </button>
        </motion.div>

        {/* Actionable Stats Grid */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white p-6 shadow-sm border border-black/5">
            <div className="w-10 h-10 bg-brand-charcoal/5 text-brand-charcoal flex items-center justify-center mb-4">
              <Calendar size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">{bookings.length}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Total Ledger Entries</p>
          </div>
          
          <div className="bg-white p-6 shadow-sm border border-amber-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10"></div>
            <div className="w-10 h-10 bg-amber-100 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">{pendingCount}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600/70">Requires Confirmation</p>
          </div>

          <div className="bg-white p-6 shadow-sm border border-green-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10"></div>
            <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center mb-4 border border-green-200">
              <Banknote size={20} />
            </div>
            <h3 className="text-3xl font-black text-brand-charcoal mb-1">R{monthlyRevenue.toLocaleString()}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700/70">Secured Revenue (This Month)</p>
          </div>
        </motion.div>

        {/* Interactive Master Ledger */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white shadow-xl border border-black/5 overflow-hidden">
          <div className="p-8 border-b border-black/5 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-widest uppercase text-brand-charcoal">Active Bookings Console</h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-16 text-center">
              <Clock className="mx-auto text-brand-charcoal/20 mb-4" size={48} />
              <p className="text-brand-charcoal/50 font-medium">No bookings found in the secure ledger.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white border-b border-black/5 text-xs uppercase tracking-widest text-brand-charcoal/50">
                    <th className="p-6 font-bold">Client Profile</th>
                    <th className="p-6 font-bold">Service Details</th>
                    <th className="p-6 font-bold">Schedule</th>
                    <th className="p-6 font-bold">Status</th>
                    <th className="p-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className={`border-b border-black/5 transition-colors ${processingId === booking.id ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'}`}>
                      
                      <td className="p-6 font-bold text-brand-charcoal flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                          <User size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base">{booking.customerName || "Unknown"}</span>
                          <span className="text-xs font-normal text-brand-charcoal/50">{booking.customerEmail}</span>
                          <span className="text-xs font-normal text-brand-charcoal/50">{booking.customerPhone}</span>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-charcoal">{booking.serviceName || "Not specified"}</span>
                          <span className="text-brand-gold font-black mt-1">
                            {booking.totalPrice ? `R${booking.totalPrice}` : "—"}
                            {booking.deposit_required && <span className="text-brand-charcoal/40 text-xs font-normal ml-2">(Deposit: R{booking.deposit_required})</span>}
                          </span>
                        </div>
                      </td>

                      <td className="p-6 text-brand-charcoal/80 font-medium">
                        {booking.date ? `${booking.date}` : "Not specified"}<br/>
                        <span className="text-brand-charcoal/50 text-xs">{booking.time ? `@ ${booking.time}` : ""}</span>
                      </td>

                      <td className="p-6">
                        {getStatusBadge(booking.status || 'pending')}
                      </td>

                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              disabled={processingId === booking.id}
                              className="px-3 py-2 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'completed')}
                              disabled={processingId === booking.id}
                              className="px-3 py-2 bg-brand-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-charcoal transition-colors"
                            >
                              Complete
                            </button>
                          )}

                          <button 
                            onClick={() => handleDelete(booking)}
                            disabled={processingId === booking.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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