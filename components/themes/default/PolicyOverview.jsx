"use client";
import React from 'react';

export default function PolicyOverview() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Overview Intro text */}
      <div className="space-y-4 text-center md:text-left">
        <h2 className="font-bold text-[14px] tracking-[0.05em] uppercase text-black">
          Terms & Usage Overview
        </h2>
        <p className="text-[12px] text-neutral-500 uppercase tracking-wide leading-relaxed max-w-md mx-auto md:mx-0">
          This framework defines the strict protocol agreements, environment parameters, and platform system criteria governing all workspace operations.
        </p>
      </div>

      {/* Metric/Context Rows - Mobile Centered, Desktop Left-Aligned */}
      <div className="space-y-6 border-t border-neutral-100 pt-8 text-[12px] text-center md:text-left">
        <div className="space-y-1">
          <span className="block text-neutral-400 font-bold tracking-wider uppercase text-[9px]">
            Latest Revision Protocol
          </span>
          <p className="font-semibold text-black uppercase">
            v2026.2 // Operational State
          </p>
        </div>
        
        <div className="space-y-1">
          <span className="block text-neutral-400 font-bold tracking-wider uppercase text-[9px]">
            Jurisdiction Hub
          </span>
          <p className="font-semibold text-black">
            Islamabad, Pakistan
          </p>
        </div>
        
        <div className="space-y-1">
          <span className="block text-neutral-400 font-bold tracking-wider uppercase text-[9px]">
            System Lease Limit
          </span>
          <p className="font-semibold text-black uppercase">
            Per-Tenant Environment Thresholds
          </p>
        </div>
      </div>

      {/* System Warning Notice Box */}
      <div className="bg-neutral-50/60 border border-neutral-100 p-5 rounded-sm space-y-2 text-center md:text-left">
        <h4 className="font-bold text-[11px] tracking-[0.05em] uppercase text-black">
          Compliance Agreement
        </h4>
        <p className="text-[10px] text-neutral-500 uppercase tracking-wide leading-relaxed max-w-md mx-auto md:mx-0">
          By validating active session handshakes or mounting terminal operations within this web platform, you consent to the network terms structured herein.
        </p>
      </div>
    </div>
  );
}