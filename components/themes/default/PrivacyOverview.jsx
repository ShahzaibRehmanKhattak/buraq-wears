"use client";
import React from 'react';

export default function PrivacyOverview() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Overview Intro text - now centers on mobile, left-aligns on desktop */}
      <div className="space-y-4 text-center md:text-left">
        <h2 className="font-bold text-[14px] tracking-[0.05em] uppercase text-black">
          Data Governance Overview
        </h2>
        <p className="text-[12px] text-neutral-500 uppercase tracking-wide leading-relaxed max-w-md mx-auto md:mx-0">
          This document governs the system telemetry control rules, cryptographic mappings, and database storage regulations across our multi-tenant application infrastructure.
        </p>
      </div>

      {/* Metric/Context Rows - centers text on mobile, scales back to left-aligned grid elements on desktop */}
      <div className="space-y-6 border-t border-neutral-100 pt-8 text-[12px] text-center md:text-left">
        <div className="space-y-1">
          <span className="block text-neutral-400 font-bold tracking-wider uppercase text-[9px]">
            Encryption Standard
          </span>
          <p className="font-semibold text-black uppercase">
            AES-256-GCM / TLS 1.3
          </p>
        </div>
        
        <div className="space-y-1">
          <span className="block text-neutral-400 font-bold tracking-wider uppercase text-[9px]">
            Data Controller Endpoint
          </span>
          <p className="font-semibold text-black">
            privacy@domain.com
          </p>
        </div>
        
        <div className="space-y-1">
          <span className="block text-neutral-400 font-bold tracking-wider uppercase text-[9px]">
            Compliance Framework
          </span>
          <p className="font-semibold text-black uppercase">
            Global Data Isolation Protocol
          </p>
        </div>
      </div>

      {/* System Warning Notice Box - centers its text on mobile as well */}
      <div className="bg-neutral-50/60 border border-neutral-100 p-5 rounded-sm space-y-2 text-center md:text-left">
        <h4 className="font-bold text-[11px] tracking-[0.05em] uppercase text-black">
          System Log Notice
        </h4>
        <p className="text-[10px] text-neutral-500 uppercase tracking-wide leading-relaxed max-w-md mx-auto md:mx-0">
          Persistent authentication records are automatically recycled every 30 days unless operational multi-tenant security demands an extended pipeline lease.
        </p>
      </div>
    </div>
  );
}