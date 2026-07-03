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
    // Kept your clean dark foundation palette exactly as it was
    <div className="flex flex-col gap-8 md:gap-10 bg-[#0b111e] p-6 md:p-8 rounded-xl text-white">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-[#00cfde] tracking-widest uppercase">● Limited Curated Match</span>
        </div>
        <h2 className="text-[16px] font-black uppercase tracking-[0.15em] text-white mb-3">
          BuraqWears HQ
        </h2>
        <p className="text-[12px] text-slate-400 leading-relaxed uppercase tracking-wider max-w-sm">
          Premium textile curation, tailored fit pipelines, and modern streetwear delivery operations worldwide.
        </p>
      </div>

      {/* Core Info Blocks Matrix */}
      <div className="flex flex-col gap-6 border-y border-[#1d2b4f] py-8">
        <div className="flex gap-4 items-start">
          <MapPin size={15} strokeWidth={1.5} className="text-[#00cfde] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Logistics & Hub Location</h3>
            <p className="text-[12px] font-medium text-slate-200 tracking-wide">{activeLocation}</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <Mail size={15} strokeWidth={1.5} className="text-[#00cfde] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Digital Client Uplink</h3>
            <p className="text-[12px] font-medium text-slate-200 tracking-wide hover:underline cursor-pointer selection:bg-[#00cfde]/20">
              {activeEmail}
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <Phone size={15} strokeWidth={1.5} className="text-[#00cfde] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Direct Priority Line</h3>
            <p className="text-[12px] font-medium text-slate-200 tracking-wide">{activePhone}</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <Clock size={15} strokeWidth={1.5} className="text-[#00cfde] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Operational Windows</h3>
            <p className="text-[12px] font-medium text-slate-200 tracking-wide">{activeHours}</p>
          </div>
        </div>
      </div>

      {/* Only changed this inner card background to use your premium #1b284f shade */}
      <div className="p-5 bg-[#1b284f] rounded-md border border-[#1d2b4f]">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#00cfde] mb-1.5">Order Dispatches Notice</h4>
        <p className="text-[11px] text-slate-300 leading-relaxed uppercase tracking-wide text-justify">
          Please quote your 8-digit alpha-numeric Order Identifier string when filing support inquiries regarding standard customs clearing or global transit tracking delays.
        </p>
      </div>
    </div>
  );
}

export default ContactInfo;