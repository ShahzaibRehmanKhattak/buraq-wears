"use client";
import React, { useRef } from 'react';
import { Plus, Trash2, LayoutGrid, Edit2, Link } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

export function StandardHeroFields({ matrixItems = [], onChange }) {
  const blockRefs = useRef([]);

  // Appends a brand new configuration block for a specific sub-page
  const handleAddNewPageBlock = () => {
    onChange([
      ...matrixItems,
      { target_slug: '', title: '', description: '', img: '', btn_text: '', btn_url: '' }
    ]);
    
    // Quick timeout to smoothly scroll down to the newly appended block
    setTimeout(() => {
      const lastIndex = matrixItems.length;
      if (blockRefs.current[lastIndex]) {
        blockRefs.current[lastIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleRemovePageBlock = (targetIdx) => {
    onChange(matrixItems.filter((_, idx) => idx !== targetIdx));
  };

  const handleUpdateBlockProp = (idx, field, value) => {
    const updated = [...matrixItems];
    updated[idx][field] = value;
    onChange(updated);
  };

  const scrollToBlock = (idx) => {
    if (blockRefs.current[idx]) {
      blockRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Title Header area */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-black flex items-center gap-2">
            <LayoutGrid size={15}/> Sub-Pages Hero Curation Matrix
          </h3>
          <p className="text-[#777777] text-[11px] font-medium mt-0.5">
            Create completely custom header sections for individual sub-pages.
          </p>
        </div>
        <button 
          type="button" 
          onClick={handleAddNewPageBlock} 
          className="h-8 px-4 bg-black text-white rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={12}/> Append Page Header Node
        </button>
      </div>

      {/* Scannable Overview Summary Table Matrix */}
      {matrixItems.length > 0 && (
        <div className="border border-neutral-200 rounded overflow-hidden">
          <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Active Routes Register Overview
          </div>
          <div className="divide-y divide-neutral-100 max-h-[220px] overflow-y-auto no-scrollbar">
            {matrixItems.map((item, idx) => (
              <div key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-neutral-50/80 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-7 w-12 bg-neutral-100 rounded border border-neutral-200/60 overflow-hidden flex-shrink-0">
                    {item.img ? (
                      <img src={item.img} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-neutral-300">NO IMG</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-black bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200/40">
                        /{item.target_slug || 'undefined-route'}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5 truncate max-w-[280px]">
                      {item.title || '(Untitled Banner Node)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToBlock(idx)}
                    className="h-7 px-3 border border-neutral-200 hover:border-black text-black text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 transition-colors bg-white"
                  >
                    <Edit2 size={11} /> Edit Node
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePageBlock(idx)}
                    className="h-7 w-7 border border-neutral-100 hover:border-red-200 text-neutral-400 hover:text-red-600 rounded flex items-center justify-center transition-colors bg-white"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State State Fallback Block */}
      {matrixItems.length === 0 && (
        <div className="text-center py-12 text-[11px] uppercase tracking-wider text-neutral-400 font-medium bg-neutral-50 border border-dashed rounded">
          No secondary page configurations built. Click append to configure headers for contact, orders, etc.
        </div>
      )}

      {/* Interactive Form Blocks Section */}
      <div className="space-y-8">
        {matrixItems.map((item, idx) => (
          <div 
            key={idx} 
            ref={el => blockRefs.current[idx] = el}
            className="p-5 bg-white border border-neutral-200 hover:border-neutral-300 transition-all rounded-md relative space-y-4 shadow-sm"
          >
            {/* Remove Action Anchor */}
            <button 
              type="button" 
              onClick={() => handleRemovePageBlock(idx)} 
              className="absolute top-5 right-5 text-neutral-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16}/>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200/40">
                Page Header Node Setup Block #{idx + 1}
              </span>
            </div>

            {/* Target Page Routing Assignment Line */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black mb-1.5 flex items-center gap-1">
                <Link size={11}/> Target Page Identifier String (Slug Mapping Route)
              </label>
              <input 
                type="text" 
                placeholder="E.G., contact, orders, accessories, size-guide, or about" 
                value={item.target_slug || ''} 
                onChange={(e) => handleUpdateBlockProp(idx, 'target_slug', e.target.value.toLowerCase().trim())} 
                className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] font-mono lowercase rounded focus:border-black transition-colors" 
              />
            </div>

            {/* Display Text Fields Grid layout line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Display Header Name / Title</label>
                <input 
                  type="text" 
                  placeholder="E.G., CONTACT TERMINAL OPERATIONS" 
                  value={item.title || ''} 
                  onChange={(e) => handleUpdateBlockProp(idx, 'title', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] uppercase rounded focus:border-black transition-colors" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Button Call-to-Action Text (Optional)</label>
                <input 
                  type="text" 
                  placeholder="E.G., DISPATCH EMAIL" 
                  value={item.btn_text || ''} 
                  onChange={(e) => handleUpdateBlockProp(idx, 'btn_text', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] uppercase rounded focus:border-black transition-colors" 
                />
              </div>
            </div>

            {/* Narrative Context Lines & Routing Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Header Short Description Context</label>
                <textarea 
                  rows={2}
                  placeholder="E.G., GLOBAL TRANSIT OPERATIONS HELD LIVE SECURELY..." 
                  value={item.description || ''} 
                  onChange={(e) => handleUpdateBlockProp(idx, 'description', e.target.value)} 
                  className="w-full p-3 bg-white border border-neutral-200 text-[11px] uppercase rounded focus:border-black resize-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Button Redirection Destination Path</label>
                <input 
                  type="text" 
                  placeholder="E.G., /contact#form or mailto:ops@buraqwears.com" 
                  value={item.btn_url || ''} 
                  onChange={(e) => handleUpdateBlockProp(idx, 'btn_url', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] rounded focus:border-black transition-colors" 
                />
              </div>
            </div>

            {/* Background Image CDN link connector */}
            <div className="border-t border-neutral-100 pt-3">
              <ImageUploader 
                label="Header Cover Background Image Link" 
                value={item.img || ''} 
                onUploadComplete={(url) => handleUpdateBlockProp(idx, 'img', url)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}