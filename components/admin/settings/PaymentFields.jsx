import React from 'react';

export function PaymentFields({ data, onUpdate }) {
  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee]";

  return (
    <div className="space-y-4">
      <h4 className={sectionTitleStyle}>Remittance & Checkout Settlement Integrations</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex items-center gap-2 border p-3 rounded text-[11px] font-bold uppercase tracking-wide cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.cod_enabled || false} onChange={e => onUpdate('payment', 'cod_enabled', e.target.checked)} />
          Cash On Delivery (COD)
        </label>
        <label className="flex items-center gap-2 border p-3 rounded text-[11px] font-bold uppercase tracking-wide cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.jazzcash_enabled || false} onChange={e => onUpdate('payment', 'jazzcash_enabled', e.target.checked)} />
          JazzCash Wallet
        </label>
        <label className="flex items-center gap-2 border p-3 rounded text-[11px] font-bold uppercase tracking-wide cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.easypaisa_enabled || false} onChange={e => onUpdate('payment', 'easypaisa_enabled', e.target.checked)} />
          EasyPaisa Wallet
        </label>
      </div>
      <div className="border border-dashed border-[#eeeeee] p-4 rounded space-y-4 pt-4">
        <label className="flex items-center gap-2 text-[12px] font-semibold cursor-pointer select-none">
          <input type="checkbox" className="accent-black" checked={data?.bank_transfer_enabled || false} onChange={e => onUpdate('payment', 'bank_transfer_enabled', e.target.checked)} />
          Enable Direct Bank Transfer Options
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelStyle}>Clear Clearing Bank Name</label>
            <input type="text" placeholder="Meezan Bank" className={inputStyle} value={data?.bank_name || ''} disabled={!data?.bank_transfer_enabled} onChange={e => onUpdate('payment', 'bank_name', e.target.value)} />
          </div>
          <div>
            <label className={labelStyle}>Official Account Title</label>
            <input type="text" placeholder="Buraq Wears Logistics" className={inputStyle} value={data?.account_title || ''} disabled={!data?.bank_transfer_enabled} onChange={e => onUpdate('payment', 'account_title', e.target.value)} />
          </div>
          <div>
            <label className={labelStyle}>IBAN / Account Number</label>
            <input type="text" placeholder="PK42MEZN00000109..." className={inputStyle} value={data?.account_number || ''} disabled={!data?.bank_transfer_enabled} onChange={e => onUpdate('payment', 'account_number', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}