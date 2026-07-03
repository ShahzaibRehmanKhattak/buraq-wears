"use client";
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ReturnFAQs({ faqs }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  // Strict structural type assertion check
  const activeFaqs = Array.isArray(faqs) && faqs.length > 0 
    ? faqs 
    : [
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
    <div>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-black mb-4 flex items-center gap-2">
        <HelpCircle size={15} className="text-neutral-400" /> Clarity & Operational FAQs
      </h2>
      <div className="border border-neutral-200/60 rounded-md bg-white divide-y divide-neutral-100 shadow-sm">
        {activeFaqs.map((faq, idx) => {
          const isOpen = openFAQ === idx;
          return (
            <div key={idx} className="p-4">
              <button 
                type="button"
                onClick={() => setOpenFAQ(isOpen ? null : idx)}
                className="w-full flex justify-between items-center text-left text-[11px] font-bold uppercase tracking-wider text-black focus:outline-none"
              >
                <span className="pr-4">{faq.q || faq.question}</span>
                {isOpen ? <ChevronUp size={14} className="text-neutral-400" /> : <ChevronDown size={14} className="text-neutral-400" />}
              </button>
              {isOpen && (
                <p className="mt-3 text-[11px] text-[#666666] leading-relaxed tracking-wide uppercase text-justify border-t border-dashed border-neutral-100 pt-3 selection:bg-neutral-100">
                  {faq.a || faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}