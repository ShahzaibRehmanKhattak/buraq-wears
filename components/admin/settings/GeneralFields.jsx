import React from 'react';

export function GeneralFields({ data, onUpdate }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none disabled:bg-[#f9f9f9]";
  const textStyle = "w-full rounded-md border border-[#e5e5e5] bg-white p-3 h-24 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>General Store Identity</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Store Name</label>
          <input type="text" placeholder="e.g. Buraq Wears" className={inputStyle} value={data?.name || ''} onChange={e => onUpdate('general', 'name', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Global Tagline</label>
          <input type="text" placeholder="Premium Apparel Concept" className={inputStyle} value={data?.tagline || ''} onChange={e => onUpdate('general', 'tagline', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Public Outbound Email</label>
          <input type="email" placeholder="info@yourstore.com" className={inputStyle} value={data?.email || ''} onChange={e => onUpdate('general', 'email', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Contact Support Phone</label>
          <input type="text" placeholder="+92 300 1234567" className={inputStyle} value={data?.phone || ''} onChange={e => onUpdate('general', 'phone', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Primary WhatsApp Hotline</label>
          <input type="text" placeholder="+92 300 7654321" className={inputStyle} value={data?.whatsapp || ''} onChange={e => onUpdate('general', 'whatsapp', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Currency Code</label>
          <input type="text" placeholder="PKR" className={inputStyle} value={data?.currency || 'PKR'} onChange={e => onUpdate('general', 'currency', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelStyle}>Physical Warehouse Address</label>
        <textarea placeholder="Enter storefront primary physical warehouse address" className={textStyle} value={data?.address || ''} onChange={e => onUpdate('general', 'address', e.target.value)} />
      </div>
    </div>
  );
}