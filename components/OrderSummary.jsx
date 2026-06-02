"use client";
import React from 'react';

export default function OrderSummary({ subtotal, isDisabled }) {
  return (
    <div className="bg-white p-5 md:p-10 border border-black/[0.05] rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.01)]">
      <form className="space-y-8 md:space-y-10" onSubmit={(e) => e.preventDefault()}>
        
        {/* Shipping Information Header Node */}
        <section>
          <h3 className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2.5 text-black">
            <span className="w-4 h-4 md:w-[18px] md:h-[18px] bg-black text-white text-[8px] md:text-[9px] font-bold flex items-center justify-center rounded-sm">1</span>
            Shipping Information
          </h3>
          <div className="space-y-3">
            <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Full Name" type="text" required />
            <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Shipping Address" type="text" required />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="City" type="text" required />
              <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Postal Code" type="text" required />
            </div>
            <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Phone Number" type="tel" required />
          </div>
        </section>

        {/* Payment Type Selection Block */}
        <section>
          <h3 className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2.5 text-black">
            <span className="w-4 h-4 md:w-[18px] md:h-[18px] bg-black text-white text-[8px] md:text-[9px] font-bold flex items-center justify-center rounded-sm">2</span>
            Payment Method
          </h3>
          <div className="p-4 border border-black bg-[#fafafa] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <div className="w-3.5 h-3.5 rounded-full border-[3.5px] border-black bg-white"></div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-0.5 text-black">Cash on Delivery (COD)</p>
                <p className="text-[10px] font-medium text-[#777777] uppercase tracking-widest leading-relaxed">Pay in cash upon arrival.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Financial Totals and Form Control Submission */}
        <section className="pt-5 border-t border-black/[0.06]">
          <div className="space-y-2.5 mb-5">
            <div className="flex justify-between text-[10px] md:text-[11px] font-medium text-[#777777] uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-black font-semibold">
                €{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[10px] md:text-[11px] font-medium text-[#777777] uppercase tracking-widest">
              <span>Shipping</span>
              <span className="text-black font-medium italic text-[#222222] normal-case">Complimentary</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-black/[0.04] mt-2">
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black">Total</span>
              <span className="font-bold text-[22px] md:text-[26px] tracking-[-0.03em] text-black">
                €{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button 
            className="w-full bg-black text-white py-3.5 md:py-4 text-[11px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-40 disabled:hover:bg-black" 
            type="submit"
            disabled={isDisabled}
          >
            <span className="material-symbols-outlined text-[16px] md:text-[18px]">lock</span> Place Order
          </button>
        </section>

      </form>
    </div>
  );
}