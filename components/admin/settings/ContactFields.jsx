import React from 'react';

export function ContactFields({ data, onUpdate }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Contact Coordinates & Maps</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Dedicated Support Email</label>
          <input type="email" placeholder="support@yourbrand.com" className={inputStyle} value={data?.contact_email || ''} onChange={e => onUpdate('contact', 'contact_email', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Support Landline Desk</label>
          <input type="text" placeholder="+92 42 111 222 333" className={inputStyle} value={data?.contact_phone || ''} onChange={e => onUpdate('contact', 'contact_phone', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelStyle}>Google Maps Embed URL</label>
        <input type="text" placeholder="https://www.google.com/maps/embed?pb=..." className={inputStyle} value={data?.google_maps_url || ''} onChange={e => onUpdate('contact', 'google_maps_url', e.target.value)} />
      </div>
    </div>
  );
}