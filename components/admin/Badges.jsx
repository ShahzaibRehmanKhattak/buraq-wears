"use client";

import React from 'react';

export const Badge = ({ children, variant = "default" }) => {
  // Balanced typography metrics mapped directly into minimal wireframe colors
  const styles = {
    default: "bg-[#fcfcfc] text-black border-black/[0.12]",
    warning: "bg-amber-50/40 text-amber-800 border-amber-600/[0.2]",
    info: "bg-blue-50/40 text-blue-800 border-blue-600/[0.2]",
    success: "bg-emerald-50/40 text-emerald-800 border-emerald-600/[0.2]",
    neutral: "bg-neutral-100 text-neutral-800 border-neutral-300"
  };

  return (
    <span className={`
      /* Baseline Box Alignments */
      inline-flex items-center justify-center
      px-2.5 py-1 rounded-none border text-[9px]
      font-bold uppercase tracking-[0.18em] leading-none
      select-none transition-colors duration-150
      
      /* Application of Component Class Tokens */
      ${styles[variant] || styles.default}
    `}>
      {children}
    </span>
  );
};