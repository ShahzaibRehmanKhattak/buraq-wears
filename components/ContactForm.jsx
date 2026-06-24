"use client";
import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export function ContactForm() {
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

      setFeedback({
        type: 'success',
        text: 'Thank you. Your message has been received securely. A dedicated support representative will review your inquiry and respond via email within 12 to 24 business hours.'
      });
      
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
        text: 'We are unable to transmit your message at this time. Please verify your connection variables or reach out directly via support channels.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200/60 p-6 md:p-10 rounded-md shadow-sm">
      <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-6 pb-3 border-b border-neutral-100 flex items-center gap-2">
        <MessageSquare size={13} className="text-neutral-400" /> Send Message Matrix
      </h2>

      {feedback.text && (
        <div className={`mb-6 text-[11px] uppercase tracking-wider font-semibold p-4 rounded border transition-all ${
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
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Your Identity Signature *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="Enter your full name"
              required
              className="w-full h-10 px-4 bg-white border border-neutral-200 text-[11px] text-black tracking-wide rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Email Destination Terminal *</label>
            <input 
              type="type" 
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="name@domain.com"
              required
              className="w-full h-10 px-4 bg-white border border-neutral-200 text-[11px] text-black tracking-wide rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Order Reference Identification (Optional)</label>
            <input 
              type="text" 
              value={formData.orderNumber}
              onChange={(e) => setFormData(p => ({ ...p, orderNumber: e.target.value }))}
              placeholder="#BQ-89721"
              className="w-full h-10 px-4 bg-white border border-neutral-200 text-[11px] text-black tracking-wide rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all uppercase"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Inquiry Context Subject *</label>
            <select 
              value={formData.subject}
              onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
              className="w-full h-10 px-3 bg-white border border-neutral-200 text-[11px] text-black uppercase tracking-wider rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
            >
              <option value="General Support">General Client Inquiry</option>
              <option value="Order Operations">Order Dispatch & Logistics</option>
              <option value="Refund Matrix">Refunds & Size Exchanges</option>
              <option value="B2B Wholesale">B2B Custom Corporate Orders</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Transmission Message Body *</label>
          <textarea 
            value={formData.message}
            onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
            placeholder="Detail your request configuration variables explicitly..."
            rows={6}
            required
            className="w-full px-4 pt-3 bg-white border border-neutral-200 text-[11px] text-black tracking-wide rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none font-sans"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-11 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 rounded mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin text-[12px]">⟳</span>
              <span>Uplinking Transmission Row...</span>
            </>
          ) : (
            <>
              <Send size={11} />
              <span>Transmit Message Grid</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}