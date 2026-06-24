"use client";
import React from 'react';
import { useStoreModule } from '@/hooks/useStoreModule';
import { ContactInfo } from '@/components/ContactInfo';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  // Use our centralized high-performance cache hook
  const { contact, loading } = useStoreModule('contact');

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] antialiased pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        
        {/* ================= PAGE HEADER ================= */}
        <div className="mb-12 md:mb-16 border-b border-neutral-100 pb-6 md:pb-8">
          <h1 className="font-semibold text-[32px] md:text-[40px] uppercase tracking-[-0.02em] leading-none mb-3 text-black">
            Contact Concierge
          </h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
            Client Support & Database Uplink Matrix
          </p>
        </div>

        {/* ================= TWO COLUMN GRID MATRIX ================= */}
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column Section: Dynamic Contact Info Nodes */}
          <div className="col-span-12 lg:col-span-5">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-neutral-200 w-1/3 rounded"></div>
                <div className="h-20 bg-neutral-100 w-full rounded"></div>
              </div>
            ) : (
        <ContactInfo 
  location={contact?.location || contact?.data?.location}
  email={contact?.email || contact?.data?.email}
  phone={contact?.phone || contact?.data?.phone}
  hours={contact?.hours || contact?.data?.hours}
/>
            )}
          </div>

          {/* Right Column Section: Interactive Form Control Node */}
          <div className="col-span-12 lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}