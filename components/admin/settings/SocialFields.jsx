import React from 'react';

export function SocialFields({ data, onUpdate }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Social Media Connectivity Integration</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Facebook Profile Link</label>
          <input type="text" placeholder="https://facebook.com/yourpage" className={inputStyle} value={data?.facebook_url || ''} onChange={e => onUpdate('social', 'facebook_url', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Instagram Profile Link</label>
          <input type="text" placeholder="https://instagram.com/yourhandle" className={inputStyle} value={data?.instagram_url || ''} onChange={e => onUpdate('social', 'instagram_url', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>TikTok Account Link</label>
          <input type="text" placeholder="https://tiktok.com/@yourbrand" className={inputStyle} value={data?.tiktok_url || ''} onChange={e => onUpdate('social', 'tiktok_url', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>YouTube Channel URL</label>
          <input type="text" placeholder="https://youtube.com/c/yourchannel" className={inputStyle} value={data?.youtube_url || ''} onChange={e => onUpdate('social', 'youtube_url', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className={labelStyle}>LinkedIn Company Page</label>
          <input type="text" placeholder="https://linkedin.com/company/yourbrand" className={inputStyle} value={data?.linkedin_url || ''} onChange={e => onUpdate('social', 'linkedin_url', e.target.value)} />
        </div>
      </div>
    </div>
  );
}