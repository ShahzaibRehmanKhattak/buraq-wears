import React from 'react';

export function ShippingFields({ data, onUpdate }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Shipping Framework & Logistics Costs</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <label className="flex items-center gap-2 border p-3 rounded text-[12px] font-semibold cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.free_shipping_enabled || false} onChange={e => onUpdate('shipping', 'free_shipping_enabled', e.target.checked)} />
          Enable Free Shipping Option
        </label>
        <label className="flex items-center gap-2 border p-3 rounded text-[12px] font-semibold cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.flat_rate_enabled || false} onChange={e => onUpdate('shipping', 'flat_rate_enabled', e.target.checked)} />
          Enable Flat Rate Cost Rules
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Flat Rate Order Logistics Price</label>
          <input type="number" placeholder="250" className={inputStyle} value={data?.flat_rate_cost || ''} onChange={e => onUpdate('shipping', 'flat_rate_cost', e.target.value)} />
        </div>
        <div>
          <label className={labelStyle}>Estimated Home Delivery Timeframe</label>
          <input type="text" placeholder="e.g. 2-4 Business Days" className={inputStyle} value={data?.delivery_time || ''} onChange={e => onUpdate('shipping', 'delivery_time', e.target.value)} />
        </div>
      </div>
    </div>
  );
}