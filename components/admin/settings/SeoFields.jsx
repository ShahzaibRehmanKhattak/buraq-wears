import React from 'react';

export function SeoFields({ data, onUpdate, onUpload }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const textStyle = "w-full rounded-md border border-[#e5e5e5] bg-white p-3 h-24 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Global SEO & Metadata Control</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>SEO Browser Tab Title</label>
          <input type="text" placeholder="Buraq Wears | Premium Streetwear Concept" className={inputStyle} value={data?.seo_title || ''} onChange={e => onUpdate('seo', 'seo_title', e.target.value)} />
        </div>
        <div>
          <span className={labelStyle}>Social Open Graph Image (banners bucket)</span>
          <input type="file" className="text-[11px]" onChange={e => onUpload(e, 'banners', 'seo', 'og_image_url')} />
        </div>
      </div>
      <div>
        <label className={labelStyle}>Meta Indexing Description</label>
        <textarea placeholder="Write index summary text snippet targeting search index optimization..." className={textStyle} value={data?.seo_description || ''} onChange={e => onUpdate('seo', 'seo_description', e.target.value)} />
      </div>
    </div>
  );
}