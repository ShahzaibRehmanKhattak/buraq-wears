"use client";
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo = ({ location, email, phone, hours }) => {
  // Defensive fallbacks protect against 'null' or empty string payloads arriving from database states
  const activeLocation = location || "Plot 42-C, Sector I-9 Industrial Area, Islamabad, Pakistan";
  const activeEmail = email || "shahzaibkhattak0319@gmail.com";
  const activePhone = phone || "+92 (51) 111-BURAQ";
  const activeHours = hours || "Monday – Saturday | 10:00 AM – 06:00 PM (PKT)";

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div>
        <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-black mb-4">
          BuraqWears HQ
        </h2>
        <p className="text-[12px] text-[#666666] leading-relaxed uppercase tracking-wider max-w-sm">
          Premium textile curation, tailored fit pipelines, and modern streetwear delivery operations worldwide.
        </p>
      </div>

      {/* Core Info Blocks Matrix */}
      <div className="flex flex-col gap-6 border-y border-neutral-100 py-8">
        <div className="flex gap-4 items-start">
          <MapPin size={15} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Logistics & Hub Location</h3>
            <p className="text-[12px] font-medium text-black tracking-wide">{activeLocation}</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <Mail size={15} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Digital Client Uplink</h3>
            <p className="text-[12px] font-medium text-black tracking-wide hover:underline cursor-pointer selection:bg-neutral-200">
              {activeEmail}
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <Phone size={15} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Direct Priority Line</h3>
            <p className="text-[12px] font-medium text-black tracking-wide">{activePhone}</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <Clock size={15} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Operational Windows</h3>
            <p className="text-[12px] font-medium text-black tracking-wide">{activeHours}</p>
          </div>
        </div>
      </div>

      {/* Brand Note Footer */}
      <div className="p-5 bg-neutral-50/60 rounded-md border border-neutral-200/50">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-black mb-1.5">Order Dispatches Notice</h4>
        <p className="text-[11px] text-[#777777] leading-relaxed uppercase tracking-wide text-justify">
          Please quote your 8-digit alpha-numeric Order Identifier string when filing support inquiries regarding standard customs clearing or global transit tracking delays.
        </p>
      </div>
    </div>
  );
}
export default ContactInfo;