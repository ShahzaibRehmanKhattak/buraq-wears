"use client";
import React from 'react';

export default function PolicyClauses() {
  const clauses = [
    {
      section: "Section 1.0",
      title: "Workspace Environment Activation",
      body: "Authorized client credentials unlock specific instance leases on our multi-tenant cluster. You are solely responsible for ensuring the absolute confidentiality of active session signatures and user authentication profiles. Unauthorized multi-tenant environment hopping or credential spoofing will trigger an immediate, automated tenant lockdown."
    },
    {
      section: "Section 2.0",
      title: "Acceptable Use Matrix & Telemetry Limits",
      body: "Users agree not to strain, bypass, or probe platform API routing configurations. System workloads are subject to dynamic rate filtering to optimize collective node performance. Scraping data matrices, automated pipeline spamming, or reverse-engineering proprietary compilation modules is strictly prohibited."
    },
    {
      section: "Section 3.0",
      title: "Platform Allocation & Service Leases",
      body: "We provide web services and store assets under standard cloud infrastructure parameters. While we maintain reliable continuous database states, we reserve the right to temporarily drop cluster nodes for routine system syncs or structural protection patches. Service execution models are provided entirely 'as-is'."
    },
    {
      section: "Section 4.0",
      title: "Account Purge & Protocol Termination",
      body: "We retain the unilateral system authority to sever environment leases or permanently lock accounts that violate our usage matrix guidelines. Likewise, users can drop their tenant connections and delete their database references through standard platform control steps at their own choosing."
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