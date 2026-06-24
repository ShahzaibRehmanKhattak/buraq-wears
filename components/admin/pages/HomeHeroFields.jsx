"use client";
import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

export function HomeHeroFields({ slides, onChange }) {
  // Append a brand new blank slide layout to our array state
  const addNewBlankSlideNode = () => {
    onChange([
      ...slides, 
      { title: '', subtitle: '', img: '', btn_text: '', btn_url: '', secondary_btn_text: '', secondary_btn_url: '' }
    ]);
  };

  const removeSlideNode = (targetIndex) => {
    onChange(slides.filter((_, idx) => idx !== targetIndex));
  };

  const updateSlideProp = (idx, field, value) => {
    const updated = [...slides];
    updated[idx][field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-black flex items-center gap-2">
          <Layers size={15}/> Home Page Dynamic Screen Slides Matrix
        </h3>
        <button 
          type="button" 
          onClick={addNewBlankSlideNode} 
          className="h-8 px-4 bg-black text-white rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={12}/> Append Slide Configuration
        </button>
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12 text-[11px] uppercase tracking-wider text-neutral-400 font-medium bg-neutral-50 border border-dashed rounded">
          No live homepage slider configurations built yet. Click above to append one.
        </div>
      )}

      <div className="space-y-8">
        {slides.map((slide, idx) => (
          <div key={idx} className="p-5 bg-neutral-50 border border-neutral-200 rounded relative space-y-4">
            
            {/* Remove Slide Action */}
            <button 
              type="button" 
              onClick={() => removeSlideNode(idx)} 
              className="absolute top-5 right-5 text-neutral-400 hover:text-red-650 transition-colors"
            >
              <Trash2 size={16}/>
            </button>
            
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              Slide Configuration Block #{idx + 1} {idx === 0 ? "(Primary Desktop Anchor)" : ""}
            </span>
            
            {/* Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Slide Display Title</label>
                <input 
                  type="text" 
                  placeholder="E.G., THE MONOLITH COLLECTION" 
                  value={slide.title || ''} 
                  onChange={(e) => updateSlideProp(idx, 'title', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] uppercase rounded focus:border-black" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Slide Subtitle / Season Identifier</label>
                <input 
                  type="text" 
                  placeholder="E.G., AUTUMN / WINTER 2026" 
                  value={slide.subtitle || ''} 
                  onChange={(e) => updateSlideProp(idx, 'subtitle', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] uppercase rounded focus:border-black" 
                />
              </div>
            </div>

            {/* Dynamic CTA Button 1 Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-200/60 pt-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Primary Button Text Content</label>
                <input 
                  type="text" 
                  placeholder="E.G., SHOP COLLECTION" 
                  value={slide.btn_text || ''} 
                  onChange={(e) => updateSlideProp(idx, 'btn_text', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] uppercase rounded focus:border-black" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Primary Button Destination Link Url</label>
                <input 
                  type="text" 
                  placeholder="E.G., /catalog/streetwear" 
                  value={slide.btn_url || ''} 
                  onChange={(e) => updateSlideProp(idx, 'btn_url', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] rounded focus:border-black" 
                />
              </div>
            </div>

            {/* Dynamic CTA Button 2 Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-200/60 pt-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Secondary Button Text Content (Desktop Only)</label>
                <input 
                  type="text" 
                  placeholder="E.G., READ NARRATIVE" 
                  value={slide.secondary_btn_text || ''} 
                  onChange={(e) => updateSlideProp(idx, 'secondary_btn_text', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] uppercase rounded focus:border-black" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Secondary Button Link Destination Url</label>
                <input 
                  type="text" 
                  placeholder="E.G., /journal/architecture-of-silence" 
                  value={slide.secondary_btn_url || ''} 
                  onChange={(e) => updateSlideProp(idx, 'secondary_btn_url', e.target.value)} 
                  className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] rounded focus:border-black" 
                />
              </div>
            </div>

            {/* Dynamic Image Upload Engine */}
            <div className="border-t border-neutral-200/60 pt-3">
              <ImageUploader 
                label="Slide Background Banner Resource Asset" 
                value={slide.img || ''} 
                onUploadComplete={(url) => updateSlideProp(idx, 'img', url)} 
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}