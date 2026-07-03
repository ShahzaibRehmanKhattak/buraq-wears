"use client";
import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReturnForm() {
  const [formData, setFormData] = useState({ orderRef: '', email: '', reason: 'Size Scale Adjustment Exchange', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

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
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to process logistics parameters.");

      setFeedback({
        type: 'success',
        text: 'Our fulfillment hub has verified your order records and queued your reverse matrix entry. Check your email terminal for further dispatch parameters.'
      });
      setFormData({ orderRef: '', email: '', reason: 'Size Scale Adjustment Exchange', description: '' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Unable to initiate reverse pipeline.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200/60 p-6 md:p-10 rounded-md shadow-sm">
      <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-6 pb-3 border-b border-neutral-100 flex items-center gap-2">
        <RefreshCw size={13} className="text-neutral-400" /> Initiate Reverse Request
      </h2>

      {feedback.text && (
        <div className={`mb-6 text-[11px] uppercase tracking-wider font-semibold p-4 rounded border flex items-start gap-2.5 transition-all ${
          feedback.type === 'success' ? 'bg-neutral-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle size={15} className="shrink-0 mt-0.5" /> : <AlertTriangle size={15} className="shrink-0 mt-0.5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {feedback.type !== 'success' && (
        <form onSubmit={handleReturnRequest} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Order Number *</label>
              <input 
                type="text" required value={formData.orderRef}
                onChange={(e) => setFormData(p => ({ ...p, orderRef: e.target.value }))}
                placeholder="E.G., BQ-89721"
                className="w-full h-10 px-4 bg-white border border-neutral-200 text-[11px] text-black tracking-wide rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black uppercase transition-all"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Account Link Terminal *</label>
              <input 
                type="email" required value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="name@domain.com"
                className="w-full h-10 px-4 bg-white border border-neutral-200 text-[11px] text-black tracking-wide rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Logistics Action Protocol *</label>
            <select 
              value={formData.reason}
              onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))}
              className="w-full h-10 px-3 bg-white border border-neutral-200 text-[11px] text-black uppercase tracking-wider rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
            >
              <option value="Size Scale Adjustment Exchange">Size Scale Adjustment Exchange</option>
              <option value="Defective Manufacturing Matrix Variant">Defective Manufacturing Matrix Variant</option>
              <option value="Incorrect Sorting Lane Shipped Variant">Incorrect Sorting Lane Shipped Variant</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Elaborate Condition Analytics *</label>
            <textarea 
              required rows={4} value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Provide systematic context regarding sizing variants or fabric structural state variables..."
              className="w-full px-4 pt-3 bg-white border border-neutral-200 text-[11px] text-black tracking-wide rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none font-sans"
            />
          </div>

          <button 
            type="submit" disabled={isSubmitting}
            className="w-full h-11 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 rounded mt-2"
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
  );
}