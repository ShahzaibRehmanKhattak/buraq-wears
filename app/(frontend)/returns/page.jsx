"use client";
import React from 'react';
import { useStoreModule } from '@/hooks/useStoreModule';
import { ReturnDirectives } from '@/components/ReturnDirectives';
import { ReturnFAQs } from '@/components/ReturnFAQs';
import { ReturnForm } from '@/components/ReturnForm';

export default function ReturnsPage() {
  const { returns, loading } = useStoreModule('returns');

  // SAFE UTILITY PARSER MATRIX: Converts stringified database blobs into clean arrays
  const parseDatabaseArray = (rawData) => {
    if (!rawData) return null;
    if (Array.isArray(rawData)) return rawData; // If already an array, pass it through
    try {
      if (typeof rawData === 'string') {
        return JSON.parse(rawData); // Parse the JSON string wrapper
      }
    } catch (e) {
      console.error("Failed to parse database array string:", e);
    }
    return null;
  };

  // Extract and unpack your fields cleanly
  const liveDirectives = parseDatabaseArray(returns?.directives);
  const liveFaqs = parseDatabaseArray(returns?.faqs);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] antialiased pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-12 md:mb-16 border-b border-neutral-100 pb-6 md:pb-8">
          <h1 className="font-semibold text-[32px] md:text-[40px] uppercase tracking-[-0.02em] leading-none mb-3 text-black">
            Returns & Reverse Matrix
          </h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
            Automated Reverse Logistics Protocol & Exchanges
          </p>
        </div>

        {/* Master Column Matrix Grid */}
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: RULES & ACCORDION DATA LAYERS */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-10">
            {loading ? (
              <div className="space-y-8 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 w-1/4 rounded"></div>
                  <div className="h-16 bg-neutral-100 w-full rounded"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Your live parsed database arrays now pipe here directly! */}
                <ReturnDirectives directives={liveDirectives} />
                <ReturnFAQs faqs={liveFaqs} />
              </>
            )}
          </div>

          {/* RIGHT COLUMN: ISOLATED INTERACTIVE TRANSMISSION TERMINAL */}
          <div className="col-span-12 lg:col-span-7">
            <ReturnForm />
          </div>
          
        </div>

      </div>
    </div>
  );
}