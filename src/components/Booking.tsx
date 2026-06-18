/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { MessageSquare, Calendar, Check, ArrowRight, Phone, Instagram, MapPin, Loader2, AlertCircle, CreditCard, Clock, ClipboardList, Wallet, CheckCircle2 } from "lucide-react";
import { db, handleFirestoreError } from "../lib/firebase";
import type { OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import emailjs from "@emailjs/browser";

interface Service {
  id: string;
  name: string;
  price: string;
  category: string;
  duration: string;
  isMasterclass?: boolean;
}

const BOOKABLE_SERVICES: Service[] = [
  { id: "ext-classics", name: "Classics - Full Set", price: "R350", category: "Full Sets", duration: "3 Hours" },
  { id: "ext-classics-cat", name: "Classics - Cat Eye", price: "R380", category: "Full Sets", duration: "3 Hours" },
  { id: "ext-mega", name: "Mega Classics - Full Set", price: "R370", category: "Full Sets", duration: "3 Hours" },
  { id: "ext-hybrids", name: "Hybrids - Full Set", price: "R400", category: "Full Sets", duration: "3 Hours" },
  { id: "ext-hybrids-cat", name: "Hybrids - Cat Eye", price: "R420", category: "Full Sets", duration: "3 Hours" },
  { id: "ext-vol", name: "Volume - Full Set", price: "R450", category: "Full Sets", duration: "3 Hours" },
  { id: "ext-wispy", name: "Wispy + Spikes - Full Set", price: "R500", category: "Full Sets", duration: "3 Hours" },
  { id: "fill-classics-2", name: "Classics - 2-3 Wk Fill", price: "R250", category: "Fills", duration: "2 Hours" },
  { id: "fill-classics-3", name: "Classics - 3-4 Wk Fill", price: "R300", category: "Fills", duration: "2 Hours" },
  { id: "fill-mega-2", name: "Mega Classics - 2-3 Wk Fill", price: "R270", category: "Fills", duration: "2 Hours" },
  { id: "fill-mega-3", name: "Mega Classics - 3-4 Wk Fill", price: "R300", category: "Fills", duration: "2 Hours" },
  { id: "fill-hybrids-2", name: "Hybrids - 2-3 Wk Fill", price: "R300", category: "Fills", duration: "2 Hours" },
  { id: "fill-hybrids-3", name: "Hybrids - 3-4 Wk Fill", price: "R350", category: "Fills", duration: "2 Hours" },
  { id: "fill-vol-2", name: "Volume - 2-3 Wk Fill", price: "R350", category: "Fills", duration: "2 Hours" },
  { id: "fill-vol-3", name: "Volume - 3-4 Wk Fill", price: "R400", category: "Fills", duration: "2 Hours" },
  { id: "fill-wispy-2", name: "Wispy + Spikes - 2-3 Wk Fill", price: "R390", category: "Fills", duration: "2 Hours" },
  { id: "fill-wispy-3", name: "Wispy + Spikes - 3-4 Wk Fill", price: "R400", category: "Fills", duration: "2 Hours" },
  { id: "clu-classics", name: "Clusters - Classics", price: "R150", category: "Clusters", duration: "30 Min" },
  { id: "clu-classics-cat", name: "Clusters - Classic Cat Eye", price: "R160", category: "Clusters", duration: "30 Min" },
  { id: "clu-hybrids", name: "Clusters - Hybrids", price: "R170", category: "Clusters", duration: "30 Min" },
  { id: "clu-hybrids-cat", name: "Clusters - Hybrid Cat Eye", price: "R180", category: "Clusters", duration: "30 Min" },
  { id: "clu-vol", name: "Clusters - Volume", price: "R200", category: "Clusters", duration: "30 Min" },
  { id: "clu-vol-cat", name: "Clusters - Volume Cat Eye", price: "R220", category: "Clusters", duration: "30 Min" },
  { id: "clu-wispy", name: "Clusters - Wispy Set", price: "R250", category: "Clusters", duration: "30 Min" },
  { id: "add-brow", name: "Brow Shape", price: "R50", category: "Add-Ons", duration: "30 Min" },
  { id: "add-brow-tint", name: "Brow Shape + Tint", price: "R100", category: "Add-Ons", duration: "1 Hour" },
  { id: "add-brow-lam", name: "Brow Lamination + Free Tint", price: "R300", category: "Add-Ons", duration: "45 Min" },
  { id: "add-lash-lift", name: "Lash Lift", price: "R350", category: "Add-Ons", duration: "60 Min" },
  { id: "m-class", name: "2-Day Lash Masterclass", price: "R3500", category: "Training", duration: "2 Days", isMasterclass: true }
];

const SERVICE_CATEGORIES = ["Full Sets", "Fills", "Clusters", "Add-Ons", "Training"];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("Full Sets");
  
  const [bookingData, setBookingData] = useState({
    serviceId: "",
    serviceName: "",
    date: "",
    time: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eyeShape: "Almond",
    lashStyle: "Classic",
    preferredMapping: "Cat Eye",
    allergies: "",
    consent: false,
    totalPrice: 0,
  });
  
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'gateway' | 'eft' | 'cash'>('gateway');

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const selectedServiceObj = BOOKABLE_SERVICES.find(s => s.id === bookingData.serviceId);
  const isMasterclass = selectedServiceObj?.isMasterclass || false;
  
  const isExemptFromTechnical = isMasterclass || bookingData.serviceName.toLowerCase().includes('brow');

  const today = new Date().toISOString().split('T')[0];
  const timeSlots = ["09:00", "11:00", "13:00", "15:00", "17:00"];

  useEffect(() => {
    if (!bookingData.date) {
      setBookedSlots([]);
      return;
    }

    let isMounted = true;
    const fetchTakenSlots = async () => {
      setIsCheckingSlots(true);
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("date", "==", bookingData.date));
        const snapshot = await getDocs(q);
        
        const taken: string[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.booking_status !== "cancelled" && data.status !== "cancelled") {
            taken.push(data.time);
          }
        });
        
        if (isMounted) {
          setBookedSlots(taken);
          if (taken.includes(bookingData.time)) {
            setBookingData(prev => ({ ...prev, time: "" }));
          }
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        if (isMounted) setIsCheckingSlots(false);
      }
    };

    fetchTakenSlots();
    return () => { isMounted = false; };
  }, [bookingData.date, bookingData.time]);

  const handleServiceSelect = (service: Service) => {
    setBookingData({ 
      ...bookingData, 
      serviceId: service.id, 
      serviceName: service.name,
      totalPrice: parseInt(service.price.replace("R", "")),
      time: service.isMasterclass ? "09:00" : ""
    });
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetBooking = () => {
    setBookingData({
        serviceId: "", serviceName: "", date: "", time: "", customerName: "",
        customerEmail: "", customerPhone: "", eyeShape: "Almond", lashStyle: "Classic",
        preferredMapping: "Cat Eye", allergies: "", consent: false, totalPrice: 0
    });
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = bookingData.customerPhone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+27|0)[1-8][0-9]{8}$|^\+?[0-9]{10,14}$/;

    if (!bookingData.customerName.trim()) return "Please enter your full name.";
    if (!bookingData.customerEmail.trim() || !emailRegex.test(bookingData.customerEmail)) return "Please enter a valid email address.";
    if (!bookingData.customerPhone.trim() || !phoneRegex.test(phoneClean)) return "Please enter a valid phone number.";
    if (!bookingData.consent) return "You must agree to the terms and conditions.";
    
    return "";
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmissionError(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");
    
    try {
      const appointmentDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
      const cancelDeadline = new Date(appointmentDateTime.getTime() - (60 * 60 * 1000));

      const finalBookingData = {
        ...bookingData, 
        eyeShape: isExemptFromTechnical ? "N/A" : bookingData.eyeShape,
        preferredMapping: isExemptFromTechnical ? "N/A" : bookingData.preferredMapping,
        allergies: isExemptFromTechnical ? "N/A" : bookingData.allergies,
        booking_status: "pending_deposit", 
        status: "pending",             
        depositPaid: false,          
        paymentMethod: "Pending",    
        deposit_required: "Variable",
        appointment_timestamp: appointmentDateTime.toISOString(),
        cancellation_deadline: cancelDeadline.toISOString(),
        createdAt: serverTimestamp(),
        source: "website_booking_system"
      };

      const bookingsRef = collection(db, "bookings");
      
      // 1. Create the primary booking (Day 1)
      const docRef = await addDoc(bookingsRef, finalBookingData);

      // 2. THE MASTERCLASS GHOST BLOCKER LOGIC
      if (isMasterclass) {
          // Calculate tomorrow's date based on the chosen date
          const nextDay = new Date(bookingData.date);
          nextDay.setDate(nextDay.getDate() + 1);
          const nextDayString = nextDay.toISOString().split('T')[0];

          const day2Data = {
              ...finalBookingData,
              date: nextDayString,
              serviceName: `${bookingData.serviceName} (Day 2 Execution)`,
              isDay2Ghost: true,
              parentBookingId: docRef.id
          };
          // Silently block the exact same time slot on Day 2 in the database
          await addDoc(bookingsRef, day2Data);
      }

      try {
        await emailjs.send(
          "service_x1v01xd",                
          "template_zqu7wcc",                
          {
            to_name: "Gabby",
            client_name: bookingData.customerName,
            client_email: bookingData.customerEmail,
            client_phone: bookingData.customerPhone,
            service: bookingData.serviceName,
            eye_shape: isExemptFromTechnical ? "N/A" : bookingData.eyeShape,
            mapping: isExemptFromTechnical ? "N/A" : bookingData.preferredMapping,
            allergies: isExemptFromTechnical ? "N/A" : (bookingData.allergies || "None"),
            date: bookingData.date,
            time: bookingData.time,
            deposit: `Pending Selection`
          },
          "GtUm7K5L3axEdq-Zt"                
        );
      } catch (emailError) {
        console.warn("Email alert failed.", emailError);
      }

      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "bookings");
      setSubmissionError("Our booking system is temporarily unavailable. Please book directly via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCalendar = () => {
    const { serviceName, date, time } = bookingData;
    if (!date || !time) return;

    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    
    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

    const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`, `DTEND:${formatDate(endDate)}`,
      `SUMMARY:DnG Beauty: ${serviceName}`,
      `DESCRIPTION:Appointment for ${serviceName} at DnG Beauty Cape Town.`,
      'LOCATION:38 Welkom Street, Portlands, Mitchells Plain',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dng-beauty-appointment.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-32 pb-32 bg-[#FAF9F6] min-h-screen font-sans text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ willChange: "opacity, transform" }}>
            <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-6 block">Reservation</span>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 uppercase">Secure Your Session.</h1>
            <p className="text-gray-500 text-lg font-light max-w-md mx-auto leading-relaxed tracking-wide">
              Follow the simple steps below to reserve your appointment.
            </p>
          </motion.div>
        </div>

        {/* Stepper */}
        <div className="max-w-3xl mx-auto mb-16 border-b border-gray-200 pb-6 flex justify-between">
            {['Service', 'Schedule', 'Consultation', 'Confirm'].map((label, index) => {
                const s = index + 1;
                const isActive = step === s;
                const isPast = step > s;
                return (
                    <div key={s} className="flex flex-col items-center gap-2">
                        <div className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[#1A1A1A]' : isPast ? 'text-gray-400' : 'text-gray-300'}`}>
                            {isPast ? <Check size={14} /> : `0${s}`}
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors hidden sm:block ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>

        {/* Booking Container */}
        <div className="max-w-3xl mx-auto relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select Service */}
            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-8" style={{ willChange: "opacity, transform" }}>
                
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-4 border-b border-gray-100">
                    {SERVICE_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`px-4 py-2 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 ${
                                activeTab === category 
                                ? 'bg-[#1A1A1A] text-white' 
                                : 'bg-gray-50 text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BOOKABLE_SERVICES.filter(s => s.category === activeTab).map((s) => (
                    <button 
                      key={s.id} 
                      onClick={() => handleServiceSelect(s)}
                      className="w-full text-left flex items-center justify-between group bg-white border border-gray-100 p-5 rounded-sm hover:border-[#1A1A1A] transition-all duration-300"
                    >
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:text-gray-600 transition-colors tracking-wide">{s.name}</h3>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-2">
                            <Clock size={10} /> {s.duration}
                        </span>
                      </div>
                      <div className="text-lg font-light text-[#1A1A1A]">{s.price}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Date and Time */}
            {step === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-10" style={{ willChange: "opacity, transform" }}>
                <div className="flex justify-between items-center bg-white p-6 rounded-sm border border-gray-100">
                   <div>
                      <span className="text-[9px] tracking-widest uppercase font-bold text-gray-400 block mb-1">Selected</span>
                      <h4 className="text-lg font-medium">{bookingData.serviceName}</h4>
                   </div>
                   <button onClick={resetBooking} className="text-[9px] tracking-widest uppercase font-bold text-gray-400 hover:text-[#1A1A1A] transition-colors border-b border-gray-300 hover:border-[#1A1A1A] pb-0.5">Edit</button>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label htmlFor="date-picker" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">1. Select Date</label>
                    <input 
                      id="date-picker" type="date" min={today}
                      className="w-full p-4 border border-gray-200 outline-none h-14 bg-white font-medium rounded-sm focus:border-[#1A1A1A] transition-colors cursor-pointer text-sm"
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      value={bookingData.date}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">2. Select Time</label>
                      {isCheckingSlots && <Loader2 size={12} className="animate-spin text-gray-400" />}
                    </div>
                    
                    {isMasterclass && (
                      <div className="mb-4 p-3 border border-gray-200 bg-gray-50 rounded-sm flex items-start gap-2">
                        <AlertCircle className="text-gray-500 shrink-0 mt-0.5" size={14} />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                          Masterclasses require a 09:00 AM start. Day 2 will be blocked automatically.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map(t => {
                        const isTaken = bookedSlots.includes(t);
                        const isMasterclassLocked = isMasterclass && t !== "09:00";
                        const isDisabled = isTaken || isMasterclassLocked;

                        return (
                          <button 
                            key={t} disabled={isDisabled}
                            onClick={() => setBookingData({...bookingData, time: t})}
                            className={`py-4 text-[11px] font-bold tracking-widest uppercase border rounded-sm transition-all duration-300 ${
                              isTaken 
                                ? 'bg-gray-50 text-gray-300 line-through border-gray-100 cursor-not-allowed' 
                                : bookingData.time === t 
                                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                                  : 'bg-white border-gray-200 text-[#1A1A1A] hover:border-[#1A1A1A] disabled:bg-gray-50 disabled:opacity-50'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={resetBooking} 
                        className="px-6 py-5 bg-transparent border border-gray-200 text-red-500 font-bold uppercase tracking-widest text-[10px] rounded-sm hover:border-red-500 hover:bg-red-50 transition-colors"
                    >
                        Cancel Booking
                    </button>
                    <button 
                        disabled={!bookingData.date || !bookingData.time}
                        onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="flex-1 flex items-center justify-center p-5 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-[10px] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                    >
                        Continue to Consultation <ArrowRight size={14} />
                    </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Client Details */}
            {step === 3 && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-10" style={{ willChange: "opacity, transform" }}>
                
                {submissionError && (
                  <div className="p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-red-100 flex items-center gap-3">
                    <AlertCircle size={14} /> {submissionError}
                  </div>
                )}

                <form onSubmit={handleDetailsSubmit} className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-[10px] tracking-widest uppercase font-bold text-gray-400 border-b border-gray-200 pb-2">Personal Details</h3>
                    <input 
                      required disabled={isSubmitting} placeholder="Full Name" 
                      className="w-full p-4 border-b border-gray-200 outline-none bg-transparent font-medium focus:border-[#1A1A1A] transition-colors placeholder:text-gray-400 text-sm" 
                      value={bookingData.customerName} onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})} 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        required disabled={isSubmitting} type="email" placeholder="Email Address" 
                        className="w-full p-4 border-b border-gray-200 outline-none bg-transparent font-medium focus:border-[#1A1A1A] transition-colors placeholder:text-gray-400 text-sm" 
                        value={bookingData.customerEmail} onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})} 
                      />
                      <input 
                        required disabled={isSubmitting} placeholder="Contact Number" 
                        className="w-full p-4 border-b border-gray-200 outline-none bg-transparent font-medium focus:border-[#1A1A1A] transition-colors placeholder:text-gray-400 text-sm" 
                        value={bookingData.customerPhone} onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})} 
                      />
                    </div>
                  </div>

                  {!isExemptFromTechnical && (
                    <div className="space-y-6">
                      <h3 className="text-[10px] tracking-widest uppercase font-bold text-gray-400 border-b border-gray-200 pb-2 flex items-center gap-2">
                          <ClipboardList size={12}/> Technical Requirements
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Eye Shape</label>
                          <select 
                            disabled={isSubmitting} value={bookingData.eyeShape} onChange={(e) => setBookingData({...bookingData, eyeShape: e.target.value})}
                            className="w-full p-4 border border-gray-200 outline-none bg-white font-medium rounded-sm focus:border-[#1A1A1A] transition-colors cursor-pointer text-sm"
                          >
                            <option value="Almond">Almond</option>
                            <option value="Round">Round</option>
                            <option value="Hooded">Hooded</option>
                            <option value="Deep Set">Deep Set</option>
                            <option value="Monolid">Monolid</option>
                            <option value="Downturned">Downturned</option>
                            <option value="Upturned">Upturned</option>
                            <option value="Not Sure">Not Sure</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Preferred Mapping</label>
                          <select 
                            disabled={isSubmitting} value={bookingData.preferredMapping} onChange={(e) => setBookingData({...bookingData, preferredMapping: e.target.value})}
                            className="w-full p-4 border border-gray-200 outline-none bg-white font-medium rounded-sm focus:border-[#1A1A1A] transition-colors cursor-pointer text-sm"
                          >
                            <option value="Cat Eye">Cat Eye</option>
                            <option value="Doll Eye">Doll Eye</option>
                            <option value="Open Eye">Open Eye</option>
                            <option value="Squirrel Eye">Squirrel Eye</option>
                            <option value="Recommend For Me">Recommend For Me</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Allergies / Sensitivities</label>
                        <textarea 
                          disabled={isSubmitting} rows={2} placeholder="Leave blank if none..." value={bookingData.allergies} onChange={(e) => setBookingData({...bookingData, allergies: e.target.value})}
                          className="w-full p-4 border border-gray-200 outline-none bg-white font-medium rounded-sm focus:border-[#1A1A1A] transition-colors resize-none placeholder:text-gray-300 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 pt-4">
                    <input 
                      type="checkbox" id="consent" required disabled={isSubmitting} checked={bookingData.consent} onChange={(e) => setBookingData({...bookingData, consent: e.target.checked})}
                      className="mt-1 w-4 h-4 accent-[#1A1A1A] cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-gray-500 cursor-pointer">
                      I confirm the above details are accurate & agree to studio terms.
                    </label>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                    <button type="button" onClick={resetBooking} className="px-6 py-5 bg-transparent border border-gray-200 text-red-500 font-bold uppercase tracking-widest text-[10px] rounded-sm hover:border-red-500 hover:bg-red-50 transition-colors">
                        Cancel Booking
                    </button>
                    <button type="button" onClick={() => setStep(2)} className="px-6 py-5 bg-transparent border border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-[10px] rounded-sm hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
                        Back
                    </button>
                    <button disabled={isSubmitting || !bookingData.consent} type="submit" className="flex-1 flex items-center justify-center gap-3 bg-[#1A1A1A] text-white rounded-sm hover:bg-gray-800 transition-colors font-bold tracking-widest uppercase text-[10px] disabled:opacity-50">
                        {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Processing</> : 'Confirm Details'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Success & Payment Options */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6" style={{ willChange: "opacity, transform" }}>
                
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 size={32} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-light mb-4 text-[#1A1A1A] uppercase tracking-wide">Booking Confirmed</h2>
                
                <p className="text-gray-500 font-light mb-10 max-w-sm mx-auto leading-relaxed text-sm">
                  Your appointment has been successfully secured! Please review your preferred payment choices below to finalize your session.
                </p>

                <div className="flex flex-wrap bg-gray-50 p-1 rounded-sm mb-10 border border-gray-200">
                  <button onClick={() => setPaymentMethod('gateway')} className={`flex-1 py-3 px-2 text-[9px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 ${paymentMethod === 'gateway' ? 'bg-white shadow-sm border border-gray-100 text-[#1A1A1A]' : 'text-gray-400 hover:text-[#1A1A1A]'}`}>
                    Card / Online
                  </button>
                  <button onClick={() => setPaymentMethod('eft')} className={`flex-1 py-3 px-2 text-[9px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 ${paymentMethod === 'eft' ? 'bg-white shadow-sm border border-gray-100 text-[#1A1A1A]' : 'text-gray-400 hover:text-[#1A1A1A]'}`}>
                    Manual EFT
                  </button>
                  <button onClick={() => setPaymentMethod('cash')} className={`flex-1 py-3 px-2 text-[9px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 ${paymentMethod === 'cash' ? 'bg-[#1A1A1A] shadow-sm text-white' : 'text-gray-400 hover:text-[#1A1A1A]'}`}>
                    Pay on the Day
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === 'gateway' && (
                    <motion.div key="gateway" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center border border-gray-200 p-8 rounded-sm bg-white">
                      <CreditCard className="mx-auto mb-4 text-gray-300" size={32} strokeWidth={1} />
                      <p className="text-sm font-light text-gray-500 mb-8 max-w-xs mx-auto">Pay securely using your card or instant EFT via our encrypted gateway.</p>
                      <button onClick={() => window.open("https://pay.yoco.com/dng-beauty", "_blank")} className="w-full py-4 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors rounded-sm">
                        Pay Securely Online
                      </button>
                    </motion.div>
                  )}

                  {paymentMethod === 'eft' && (
                    <motion.div key="eft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-left border border-gray-200 p-8 rounded-sm bg-white">
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bank</span>
                          <span className="font-medium text-[#1A1A1A] text-sm">Standard Bank</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</span>
                          <span className="font-medium text-[#1A1A1A] text-sm">GABRIELLE</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Branch</span>
                          <span className="font-medium text-[#1A1A1A] text-sm">00051001</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#1A1A1A]">10235609216</span>
                            <button onClick={() => { navigator.clipboard.writeText("10235609216"); alert("Copied!"); }} className="text-[9px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-sm hover:bg-gray-200 transition-colors">
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => {
                          const msg = `Hi Gabby! I booked ${bookingData.serviceName} for ${bookingData.date} @ ${bookingData.time}. Here is my POP for the deposit!`;
                          window.open(`https://wa.me/27787030732?text=${encodeURIComponent(msg)}`, "_blank");
                        }} 
                        className="w-full py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] font-bold tracking-widest uppercase text-[10px] hover:bg-[#1A1A1A] hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={14} /> Send POP via WhatsApp
                      </button>
                    </motion.div>
                  )}

                  {paymentMethod === 'cash' && (
                    <motion.div key="cash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center border border-[#1A1A1A] bg-white p-8 rounded-sm">
                      <Wallet className="mx-auto mb-4 text-[#1A1A1A]" size={32} strokeWidth={1} />
                      <p className="text-sm font-light text-[#1A1A1A] mb-8 max-w-xs mx-auto leading-relaxed">
                        You have opted to pay on the day of your appointment. You may settle the balance via <strong className="font-bold">Cash or EFT</strong> at the studio.
                      </p>
                      <button onClick={() => {
                          const msg = `Hi Gabby! I just booked ${bookingData.serviceName} for ${bookingData.date} @ ${bookingData.time} on the website. I have opted to pay on the day (Cash/EFT)!`;
                          window.open(`https://wa.me/27787030732?text=${encodeURIComponent(msg)}`, "_blank");
                        }} 
                        className="w-full py-4 bg-[#1A1A1A] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-gray-800 transition-colors rounded-sm flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={14} /> Confirm via WhatsApp
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-12 p-8 border border-gray-200 bg-white rounded-sm text-center shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-[#1A1A1A]"></div>
                   <MapPin className="mx-auto mb-4 text-[#1A1A1A]" size={28} strokeWidth={1.5} />
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Studio Location</h3>
                   <p className="font-medium text-[#1A1A1A] text-lg lg:text-xl tracking-tight mb-1">38 Welkom Street</p>
                   <p className="text-gray-500 font-light text-sm lg:text-base">Portlands, Mitchells Plain, Cape Town</p>
                   <p className="text-gray-400 text-xs mt-6 italic bg-gray-50 py-3 rounded-sm">Please arrive with clean eyes entirely free of makeup.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                  <button onClick={resetBooking} className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] transition-colors border-b border-transparent hover:border-[#1A1A1A] pb-1 px-4">
                    Book Another Service
                  </button>
                  <button onClick={addToCalendar} className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A] transition-colors border-b border-transparent hover:border-[#1A1A1A] pb-1 flex items-center justify-center gap-2 px-4">
                    <Calendar size={12} /> Add to Personal Calendar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}