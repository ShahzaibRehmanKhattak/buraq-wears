"use client";

import React, { useState } from 'react';
import { RefreshCw, ShieldAlert, CheckCircle, ChevronDown, ChevronUp, HelpCircle, AlertTriangle } from 'lucide-react';

export default function ReturnsPage() {
  const [formData, setFormData] = useState({ orderRef: '', email: '', reason: 'Size Scale Adjustment Exchange', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  
  // State to manage the help accordion dropdowns
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleReturnRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to process logistics parameters.");
      }

      setFeedback({
        type: 'success',
        text: 'Our fulfillment hub has verified your order records and queued your reverse matrix entry. Check your email terminal for further dispatch parameters.'
      });
      
      // Clear all text input spaces cleanly on success
      setFormData({ orderRef: '', email: '', reason: 'Size Scale Adjustment Exchange', description: '' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Unable to initiate reverse pipeline. Please check your network parameters or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqMatrix = [
    {
      q: "Do I need an account or login to file a return?",
      a: "No authentication is required. You only need to input the exact Order Identifier String (e.g., BQ-89721) and the specific Email Terminal utilized during checkout authorization for automatic security verification."
    },
    {
      q: "Who bears the logistical reverse shipping overhead costs?",
      a: "For standard size exchanges, reverse transport tracking routes are managed and covered by the client. If our quality assurance matrix flagged a manufacturing structural defect, BuraqWears will issue a prepaid shipping token automatically."
    },
    {
      q: "How many days do I have to clear a reverse authorization?",
      a: "Your transmission payload must be authorized and timestamped within 7 operational days from the official delivery date window registered by our courier network."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-12 md:mb-16 border-b border-black/[0.06] pb-6 md:pb-8">
          <h1 className="font-semibold text-[32px] md:text-[44px] uppercase tracking-[-0.02em] leading-none mb-3 text-black">
            Returns & Reverse Matrix
          </h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#777777]">
            Automated Reverse Logistics Protocol & Exchanges
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* ================= LEFT COLUMN: RULES & FAQS ================= */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <div>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-black mb-4 flex items-center gap-2">
                <ShieldAlert size={15} /> Return Directives
              </h2>
              <div className="flex flex-col gap-4 text-[12px] text-[#666666] leading-relaxed tracking-wide uppercase">
                <p className="p-4 bg-white border border-black/[0.04] rounded-sm text-justify shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
                  Items must be dispatched back to our terminal within <strong>7 operational days</strong> of initial delivery signature receipt. Articles must retain raw security hangtags untampered.
                </p>
                <p className="p-4 bg-white border border-black/[0.04] rounded-sm text-justify shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
                  Reverse shipment tracking liabilities remain with the client until delivery verification clearance registers at our I-9 Industrial Hub.
                </p>
              </div>
            </div>

            {/* Anti-Confusion FAQ Matrix Segment */}
            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-black mb-4 flex items-center gap-2">
                <HelpCircle size={15} /> Clarity & Operational FAQs
              </h2>
              <div className="border border-black/[0.06] rounded-sm bg-white divide-y divide-black/[0.06]">
                {faqMatrix.map((faq, idx) => (
                  <div key={idx} className="p-4">
                    <button 
                      type="button"
                      onClick={() => toggleFAQ(idx)}
                      className="w-full flex justify-between items-center text-left text-[11px] font-bold uppercase tracking-wider text-black focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      {openFAQ === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openFAQ === idx && (
                      <p className="mt-3 text-[11px] text-[#666666] leading-relaxed tracking-wide uppercase text-justify border-t border-dashed border-black/[0.06] pt-3">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE FORM ================= */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-black/[0.03] p-6 md:p-10 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-6 pb-2 border-b border-black/[0.04] flex items-center gap-2">
              <RefreshCw size={14} /> Initiate Reverse Request
            </h2>

            {/* Response Status Notification Space */}
            {feedback.text && (
              <div className={`mb-6 text-[11px] uppercase tracking-wider font-semibold p-4 rounded-sm border flex items-start gap-2.5 transition-all ${
                feedback.type === 'success' 
                  ? 'bg-neutral-50 text-emerald-800 border-emerald-200' 
                  : 'bg-neutral-50 text-red-700 border-red-200'
              }`}>
                {feedback.type === 'success' ? (
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Form rendering switches off only on full successful log verification */}
            {feedback.type !== 'success' && (
              <form onSubmit={handleReturnRequest} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Order Number *</label>
                    <input 
                      type="text" required value={formData.orderRef}
                      onChange={(e) => setFormData(p => ({ ...p, orderRef: e.target.value }))}
                      placeholder="e.g., BQ-89721"
                      className="w-full h-11 px-4 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black uppercase transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Account Link Terminal *</label>
                    <input 
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="name@domain.com"
                      className="w-full h-11 px-4 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Logistics Action Protocol *</label>
                  <select 
                    value={formData.reason}
                    onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
                    className="w-full h-11 px-3 bg-white border border-black/[0.1] text-[11px] text-black uppercase tracking-wider rounded-sm focus:border-black transition-colors"
                  >
                    <option value="Size Scale Adjustment Exchange">Size Scale Adjustment Exchange</option>
                    <option value="Defective Manufacturing Matrix Variant">Defective Manufacturing Matrix Variant</option>
                    <option value="Incorrect Sorting Lane Shipped Variant">Incorrect Sorting Lane Shipped Variant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-[#777777] mb-2">Elaborate Condition Analytics *</label>
                  <textarea 
                    required rows={4} value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Provide systematic context regarding sizing variants or fabric structural state variables..."
                    className="w-full px-4 pt-3 bg-white border border-black/[0.1] text-[12px] text-black tracking-wide rounded-sm focus:border-black transition-colors resize-none font-sans"
                  />
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full h-12 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-900 transition-colors disabled:bg-neutral-300 rounded-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-[12px]">⟳</span>
                      <span>Verifying Parameters...</span>
                    </span>
                  ) : (
                    <span>Authorize Return Pipeline</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}