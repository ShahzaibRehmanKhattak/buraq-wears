"use client";
import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
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
        text: 'Thank you. Your message has been received successfully. A customer support representative will review your inquiry and respond via email within 12 to 24 business hours.'
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
        text: 'We are unable to send your message at this time. Please check your internet connection or reach out to us directly through our support channels.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-[13px]">
      
      {/* Alert Messages (Clean and integrated) */}
      {feedback.text && (
        <div className={`mb-5 text-[12px] font-medium p-4 rounded-xl border transition-all ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1.5 text-neutral-700 font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="Enter your full name"
            className="w-full py-2 px-4 rounded-full border border-neutral-200 bg-[#f8faff] outline-none placeholder:text-neutral-300 focus:border-neutral-300 transition-all text-neutral-800"
          />
        </div>
        <div>
          <label className="block mb-1.5 text-neutral-700 font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
            placeholder="name@domain.com"
            className="w-full py-2 px-4 rounded-full border border-neutral-200 bg-[#f8faff] outline-none placeholder:text-neutral-300 focus:border-neutral-300 transition-all text-neutral-800"
          />
        </div>
      </div>

      {/* Row 2: Order Number & Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1.5 text-neutral-700 font-medium">
            Order ID <span className="text-neutral-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.orderNumber}
            onChange={(e) => setFormData(p => ({ ...p, orderNumber: e.target.value }))}
            placeholder="#BQ-89721"
            className="w-full py-2 px-4 rounded-full border border-neutral-200 bg-[#f8faff] outline-none placeholder:text-neutral-300 focus:border-neutral-300 transition-all text-neutral-800 uppercase"
          />
        </div>
        <div>
          <label className="block mb-1.5 text-neutral-700 font-medium">
            Subject <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.subject}
            onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
            className="w-full py-2 px-4 rounded-full border border-neutral-200 bg-[#f8faff] outline-none focus:border-neutral-300 transition-all text-neutral-800 cursor-pointer appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23737373\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '14px' }}
          >
            <option value="General Support">General Inquiry</option>
            <option value="Order Operations">Order & Shipping Logistics</option>
            <option value="Refund Matrix">Returns & Size Exchanges</option>
            <option value="B2B Wholesale">Wholesale & Custom Orders</option>
          </select>
        </div>
      </div>

      {/* Row 3: Message */}
      <div className="mb-5">
        <label className="block mb-1.5 text-neutral-700 font-medium">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
          placeholder="How can we help you?"
          className="w-full p-4 rounded-xl border border-neutral-200 bg-[#f8faff] outline-none placeholder:text-neutral-300 focus:border-neutral-300 transition-all text-neutral-800 resize-none"
        />
      </div>

      {/* Professional Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 bg-[#3C50E0] text-white py-2.5 px-6 rounded-full font-medium shadow-sm hover:bg-[#2a3cb3] transition-all cursor-pointer min-w-[165px] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin text-[14px]">⟳</span>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send size={14} />
            <span>Send Message</span>
          </>
        )}
      </button>

    </form>
  );
}