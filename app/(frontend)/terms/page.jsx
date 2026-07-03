"use client";
import React from 'react';
import {getTheme} from "@/components/themes";

export default function TermsAndConditionsPage() {
    const Theme = getTheme("default");
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] antialiased pt-20 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 md:px-16 font-sans">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Page Header Matrix */}
        <div className="mb-10 md:mb-16 border-b border-neutral-100 pb-6 md:pb-8">
          <h1 className="font-semibold text-[28px] sm:text-[32px] md:text-[40px] uppercase tracking-[-0.02em] leading-none mb-3 text-black">
            Terms & Conditions Matrix
          </h1>
          <p className="text-[9px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
            System Operations Framework, Workspace Use & Legal Protocol
          </p>
        </div>

        {/* Responsive Layout Grid Core */}
        <div className="grid grid-cols-12 gap-y-12 lg:gap-8 xl:gap-16 items-start">
          
          {/* Left Block */}
          <div className="col-span-12 lg:col-span-5">
            <Theme.TermsOverview />
          </div>

          {/* Right Block */}
          <div className="col-span-12 lg:col-span-7">
            <Theme.TermsClauses />
          </div>
          
        </div>

      </div>
    </div>
  );
}