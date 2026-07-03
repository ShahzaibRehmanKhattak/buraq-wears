"use client";
import React from 'react';

export default function PolicyClauses() {
  const clauses = [
    {
      section: "Section 1.0",
      title: "Account Registration & Security",
      body: "Accessing specific store settings, order historical tracking, and member-exclusive suites requires active profile verification. You remain solely responsible for maintaining the strict confidentiality of your active portal session signatures. Any unauthorized credentials usage or platform access breaches must be reported immediately to our systems desk."
    },
    {
      section: "Section 2.0",
      title: "Intellectual Property & Design Rights",
      body: "All creative visual identity material, structural layouts, custom product typography, design assets, and metadata elements displayed on this platform are owned exclusively by our brand. Scraping data matrices, hotlinking product media records, or replicating proprietary brand architecture for commercial reproduction is strictly prohibited."
    },
    {
      section: "Section 3.0",
      title: "Inventory Allocations & Orders",
      body: "Product listings, real-time stock allocations, and pricing structures are subject to system modification without prior notification. While we maintain optimized continuous database accuracy to safeguard precise checkout logs, we reserve the system authority to cancel or decline transactions exhibiting irregular automated routing parameters."
    },
    {
      section: "Section 4.0",
      title: "Platform Usage & Service Limitations",
      body: "Our web storefront and associated portal modules are provided entirely on an 'as-is' and 'as-available' operational framework. We reserve the right to temporarily limit cluster connections for routine database maintenance windows, backend structural protection updates, or core layout adjustments."
    }
  ];

  return (
    <div className="space-y-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-10">
      {clauses.map((clause, index) => (
        <div key={index} className="space-y-2">
          {/* Flat Corporate Blueprint Index Tag */}
          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase block">
            {clause.section}
          </span>
          
          {/* Sharp High-Contrast Header */}
          <h3 className="font-bold text-[13px] md:text-[14px] tracking-wider text-[#1b284f] uppercase">
            {clause.title}
          </h3>
          
          {/* Low-Profile Descriptive Text Body */}
          <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium tracking-wide leading-relaxed text-justify">
            {clause.body}
          </p>
        </div>
      ))}
    </div>
  );
}