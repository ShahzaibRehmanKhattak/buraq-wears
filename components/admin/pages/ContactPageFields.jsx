"use client";
import React from 'react';

export function ContactPageFields({ loc, mail, phone, hours, onUpdate }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[13px] font-bold uppercase tracking-wider text-black border-b pb-2">HQ Communication Terminal Hub Parameters</h3>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Physical Location Hub Address Coordinates</label>
        <input type="text" placeholder="Plot 42-C, Sector I-9 Industrial Area, Islamabad, Pakistan" value={loc} onChange={(e) => onUpdate('contact_hub_location', e.target.value)} className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] uppercase rounded focus:border-black" />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Client Uplink Email Gateway Terminal</label>
        <input type="email" placeholder="shahzaibkhattak0319@gmail.com" value={mail} onChange={(e) => onUpdate('contact_receiver_email', e.target.value)} className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] rounded focus:border-black" />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Direct Support Phone Core Matrix Line</label>
        <input type="text" placeholder="+92 (51) 111-BURAQ" value={phone} onChange={(e) => onUpdate('contact_support_phone', e.target.value)} className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] rounded focus:border-black" />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#555555] mb-2">Operational Dispatches Execution Pipelines</label>
        <input type="text" placeholder="Monday – Saturday | 10:00 AM – 06:00 PM (PKT)" value={hours} onChange={(e) => onUpdate('contact_operational_hours', e.target.value)} className="w-full h-10 px-3 bg-white border border-neutral-200 text-[12px] rounded focus:border-black" />
      </div>
    </div>
  );
}