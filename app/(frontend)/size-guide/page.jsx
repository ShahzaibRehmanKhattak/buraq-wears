"use client";

import React, { useState } from 'react';
import { Ruler, Maximize2 } from 'lucide-react';

export default function SizeGuidePage() {
  const [unit, setUnit] = useState('in'); // 'in' for Inches, 'cm' for Centimeters

  const topSizingMatrix = {
    in: [
      { size: 'S', chest: '38 - 40', length: '27.5', shoulder: '18.5' },
      { size: 'M', chest: '41 - 43', length: '28.5', shoulder: '19.5' },
      { size: 'L', chest: '44 - 46', length: '29.5', shoulder: '20.5' },
      { size: 'XL', chest: '47 - 49', length: '30.5', shoulder: '21.5' },
    ],
    cm: [
      { size: 'S', chest: '96 - 101', length: '70', shoulder: '47' },
      { size: 'M', chest: '104 - 109', length: '72', shoulder: '49' },
      { size: 'L', chest: '111 - 116', length: '75', shoulder: '52' },
      { size: 'XL', chest: '119 - 124', length: '77', shoulder: '54' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-12 md:mb-16 border-b border-black/[0.06] pb-6 md:pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-semibold text-[32px] md:text-[44px] uppercase tracking-[-0.02em] leading-none mb-3 text-black">
              Sizing Metrics
            </h1>
            <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#777777]">
              Anatomical Fit Parameters & Silhouettes System
            </p>
          </div>
          
          {/* Unit Metric Toggle Row */}
          <div className="flex border border-black/[0.08] rounded-sm overflow-hidden p-0.5 bg-white">
            <button 
              onClick={() => setUnit('in')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${unit === 'in' ? 'bg-black text-white' : 'text-[#777777] hover:text-black'}`}
            >
              Imperial (IN)
            </button>
            <button 
              onClick={() => setUnit('cm')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${unit === 'cm' ? 'bg-black text-white' : 'text-[#777777] hover:text-black'}`}
            >
              Metric (CM)
            </button>
          </div>
        </div>

        {/* Matrix Grid Blocks */}
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Upper Cut Specs Table */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-black/[0.03] p-6 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-black mb-6 flex items-center gap-2 border-b border-black/[0.04] pb-2">
              <Ruler size={14} /> Heavyweight Uppers Cut Framework (Hoodies / Tees)
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black text-[10px] font-bold uppercase tracking-widest text-[#777777]">
                    <th className="pb-3 font-bold text-black">Variant Scale</th>
                    <th className="pb-3">Chest Circumference</th>
                    <th className="pb-3">Vertical Spine Length</th>
                    <th className="pb-3">Shoulder Sweep Edge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] text-[13px] font-medium text-black">
                  {topSizingMatrix[unit].map((row, index) => (
                    <tr key={index} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-4 font-bold tracking-wider">{row.size}</td>
                      <td className="py-4 font-mono">{row.chest} {unit}</td>
                      <td className="py-4 font-mono">{row.length} {unit}</td>
                      <td className="py-4 font-mono">{row.shoulder} {unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sizing Blueprint Instructions */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-neutral-50 border border-black/[0.03] p-6 rounded-sm">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black mb-3 flex items-center gap-1.5">
                <Maximize2 size={12} /> Fit Profile Matrix
              </h3>
              <p className="text-[12px] text-[#666666] leading-relaxed uppercase tracking-wider text-justify">
                Our silhouettes are explicitly engineered with drop-shoulder oversized structures. If your dimensional attributes track closer to edge margins and you prefer a traditional customized tailored aesthetic fit configuration, we advice stepping down one step lower in your scale allocation choice.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}