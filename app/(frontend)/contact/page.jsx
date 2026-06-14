"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  // FIXED: Set default string variable to exactly match the formal initial value option
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: 'General Support', 
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      // Formal, premium response notice text
      setFeedback({
        type: 'success',
        text: 'Thank you. Your message has been received securely. A dedicated support representative will review your inquiry and respond via email within 12 to 24 business hours.'
      });
      
      // FIXED: Clears state variables back to the correct options cleanly
      setFormData({ 
        name: '', 
        email: '', 
        orderNumber: '', 
        subject: 'General Support', 
        message: '' 
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: 'We are unable to transmit your message at this time. Please verify your connection variables or reach out directly via concierge@buraqwears.com.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        
        {/* ================= PAGE HEADER ================= */}
        <div className="mb-12 md:mb-20 border-b border-black/[0.06] pb-6 md:pb-8">
          <h1 className="font-semibold text-[32px] md:text-[44px] uppercase tracking-[-0.02em] leading-none mb-3 text-black">
            Contact Concierge
          </h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#777777]">
            Client Support & Database Uplink Matrix
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* ================= LEFT COLUMN: INFO MATRIX ================= */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8 md:gap-10">
            <div>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-black mb-4">
                BuraqWears HQ
              </h2>
              <p className="text-[12px] text-[#666666] leading-relaxed uppercase tracking-wider max-w-sm">
                Premium textile curation, tailored fit pipelines, and modern streetwear delivery operations worldwide.
              </p>
            </div>

            {/* Core Info Blocks */}
            <div className="flex flex-col gap-6 border-y border-black/[0.05] py-8">
              <div className="flex gap-4 items-start">
                <MapPin size={16} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-1">Logistics & Hub Location</h3>
                  <p className="text-[12px] font-medium text-black tracking-wide">Plot 42-C, Sector I-9 Industrial Area, Islamabad, Pakistan</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Mail size={16} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-1">Digital Client Uplink</h3>
                  <p className="text-[12px] font-medium text-black tracking-wide hover:underline cursor-pointer">shahzaibkhattak0319@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Phone size={16} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-1">Direct Priority Line</h3>
                  <p className="text-[12px] font-medium text-black tracking-wide">+92 (51) 111-BURAQ</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Clock size={16} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-1">Operational Windows</h3>
                  <p className="text-[12px] font-medium text-black tracking-wide">Monday – Saturday | 10:00 AM – 06:00 PM (PKT)</p>
                </div>
              </div>
            </div>

            {/* Brand Note Footer */}
            <div className="p-5 bg-neutral-50 rounded-sm border border-black/[0.02]">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Order Dispatches Notice</h4>
              <p className="text-[11px] text-[#777777] leading-relaxed uppercase tracking-wide text-justify">
                Please quote your 8-digit alpha-numeric Order Identifier string when filing support inquiries regarding standard customs clearing or global transit tracking delays.
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-black/[0.03] p-6 md:p-10 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-6 pb-2 border-b border-black/[0.04] flex items-center gap-2">
              <MessageSquare size={14} /> Send Message Matrix
            </h2>

            {feedback.text && (
              <div className={`mb-6 text-[11px] uppercase tracking-wider font-semibold p-4 rounded-sm border transition-all ${
                feedback.type === 'success' 
                  ? 'bg-neutral-50 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Your Identity Signature *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-11 px-4 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Email Destination Terminal *</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="name@domain.com"
                    required
                    className="w-full h-11 px-4 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Order Reference Identification (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.orderNumber}
                    onChange={(e) => setFormData(p => ({ ...p, orderNumber: e.target.value }))}
                    placeholder="#BQ-89721"
                    className="w-full h-11 px-4 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Inquiry Context Subject *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                    className="w-full h-11 px-3 bg-white border border-black/[0.1] text-[11px] text-black uppercase tracking-wider rounded-sm focus:border-black transition-colors"
                  >
                    {/* FIXED: Form values align completely with backend display strings */}
                    <option value="General Support">General Client Inquiry</option>
                    <option value="Order Operations">Order Dispatch & Logistics</option>
                    <option value="Refund Matrix">Refunds & Size Exchanges</option>
                    <option value="B2B Wholesale">B2B Custom Corporate Orders</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Transmission Message Body *</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Detail your request configuration variables explicitly..."
                  rows={6}
                  required
                  className="w-full px-4 pt-3 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors resize-none font-sans"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-900 transition-colors disabled:bg-neutral-300 rounded-sm mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-[12px]">⟳</span>
                    <span>Uplinking Transmission Row...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Transmit Message Grid</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}