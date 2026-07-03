"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSummary({ subtotal, isDisabled, cartItems, onOrderSuccess }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [fields, setFields] = useState({
    customerName: '',
    email: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const handleInputChange = (e, key) => {
    setFields(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const sanitizedCartItems = cartItems.map(item => ({
      product_id: item.product_id || item.id,
      product_title: item.product_title || item.name || item.title || "Standard Product",
      quantity: item.quantity,
      size: item.selected_size || item.size || "M",
      price: item.products?.price || item.price || 0,
      image_url: item.products?.image_url || item.image_url || null
    }));

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          cartItems: sanitizedCartItems,
          subtotal
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Logistics order pipeline injection failed.");
      }

      if (onOrderSuccess) {
        onOrderSuccess(result.orderId);
      }

    } catch (err) {
      setErrorMessage(err.message || 'Transmission crash. Please check your data variables.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 md:p-8 border border-slate-100 rounded-sm">
      <form className="space-y-6 md:space-y-8" onSubmit={handlePlaceOrder}>
        
        {errorMessage && (
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 p-3 bg-red-50 border border-red-100 rounded-sm">
            {errorMessage}
          </div>
        )}

        {/* Section 1: Shipping Information Layout */}
        <section>
          <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2.5 text-[#1b284f]">
            <span className="w-4 h-4 bg-[#1b284f] text-white text-[9px] font-bold flex items-center justify-center rounded-sm">1</span>
            Shipping Information
          </h3>
          <div className="space-y-2">
            <input 
              className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#1b284f] focus:bg-white outline-none px-3.5 py-2.5 text-[11px] font-semibold tracking-wide placeholder:text-slate-400 transition-colors rounded-sm" 
              placeholder="FULL NAME" type="text" required value={fields.customerName} onChange={(e) => handleInputChange(e, 'customerName')}
            />
            <input 
              className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#1b284f] focus:bg-white outline-none px-3.5 py-2.5 text-[11px] font-semibold tracking-wide placeholder:text-slate-400 transition-colors rounded-sm" 
              placeholder="EMAIL ADDRESS" type="email" required value={fields.email} onChange={(e) => handleInputChange(e, 'email')}
            />
            <input 
              className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#1b284f] focus:bg-white outline-none px-3.5 py-2.5 text-[11px] font-semibold tracking-wide placeholder:text-slate-400 transition-colors rounded-sm" 
              placeholder="SHIPPING ADDRESS" type="text" required value={fields.shippingAddress} onChange={(e) => handleInputChange(e, 'shippingAddress')}
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#1b284f] focus:bg-white outline-none px-3.5 py-2.5 text-[11px] font-semibold tracking-wide placeholder:text-slate-400 transition-colors rounded-sm" 
                placeholder="CITY" type="text" required value={fields.city} onChange={(e) => handleInputChange(e, 'city')}
              />
              <input 
                className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#1b284f] focus:bg-white outline-none px-3.5 py-2.5 text-[11px] font-semibold tracking-wide placeholder:text-slate-400 transition-colors rounded-sm" 
                placeholder="POSTAL CODE" type="text" required value={fields.postalCode} onChange={(e) => handleInputChange(e, 'postalCode')}
              />
            </div>
            <input 
              className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#1b284f] focus:bg-white outline-none px-3.5 py-2.5 text-[11px] font-semibold tracking-wide placeholder:text-slate-400 transition-colors rounded-sm" 
              placeholder="CONTACT PHONE" type="tel" required value={fields.phone} onChange={(e) => handleInputChange(e, 'phone')}
            />
          </div>
        </section>

        {/* Section 2: Flat Native Selection Card */}
        <section>
          <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2.5 text-[#1b284f]">
            <span className="w-4 h-4 bg-[#1b284f] text-white text-[9px] font-bold flex items-center justify-center rounded-sm">2</span>
            Payment Method
          </h3>
          <div className="p-4 border border-[#1b284f] bg-slate-50/50 rounded-sm">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <div className="w-3.5 h-3.5 rounded-full border-[3.5px] border-[#1b284f] bg-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1b284f]">Cash on Delivery (COD)</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-0.5">Pay in cash upon arrival.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Financial Framework Invoices */}
        <section className="pt-4 border-t border-slate-100">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-[#1b284f]">
                €{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Shipping</span>
              <span className="text-[#00b4d8] font-bold">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 mt-2">
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-[#1b284f]">Total Balance</span>
              <span className="font-bold text-[20px] md:text-[24px] tracking-tight text-[#1b284f]">
                €{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button 
            className="w-full bg-[#1b284f] text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#00b4d8] transition-colors flex items-center justify-center gap-2 rounded-sm disabled:opacity-40 cursor-pointer select-none" 
            type="submit"
            disabled={isDisabled || isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-spin text-[12px]">⟳</span>
            ) : null}
            {isSubmitting ? 'Processing Dispatch...' : 'Complete Purchase'}
          </button>
        </section>

      </form>
    </div>
  );
}