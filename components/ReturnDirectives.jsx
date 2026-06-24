"use client";
import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function ReturnDirectives({ directives }) {
  // Rigid array type guard prevents string/object structure pollution
  const activeDirectives = Array.isArray(directives) && directives.length > 0 
    ? directives 
    : [
        "Items must be dispatched back to our terminal within 7 operational days of initial delivery signature receipt. Articles must retain raw security hangtags untampered.",
        "Reverse shipment tracking liabilities remain with the client until delivery verification clearance registers at our I-9 Industrial Hub."
      ];

  return (
    <div>
      <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-black mb-4 flex items-center gap-2">
        <ShieldAlert size={15} /> Return Directives
      </h2>
      <div className="flex flex-col gap-4 text-[12px] text-[#666666] leading-relaxed tracking-wide uppercase">
        {activeDirectives.map((text, idx) => (
          <p 
            key={idx} 
            className="p-4 bg-white border border-neutral-200/60 rounded-md text-justify shadow-sm select-text"
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}