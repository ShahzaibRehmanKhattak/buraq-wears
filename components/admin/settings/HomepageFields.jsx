import React from 'react';

export function HomepageFields({ data, onUpdate, onUpload }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Homepage Hero Banner Frame</h4>
      <div>
        <span className={labelStyle}>Hero Background Panel (banners bucket)</span>
        <input type="file" className="text-[11px] mb-2" onChange={e => onUpload(e, 'banners', 'homepage', 'hero_image_url')} />
        {data?.hero_image_url && <img src={data.hero_image_url} className="h-20 w-full object-cover rounded border" alt="Hero Banner" />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Main Headline Title</label>
          <input type="text" placeholder="e.g. New Seasonal Drops" className={inputStyle} value={data?.hero_title || ''} onChange={e => onUpdate('homepage', 'hero_title', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Sub-Headline Descriptor</label>
          <input type="text" placeholder="Crafted for extreme style and daily performance" className={inputStyle} value={data?.hero_subtitle || ''} onChange={e => onUpdate('homepage', 'hero_subtitle', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>CTA Button Text</label>
          <input type="text" placeholder="Shop Now" className={inputStyle} value={data?.hero_button_text || ''} onChange={e => onUpdate('homepage', 'hero_button_text', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>CTA Button Target Link</label>
          <input type="text" placeholder="/collections/all" className={inputStyle} value={data?.hero_button_link || ''} onChange={e => onUpdate('homepage', 'hero_button_link', e.target.value)} />
        </div>
      </div>
    </div>
  );
}