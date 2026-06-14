/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { MessageSquare, Calendar, Check, ArrowRight, Phone, Instagram, MapPin, Loader2, AlertCircle, CreditCard, Building2, Clock } from "lucide-react";
import { db, handleFirestoreError } from "../lib/firebase";
import type { OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import emailjs from "@emailjs/browser";

interface Service {
  id: string;
  name: string;
  price: string;
  category: string;
  img: string;
  duration: string;
  isMasterclass?: boolean;
}

// Updated with the exact services and local images from Phase 1
const SERVICES: Service[] = [
  { id: "c-ext", name: "Classic Extensions", price: "R350", category: "Extensions", img: "/images/classic-extensions.jpg", duration: "90 min" },
  { id: "h-ext", name: "Hybrid Extensions", price: "R400", category: "Extensions", img: "/images/hybrid-extensions.jpg", duration: "105 min" },
  { id: "v-ext", name: "Volume Extensions", price: "R450", category: "Extensions", img: "/images/volume-extensions.jpg", duration: "120 min" },
  { id: "b-lam", name: "Brow Lamination", price: "R300", category: "Brows", img: "/images/brow-lamination.jpg", duration: "45 min" },
  { id: "l-lift", name: "Lash Lift", price: "R350", category: "Lifts", img: "/images/lash-lift.jpg", duration: "60 min" },
  { id: "m-class", name: "2-Day Lash Masterclass", price: "R3000", category: "Training", img: "/images/hero-welcome.jpg", duration: "2 Days", isMasterclass: true }
];

export default function Booking() {
  const [step, setStep] = useState(1);
  
  // Phase 3: Added all Consultation Form parameters to state
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
  
  // Anti-Overlap State
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'eft' | 'gateway'>('gateway');

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  const selectedServiceObj = SERVICES.find(s => s.id === bookingData.serviceId);
  const isMasterclass = selectedServiceObj?.isMasterclass || false;
  
  const standardDeposit = 200;
  const depositAmount = isMasterclass ? standardDeposit * 1.5 : standardDeposit;

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

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = bookingData.customerPhone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+27|0)[1-8][0-9]{8}$|^\+?[0-9]{10,14}$/;

    if (!bookingData.customerName.trim()) return "Please enter your full name.";
    if (!bookingData.customerEmail.trim() || !emailRegex.test(bookingData.customerEmail)) return "Please enter a valid email address.";
    if (!bookingData.customerPhone.trim() || !phoneRegex.test(phoneClean)) return "Please enter a valid phone number (e.g., 082 123 4567).";
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
        booking_status: "pending_deposit", 
        status: "pending",             
        depositPaid: false,          
        paymentMethod: "Pending",    
        deposit_required: depositAmount,
        cancellation_eligibility: "eligible",
        appointment_timestamp: appointmentDateTime.toISOString(),
        cancellation_deadline: cancelDeadline.toISOString(),
        createdAt: serverTimestamp(),
        source: "website_booking_system"
      };

      const bookingsRef = collection(db, "bookings");
      await addDoc(bookingsRef, finalBookingData);

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
            eye_shape: bookingData.eyeShape,
            mapping: bookingData.preferredMapping,
            allergies: bookingData.allergies || "None",
            date: bookingData.date,
            time: bookingData.time,
            deposit: `R${depositAmount}`
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

    const formatDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:DnG Beauty: ${serviceName}`,
      `DESCRIPTION:Appointment for ${serviceName} at DnG Beauty Cape Town.`,
      'LOCATION:Cape Town, South Africa',
      'END:VEVENT',
      'END:VCALENDAR'
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
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="luxury-container">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Simple Booking</span>
            <h1 className="text-6xl md:text-8xl font-black mb-10 leading-none">Ready?</h1>
            <p className="text-brand-charcoal/80 text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Follow the simple steps below to secure your appointment. Our curated experience begins here.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
               <button 
                 onClick={() => {
                   const msg = "Hi Gabby! I'd like to inquire about a booking at DnG Beauty.";
                   window.open(`https://wa.me/27787030732?text=${encodeURIComponent(msg)}`, "_blank");
                 }}
                 className="flex items-center justify-center gap-4 bg-[#25D366] text-white px-10 py-5 text-xs tracking-widest uppercase font-black transition-all hover:opacity-90 shadow-lg rounded-lg"
                 aria-label="Chat on WhatsApp directly"
               >
                 <MessageSquare size={16} /> Chat on WhatsApp
               </button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Stepper */}
        <div className="max-w-3xl mx-auto mb-16" aria-label="Booking Progress">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 translate-y-[-50%]" />
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`flex items-center justify-center w-12 h-12 rounded-full font-black text-sm transition-all duration-700 shadow-sm border-2 ${
                  step >= s ? 'bg-brand-charcoal border-brand-charcoal text-white scale-110 shadow-xl' : 'bg-white border-gray-200 text-brand-charcoal/30'
                }`}
                aria-current={step === s ? "step" : undefined}
              >
                {step > s ? <Check size={18} strokeWidth={3} className="text-brand-gold" /> : s}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-0">
            <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${step >= 1 ? 'text-brand-charcoal' : 'text-brand-charcoal/30'}`}>Service</span>
            <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${step >= 2 ? 'text-brand-charcoal' : 'text-brand-charcoal/30'}`}>Time</span>
            <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${step >= 3 ? 'text-brand-charcoal' : 'text-brand-charcoal/30'}`}>Details</span>
            <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${step >= 4 ? 'text-brand-charcoal' : 'text-brand-charcoal/30'}`}>Done</span>
          </div>
        </div>

        {/* Interactive Booking Container */}
        <div className="max-w-3xl mx-auto bg-gray-50 border border-black/5 p-8 md:p-16 relative overflow-hidden rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select Service */}
            {step === 1 && (
              <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-12">
                <div className="flex justify-between items-end mb-10 border-b border-black/5 pb-8">
                  <h2 className="text-4xl font-black">Step 1. <br /><span className="text-brand-charcoal/50 text-2xl font-black uppercase tracking-widest">Select Service</span></h2>
                  <span className="text-brand-gold font-black text-xl">01 / 03</span>
                </div>
                <div className="grid gap-6">
                  {SERVICES.map((s) => (
                    <button 
                      key={s.id} 
                      onClick={() => handleServiceSelect(s)}
                      className="w-full text-left flex items-center gap-6 group border border-transparent bg-white p-6 rounded-2xl hover:border-brand-gold/30 hover:shadow-xl transition-all duration-500"
                      aria-label={`Select ${s.name} for ${s.price}`}
                    >
                      <div className="w-24 h-24 overflow-hidden rounded-xl shadow-inner bg-gray-100 hidden sm:block">
                        <img 
                          src={s.img} 
                          alt={s.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow">
                        <span className="text-[10px] tracking-widest uppercase font-black text-brand-gold block mb-2">{s.category}</span>
                        <h3 className="text-2xl font-black text-brand-charcoal group-hover:text-brand-gold transition-colors">{s.name}</h3>
                        <span className="text-[10px] font-black text-brand-charcoal/40 uppercase tracking-widest">{s.duration}</span>
                      </div>
                      <div className="text-3xl font-black text-brand-charcoal group-hover:text-brand-gold transition-colors">{s.price}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Date and Time */}
            {step === 2 && (
              <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-12">
                <button onClick={() => setStep(1)} className="text-xs tracking-widest uppercase font-black text-brand-charcoal/40 hover:text-brand-gold transition-colors mb-8 flex items-center gap-2">← Change Service</button>
                <div className="flex justify-between items-end mb-10 border-b border-black/5 pb-8">
                  <h2 className="text-4xl font-black">Step 2. <br /><span className="text-brand-charcoal/50 text-2xl font-black uppercase tracking-widest">Pick Time</span></h2>
                  <span className="text-brand-gold font-black text-xl">02 / 03</span>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
                   <div>
                      <span className="text-[10px] tracking-widest uppercase font-black text-brand-gold block mb-1">Selected</span>
                      <h4 className="text-xl font-black">{bookingData.serviceName}</h4>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] tracking-widest uppercase font-black text-brand-charcoal/50 block mb-1">Required Deposit</span>
                      <span className="text-2xl font-black text-brand-gold">R{depositAmount}</span>
                   </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <label htmlFor="date-picker" className="block text-xs font-black uppercase tracking-widest text-brand-charcoal mb-4">Choose Date</label>
                    <input 
                      id="date-picker"
                      type="date" 
                      min={today}
                      className="w-full p-6 border border-black/10 focus:border-brand-gold outline-none h-16 bg-white font-bold rounded-xl shadow-sm transition-all focus:ring-4 focus:ring-brand-gold/10 cursor-pointer"
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      value={bookingData.date}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <label className="block text-xs font-black uppercase tracking-widest text-brand-charcoal">Choose Time Slot</label>
                      {isCheckingSlots && <Loader2 size={16} className="animate-spin text-brand-gold" />}
                    </div>
                    
                    {isMasterclass && (
                      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
                          The 2-Day Masterclass requires a full day commitment. Time selection is locked to a 09:00 AM start.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {timeSlots.map(t => {
                        const isTaken = bookedSlots.includes(t);
                        const isMasterclassLocked = isMasterclass && t !== "09:00";
                        const isDisabled = isTaken || isMasterclassLocked;

                        return (
                          <button 
                            key={t}
                            disabled={isDisabled}
                            onClick={() => setBookingData({...bookingData, time: t})}
                            className={`py-5 text-sm font-black tracking-widest uppercase border-2 rounded-xl transition-all duration-300 disabled:cursor-not-allowed ${
                              isTaken 
                                ? 'bg-red-50 text-red-300 line-through border-red-100' 
                                : bookingData.time === t 
                                  ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-lg scale-105' 
                                  : 'bg-white border-black/5 text-brand-charcoal hover:border-brand-gold/30 hover:shadow-md disabled:bg-gray-100 disabled:opacity-30'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                    
                    {bookedSlots.length > 0 && !isCheckingSlots && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertCircle size={14} /> Crossed out times are already booked.
                      </motion.p>
                    )}
                  </div>
                  <button 
                    disabled={!bookingData.date || !bookingData.time}
                    onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="minimal-btn w-full shadow-xl flex items-center justify-center gap-4 py-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-charcoal disabled:hover:scale-100 bg-brand-charcoal text-white font-black uppercase tracking-widest text-xs rounded-xl"
                  >
                    Continue to Consultation <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Client Details & Lash Consultation */}
            {step === 3 && (
              <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="space-y-12">
                <button onClick={() => setStep(2)} className="text-xs tracking-widest uppercase font-black text-brand-charcoal/40 hover:text-brand-gold transition-colors mb-8 flex items-center gap-2">← Change Schedule</button>
                <div className="flex justify-between items-end mb-10 border-b border-black/5 pb-8">
                  <h2 className="text-4xl font-black">Step 3. <br /><span className="text-brand-charcoal/50 text-2xl font-black uppercase tracking-widest">Consultation</span></h2>
                  <span className="text-brand-gold font-black text-xl">03 / 03</span>
                </div>
                
                {submissionError && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-xl border border-red-100 mb-8 flex items-center gap-4 shadow-sm">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    {submissionError}
                  </motion.div>
                )}

                <form onSubmit={handleDetailsSubmit} className="space-y-8">
                  
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <input 
                      required 
                      disabled={isSubmitting}
                      placeholder="Your Full Name" 
                      className="w-full p-6 border border-black/10 h-16 outline-none bg-white font-bold rounded-xl shadow-sm focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all placeholder:text-brand-charcoal/30 disabled:opacity-50 disabled:bg-gray-50" 
                      value={bookingData.customerName} 
                      onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})} 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        required 
                        disabled={isSubmitting}
                        type="email" 
                        placeholder="Your Email Address" 
                        className="w-full p-6 border border-black/10 h-16 outline-none bg-white font-bold rounded-xl shadow-sm focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all placeholder:text-brand-charcoal/30 disabled:opacity-50 disabled:bg-gray-50" 
                        value={bookingData.customerEmail} 
                        onChange={(e) => setBookingData({...bookingData, customerEmail: e.target.value})} 
                      />
                      <input 
                        required 
                        disabled={isSubmitting}
                        placeholder="Contact Number" 
                        className="w-full p-6 border border-black/10 h-16 outline-none bg-white font-bold rounded-xl shadow-sm focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all placeholder:text-brand-charcoal/30 disabled:opacity-50 disabled:bg-gray-50" 
                        value={bookingData.customerPhone} 
                        onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Phase 3 Consultation Form Fields */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-black/5 shadow-sm space-y-6">
                    <h3 className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 border-b border-black/5 pb-4">Lash Consultation Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-charcoal mb-3">Eye Shape</label>
                        <select 
                          disabled={isSubmitting}
                          value={bookingData.eyeShape}
                          onChange={(e) => setBookingData({...bookingData, eyeShape: e.target.value})}
                          className="w-full p-4 border border-black/10 outline-none bg-gray-50 font-bold rounded-xl focus:border-brand-gold focus:bg-white transition-colors cursor-pointer"
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
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-charcoal mb-3">Desired Lash Style</label>
                        <select 
                          disabled={isSubmitting}
                          value={bookingData.lashStyle}
                          onChange={(e) => setBookingData({...bookingData, lashStyle: e.target.value})}
                          className="w-full p-4 border border-black/10 outline-none bg-gray-50 font-bold rounded-xl focus:border-brand-gold focus:bg-white transition-colors cursor-pointer"
                        >
                          <option value="Classic">Classic Extensions</option>
                          <option value="Hybrid">Hybrid Extensions</option>
                          <option value="Volume">Volume Extensions</option>
                          <option value="Lash Lift">Lash Lift</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-brand-charcoal mb-3">Preferred Mapping</label>
                      <select 
                        disabled={isSubmitting}
                        value={bookingData.preferredMapping}
                        onChange={(e) => setBookingData({...bookingData, preferredMapping: e.target.value})}
                        className="w-full p-4 border border-black/10 outline-none bg-gray-50 font-bold rounded-xl focus:border-brand-gold focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="Cat Eye">Cat Eye</option>
                        <option value="Doll Eye">Doll Eye</option>
                        <option value="Open Eye">Open Eye</option>
                        <option value="Squirrel Eye">Squirrel Eye</option>
                        <option value="Recommend For Me">Recommend For Me</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-brand-charcoal mb-3">Any allergies or sensitivities?</label>
                      <textarea 
                        disabled={isSubmitting}
                        rows={2}
                        placeholder="Leave blank if none..."
                        value={bookingData.allergies}
                        onChange={(e) => setBookingData({...bookingData, allergies: e.target.value})}
                        className="w-full p-4 border border-black/10 outline-none bg-gray-50 font-bold rounded-xl focus:border-brand-gold focus:bg-white transition-colors resize-none placeholder:text-brand-charcoal/30"
                      />
                    </div>

                    <div className="flex items-start gap-4 pt-4">
                      <input 
                        type="checkbox" 
                        id="consent"
                        required
                        disabled={isSubmitting}
                        checked={bookingData.consent}
                        onChange={(e) => setBookingData({...bookingData, consent: e.target.checked})}
                        className="mt-1 w-5 h-5 accent-brand-charcoal cursor-pointer"
                      />
                      <label htmlFor="consent" className="text-xs font-bold leading-relaxed text-brand-charcoal/70 cursor-pointer">
                        I agree to the terms and conditions, and I confirm the above consultation details are accurate.
                      </label>
                    </div>
                  </div>
                  
                  {/* Digital Receipt / Summary */}
                  <div className="p-8 bg-brand-gold/5 rounded-2xl border border-brand-gold/20 space-y-4 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold border-b border-brand-gold/20 pb-4 mb-4 relative z-10">Appointment Summary</p>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-2xl font-black text-brand-charcoal leading-none mb-3">{bookingData.serviceName}</p>
                        <p className="text-sm font-black text-brand-charcoal uppercase tracking-widest flex items-center gap-2 mb-4">
                          <Calendar size={14} className="text-brand-gold"/> {bookingData.date} @ {bookingData.time}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50">Deposit to Secure</p>
                      </div>
                      <div className="text-4xl font-black text-brand-gold">R{depositAmount}</div>
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting || !bookingData.consent} 
                    type="submit" 
                    className="w-full shadow-xl py-6 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-wait bg-brand-charcoal text-white rounded-xl hover:bg-brand-gold transition-colors font-black tracking-widest uppercase text-xs"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing...</>
                    ) : (
                      <><Check size={18} /> Confirm & Proceed to Payment</>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Success & Dual Payment Options */}
            {step === 4 && (
              <motion.div 
                key="step4" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-orange-100">
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                   >
                     <AlertCircle className="text-orange-500" size={40} strokeWidth={3} />
                   </motion.div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-brand-charcoal">Action Required</h2>
                
                <div className="bg-orange-50/50 border border-orange-200 p-4 rounded-xl mb-8 max-w-md mx-auto">
                  <p className="text-orange-800 font-bold text-sm">
                    Your spot is reserved, but <strong className="font-black uppercase tracking-wider underline">not yet secured</strong>.
                  </p>
                </div>

                <p className="text-brand-charcoal/70 font-medium mb-12 max-w-md mx-auto leading-relaxed">
                  We have logged your details. To permanently lock in your placement on the calendar, the <strong className="text-brand-gold font-black">R{depositAmount}</strong> deposit must be paid now.
                </p>

                {/* Payment Method Toggle */}
                <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8 relative">
                  <button 
                    onClick={() => setPaymentMethod('gateway')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'gateway' ? 'bg-white shadow-md text-brand-charcoal' : 'text-brand-charcoal/50 hover:text-brand-charcoal'}`}
                  >
                    <CreditCard size={16} /> Pay Online
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('eft')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'eft' ? 'bg-white shadow-md text-brand-charcoal' : 'text-brand-charcoal/50 hover:text-brand-charcoal'}`}
                  >
                    <Building2 size={16} /> Manual EFT
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {/* OPTION A: Secure Gateway Flow */}
                  {paymentMethod === 'gateway' && (
                    <motion.div 
                      key="gateway"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="bg-white border-2 border-brand-gold/30 p-8 rounded-3xl mb-8 shadow-lg text-left"
                    >
                      <h3 className="text-xl font-black text-brand-charcoal mb-4 flex items-center gap-3">
                        <CreditCard className="text-brand-gold" /> Instant Confirmation
                      </h3>
                      <p className="text-sm font-medium text-brand-charcoal/70 mb-8 leading-relaxed">
                        Pay securely using your credit, debit card, or instant EFT via our encrypted payment gateway. Your spot will be confirmed immediately.
                      </p>
                      <button 
                        onClick={() => {
                          window.open("https://pay.yoco.com/dng-beauty", "_blank");
                        }}
                        className="w-full py-5 bg-brand-charcoal text-white font-black tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors rounded-xl shadow-lg flex items-center justify-center gap-3"
                      >
                        Pay R{depositAmount} Securely <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  )}

                  {/* OPTION B: Manual EFT Flow - UPDATED WITH STANDARD BANK DETAILS */}
                  {paymentMethod === 'eft' && (
                    <motion.div 
                      key="eft"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-black/10 p-8 rounded-3xl mb-8 shadow-lg text-left"
                    >
                      <h3 className="text-xl font-black text-brand-charcoal mb-4 flex items-center gap-3">
                        <Building2 className="text-brand-charcoal" /> Banking Details
                      </h3>
                      <p className="text-sm font-medium text-brand-charcoal/70 mb-6 leading-relaxed">
                        Transfer the deposit using the details below. <strong className="text-brand-charcoal">Use your name as the reference.</strong>
                      </p>
                      
                      <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-black/5 mb-6">
                        <div className="flex justify-between items-center border-b border-black/5 pb-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Bank</span>
                          <span className="font-black text-brand-charcoal">Standard Bank</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-black/5 pb-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Account Name</span>
                          <span className="font-black text-brand-charcoal">GABRIELLE</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-black/5 pb-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Branch Code</span>
                          <span className="font-black text-brand-charcoal">00051001</span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                          <span className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/50">Acc No.</span>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-brand-charcoal text-lg tracking-wider">10235609216</span>
                            <button 
                              onClick={() => { navigator.clipboard.writeText("10235609216"); alert("Account Number Copied!"); }}
                              className="text-[10px] font-black uppercase tracking-widest bg-brand-charcoal/10 text-brand-charcoal px-3 py-1 rounded-full hover:bg-brand-charcoal hover:text-white transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const msg = `Hi Gabby! I have just booked ${bookingData.serviceName} for ${bookingData.date} at ${bookingData.time}. Here is my Proof of Payment for the R${depositAmount} deposit!`;
                          window.open(`https://wa.me/27787030732?text=${encodeURIComponent(msg)}`, "_blank");
                        }} 
                        className="w-full py-5 bg-[#25D366] text-white font-black tracking-widest uppercase text-xs hover:opacity-90 transition-opacity rounded-xl shadow-lg flex items-center justify-center gap-3"
                      >
                        <MessageSquare size={16} /> Send POP on WhatsApp
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Add to Calendar Button (Always visible) */}
                <button 
                  onClick={addToCalendar} 
                  className="w-full py-5 bg-transparent border border-black/10 text-brand-charcoal font-black tracking-widest uppercase text-xs hover:bg-gray-50 transition-colors rounded-xl flex items-center justify-center gap-3"
                >
                  <Calendar size={16} /> Add to Personal Calendar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Studio Info Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-40 grid md:grid-cols-2 gap-20 border-t border-black/5 pt-32"
        >
           <div>
              <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Our Rules</span>
              <h3 className="text-4xl font-black mb-8">Things to know.</h3>
              <div className="space-y-6 text-brand-charcoal/80 font-medium leading-relaxed">
                 <p className="flex items-start gap-4"><span className="text-brand-gold mt-1">•</span> Please arrive with clean eyes and entirely free of makeup.</p>
                 <p className="flex items-start gap-4"><span className="text-brand-gold mt-1">•</span> Cancellations must be made 48 hours prior to your scheduled time.</p>
                 <p className="flex items-start gap-4"><span className="text-brand-gold mt-1">•</span> Cancellations made within 1 hour of the appointment forfeit the deposit.</p>
              </div>
           </div>
           <div>
              <span className="text-xs tracking-widest uppercase font-black text-brand-gold mb-6 block">Contact Us</span>
              <h3 className="text-4xl font-black mb-8">Get in touch.</h3>
              <div className="space-y-6 text-brand-charcoal/80 font-black">
                 <a href="tel:+27787030732" className="flex items-center gap-4 hover:text-brand-gold transition-colors w-fit"><Phone size={18} className="text-brand-gold" /> +27 78 703 0732</a>
                 <a href="https://www.instagram.com/dng_beauty_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-brand-gold transition-colors w-fit"><Instagram size={18} className="text-brand-gold" /> @dng_beauty_</a>
                 <div className="flex items-center gap-4 cursor-default"><MapPin size={18} className="text-brand-gold" /> Cape Town, ZA</div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}