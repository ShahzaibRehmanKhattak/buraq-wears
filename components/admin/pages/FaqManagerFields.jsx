"use client";
import React from 'react';
import { Plus, Trash2, HelpCircle, Tag, MessageSquare } from 'lucide-react';

export function FaqManagerFields({ items = [], onChange }) {
  const handleAddNewFaqNode = () => {
    onChange([...items, { question: '', answer: '', category: 'General' }]);
  };

  const removeFaqNode = (targetIndex) => {
    onChange(items.filter((_, idx) => idx !== targetIndex));
  };

  const updateNodeField = (idx, field, value) => {
    const freshList = [...items];
    freshList[idx] = { ...freshList[idx], [field]: value };
    onChange(freshList);
  };

  return (
    <div className="space-y-8">
      {/* Module Title Header area */}
      <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-black flex items-center gap-2">
            <HelpCircle size={14} className="text-neutral-400" /> Master FAQ Core Matrix
          </h3>
          <p className="text-[#777777] text-[11px] font-medium mt-0.5">
            Organize global customer knowledge base entries grouped by custom context lanes.
          </p>
        </div>
        <button 
          type="button" 
          onClick={handleAddNewFaqNode} 
          className="h-7 px-3 bg-black text-white rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={11}/> Append FAQ Entry
        </button>
      </div>

      {/* Empty State Fallback Area */}
      {items.length === 0 && (
        <div className="text-center py-12 text-[11px] uppercase tracking-wider text-neutral-400 font-medium bg-neutral-50/50 border border-dashed rounded-md">
          No global question records hosted. Click append to expand parameters.
        </div>
      )}

      {/* Interactive Item Cards Stack */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="p-4 bg-neutral-50/50 border border-neutral-200/70 hover:border-neutral-300/90 rounded-md relative space-y-3 transition-all"
          >
            {/* Trash Node Absolute Anchor */}
            <button 
              type="button" 
              onClick={() => removeFaqNode(idx)} 
              className="absolute top-4 right-4 text-neutral-300 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 size={14}/>
            </button>
            
            <div className="max-w-[calc(100%-24px)]">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">
                System Resolution Node #{idx + 1}
              </span>
              
              {/* Input Row Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                    <MessageSquare size={10} /> Inquiry Question
                  </label>
                  <input 
                    type="text" 
                    placeholder="E.G., HOW LONG DOES GLOBAL TRANSIT ROUTING TAKE TO CLEAR REVERSE HEADS?" 
                    value={item.question || ''} 
                    onChange={(e) => updateNodeField(idx, 'question', e.target.value)} 
                    className="w-full h-9 px-3 bg-white border border-neutral-200 hover:border-neutral-300 text-[11px] uppercase font-semibold rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                    <Tag size={10} /> Category Lane
                  </label>
                  <input 
                    type="text" 
                    placeholder="E.G., ORDER STATUS LOGISTICS" 
                    value={item.category || ''} 
                    onChange={(e) => updateNodeField(idx, 'category', e.target.value)} 
                    className="w-full h-9 px-3 bg-white border border-neutral-200 hover:border-neutral-300 text-[11px] uppercase rounded focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                  />
                </div>
              </div>

              {/* Textarea Parameter Field line */}
              <div className="mt-3">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Resolution Content Description Paragraph
                </label>
                <textarea 
                  rows={2} 
                  placeholder="Please quote your 8-digit alpha-numeric Order Identifier string when filing support inquiries..." 
                  value={item.answer || ''} 
                  onChange={(e) => updateNodeField(idx, 'answer', e.target.value)} 
                  className="w-full p-3 bg-white border border-neutral-200 hover:border-neutral-300 text-[11px] rounded resize-none focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}