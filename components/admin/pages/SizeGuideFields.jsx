"use client";
import React from 'react';
import { Ruler, Info, Layers } from 'lucide-react';

export function SizeGuideFields({ imperial = [], metric = [], profileText = '', onUpdate }) {
  const updateCellIndexValue = (scaleKey, idx, field, val) => {
    const target = scaleKey === 'in' ? [...imperial] : [...metric];
    if (!target[idx]) target[idx] = { size: '', chest: '', length: '', shoulder: '' };
    target[idx][field] = val;
    // Explicitly enforce sizing tags on change to keep dataset arrays pure
    if (!target[idx].size) {
      const tags = ['S', 'M', 'L', 'XL'];
      target[idx].size = tags[idx];
    }
    onUpdate(scaleKey === 'in' ? 'sizing_matrix_imperial' : 'sizing_matrix_metric', target);
  };

  const renderScaleDataSheet = (scaleLabel, arrayKey, dataList) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-black">{scaleLabel}</span>
      </div>
      
      {/* Table Headers */}
      <div className="grid grid-cols-4 gap-3 px-3 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
        <div>Size Variant</div>
        <div>Chest Range</div>
        <div>Vertical Length</div>
        <div>Shoulder Sweep</div>
      </div>

      {/* Table Data Matrix rows */}
      <div className="space-y-2">
        {['S', 'M', 'L', 'XL'].map((sizeTag, idx) => {
          const row = dataList[idx] || { size: sizeTag, chest: '', length: '', shoulder: '' };
          return (
            <div key={sizeTag} className="grid grid-cols-4 gap-3 items-center bg-neutral-50/50 border border-neutral-200/60 p-2 rounded-md transition-all">
              <span className="text-[11px] font-mono font-bold text-black bg-white border border-neutral-200/60 h-9 rounded flex items-center justify-center shadow-sm">
                {sizeTag}
              </span>
              <input 
                type="text" 
                placeholder="E.G., 38 - 40" 
                value={row.chest || ''} 
                onChange={(e) => updateCellIndexValue(arrayKey, idx, 'chest', e.target.value)} 
                className="h-9 px-3 bg-white border border-neutral-200 text-[11px] uppercase rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all" 
              />
              <input 
                type="text" 
                placeholder="E.G., 28.5" 
                value={row.length || ''} 
                onChange={(e) => updateCellIndexValue(arrayKey, idx, 'length', e.target.value)} 
                className="h-9 px-3 bg-white border border-neutral-200 text-[11px] uppercase rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all" 
              />
              <input 
                type="text" 
                placeholder="E.G., 20.0" 
                value={row.shoulder || ''} 
                onChange={(e) => updateCellIndexValue(arrayKey, idx, 'shoulder', e.target.value)} 
                className="h-9 px-3 bg-white border border-neutral-200 text-[11px] uppercase rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all" 
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Module Title Header area */}
      <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-black flex items-center gap-2">
            <Ruler size={14} className="text-neutral-400" /> Anatomical Specification Matrix
          </h3>
          <p className="text-[#777777] text-[11px] font-medium mt-0.5">
            Configure cross-border sizing tables for storefront product sheets.
          </p>
        </div>
      </div>

      {/* Grid splits Imperial and Metric systems for clear horizontal scannability */}
      <div className="space-y-8">
        {renderScaleDataSheet("Imperial System Parameters (Inches)", 'in', imperial)}
        {renderScaleDataSheet("Metric Architecture Units (Centimeters)", 'cm', metric)}
      </div>

      {/* Bottom Textarea block */}
      <div className="pt-4 border-t border-neutral-100">
        <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
          <Layers size={11} /> Silhouette Fit Advice Notice
        </label>
        <textarea 
          rows={3} 
          placeholder="Our silhouettes are explicitly engineered with drop-shoulder oversized structures..." 
          value={profileText} 
          onChange={(e) => onUpdate('sizing_fit_profile_text', e.target.value)} 
          className="w-full p-3 bg-white border border-neutral-200 text-[11px] rounded resize-none focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all" 
        />
      </div>
    </div>
  );
}