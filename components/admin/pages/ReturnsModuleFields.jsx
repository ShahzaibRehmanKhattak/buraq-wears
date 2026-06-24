"use client";
import React from 'react';
import { Plus, Trash2, ArrowRight, HelpCircle } from 'lucide-react';

export function ReturnsModuleFields({ directives = [], faqs = [], onUpdate }) {
  // Directives manipulation logic
  const addDirectiveInputRow = () => onUpdate('returns_directives', [...directives, '']);
  const removeDirectiveInputRow = (targetIdx) => onUpdate('returns_directives', directives.filter((_, idx) => idx !== targetIdx));
  const changeDirectiveText = (idx, value) => {
    const copy = [...directives];
    copy[idx] = value;
    onUpdate('returns_directives', copy);
  };

  // FAQ logic
  const appendFaqRowBlock = () => onUpdate('returns_faqs', [...faqs, { q: '', a: '' }]);
  const removeFaqRowBlock = (targetIdx) => onUpdate('returns_faqs', faqs.filter((_, idx) => idx !== targetIdx));
  const changeFaqField = (idx, field, value) => {
    const copy = [...faqs];
    // Create a shallow copy of the object at this index to prevent mutating state directly
    copy[idx] = { ...copy[idx], [field]: value };
    onUpdate('returns_faqs', copy);
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Dynamic Directives */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-neutral-100 pb-3">
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <ArrowRight size={13} className="text-neutral-400" /> Logistics Directives & Guidelines
            </h4>
            <p className="text-[#777777] text-[11px] font-medium mt-0.5">
              Step-by-step instructions shown to customers regarding return terms.
            </p>
          </div>
          <button 
            type="button" 
            onClick={addDirectiveInputRow} 
            className="h-7 px-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1 hover:bg-neutral-800 transition-colors"
          >
            <Plus size={11}/> Add Step
          </button>
        </div>

        {directives.length === 0 ? (
          <div className="text-center py-8 text-[11px] uppercase tracking-wider text-neutral-400 font-medium bg-neutral-50/50 border border-dashed rounded-md">
            No logistics guidelines added yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {directives.map((dir, idx) => (
              <div key={idx} className="flex gap-3 items-center group">
                <span className="font-mono text-[11px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-200/60 h-10 w-8 rounded flex items-center justify-center flex-shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <input 
                  type="text" 
                  placeholder="E.G., ITEMS MUST BE DISPATCHED BACK WITHIN 7 OPERATIONAL DAYS OF INITIAL DELIVERY SIGNATURE WINDOW." 
                  value={dir} 
                  onChange={(e) => changeDirectiveText(idx, e.target.value)} 
                  className="flex-1 h-10 px-3 bg-white border border-neutral-200 text-[11px] uppercase rounded focus:border-black transition-colors" 
                />
                <button 
                  type="button" 
                  onClick={() => removeDirectiveInputRow(idx)} 
                  className="text-neutral-300 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Dynamic Accordions */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-neutral-100 pb-3">
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <HelpCircle size={13} className="text-neutral-400" /> Reverse Logistics FAQ Accordions
            </h4>
            <p className="text-[#777777] text-[11px] font-medium mt-0.5">
              Dedicated return management questions and structured answers.
            </p>
          </div>
          <button 
            type="button" 
            onClick={appendFaqRowBlock} 
            className="h-7 px-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1 hover:bg-neutral-800 transition-colors"
          >
            <Plus size={11}/> Add FAQ Node
          </button>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-8 text-[11px] uppercase tracking-wider text-neutral-400 font-medium bg-neutral-50/50 border border-dashed rounded-md">
            No reverse logistics FAQs configured.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="p-4 bg-neutral-50/50 border border-neutral-200/70 hover:border-neutral-300/90 rounded-md relative space-y-3 transition-all">
                <button 
                  type="button" 
                  onClick={() => removeFaqRowBlock(idx)} 
                  className="absolute top-4 right-4 text-neutral-300 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14}/>
                </button>
                
                <div className="max-w-[calc(100%-24px)]">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                    FAQ Block Entry #{idx + 1}
                  </span>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="INQUIRY QUESTION TERMINAL LINE PAYLOAD (E.G., WHO BEARS OVERHEAD SHIPPING COSTS?)" 
                      value={item.q || ''} 
                      onChange={(e) => changeFaqField(idx, 'q', e.target.value)} 
                      className="w-full h-9 px-3 bg-white border border-neutral-200 text-[11px] font-bold uppercase rounded focus:border-black transition-colors" 
                    />
                    <textarea 
                      rows={2} 
                      placeholder="REMEDIAL ENUMERATION ANSWER CONTENT PARAMS SPECIFICATION TEXT..." 
                      value={item.a || ''} 
                      onChange={(e) => changeFaqField(idx, 'a', e.target.value)} 
                      className="w-full p-3 bg-white border border-neutral-200 text-[11px] rounded resize-none focus:border-black transition-colors" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}