"use client";
import React from 'react';

export default function PrivacyClauses() {
  const clauses = [
    {
      section: "Section 1.0",
      title: "Telemetry & Token Collection",
      body: "We strictly collect information essential to maintaining your active terminal sessions and secure workspace configurations. This includes user identity handles, transient authorization tokens, account emails, and device network signatures. We do not track or persist operational user data outside of necessary platform state syncs."
    },
    {
      section: "Section 2.0",
      title: "Tenant Database Isolation",
      body: "Our database architecture is designed with high-security row-level multi-tenancy. Your workspace variables, assets, and metadata are dynamically filtered through strict separation rules. This guarantees your profile footprint cannot be compromised, exposed, or leaked across parallel tenant scopes."
    },
    {
      section: "Section 3.0",
      title: "Third-Party Data Routing",
      body: "Core telemetry data is never sold, traded, or distributed. Outbound data pipelines are exclusively used for essential cloud infrastructure management (e.g., Supabase authentication, secure edge processing, and gateway monitoring). All external transmission pipelines operate under matching end-to-end encryption protocols."
    },
    {
      section: "Section 4.0",
      title: "User Purge Rights & Erasure Protocols",
      body: "You retain complete sovereignty over your platform history. Users can trigger an complete account purge sequence at any time. Once initiated, all related storage slots, environment states, and communication variables are permanently dropped from active production caches within 48 hours."
    }
  ];

  return (
    <div className="space-y-10 border-t lg:border-t-0 lg:border-l border-neutral-100 pt-10 lg:pt-0 lg:pl-12">
      {clauses.map((clause, index) => (
        <div key={index} className="space-y-3">
          <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase block">
            {clause.section}
          </span>
          <h3 className="font-bold text-[16px] tracking-tight text-black uppercase">
            {clause.title}
          </h3>
          <p className="text-[13px] text-neutral-600 leading-relaxed">
            {clause.body}
          </p>
        </div>
      ))}
    </div>
  );
}