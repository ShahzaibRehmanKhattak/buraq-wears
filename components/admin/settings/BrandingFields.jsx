import React from 'react';

export function BrandingFields({ data, onUpdate, onUpload, uploadingBucket }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Branding Configuration Preset</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#eeeeee] p-4 rounded space-y-2">
          <span className={labelStyle}>Brand Vector Logo</span>
          <input type="file" className="text-[11px]" onChange={e => onUpload(e, 'logos', 'branding', 'logo_url')} />
          {uploadingBucket === 'logo_url' && <p className="text-[10px] text-neutral-400">Uploading payload data...</p>}
          {data?.logo_url && <img src={data.logo_url} className="h-10 object-contain pt-1" alt="Logo" />}
        </div>
        <div className="border border-[#eeeeee] p-4 rounded space-y-2">
          <span className={labelStyle}>Browser Favicon Asset</span>
          <input type="file" className="text-[11px]" onChange={e => onUpload(e, 'logos', 'branding', 'favicon_url')} />
          {uploadingBucket === 'favicon_url' && <p className="text-[10px] text-neutral-400">Uploading payload data...</p>}
          {data?.favicon_url && <img src={data.favicon_url} className="h-6 w-6 object-contain pt-1" alt="Favicon" />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className={labelStyle}>Primary Theme Color Hex</label>
          <input type="text" placeholder="#000000" className={inputStyle} value={data?.primary_color || ''} onChange={e => onUpdate('branding', 'primary_color', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Secondary Accent Hex</label>
          <input type="text" placeholder="#777777" className={inputStyle} value={data?.secondary_color || ''} onChange={e => onUpdate('branding', 'secondary_color', e.target.value)} />
        </div>
      </div>
    </div>
  );
}