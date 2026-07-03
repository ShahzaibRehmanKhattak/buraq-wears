"use client";
import React from 'react';

export default function ContactInfo({ location, email, phone }) {
  // Fallbacks using standard placeholder values from image_978da5.png
  const activeEmail = email || "jamse@example.com";
  const activePhone = phone || "1234 567890";
  const activeLocation = location || "7398 Smoke Ranch RoadLas Vegas, Nevada 89128";

  return (
    <div className="flex flex-col gap-6 text-[14px] text-neutral-600">
      
      {/* Email Row */}
      <div className="flex items-center gap-4">
        <div className="text-[#3C50E0] shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        <p>
          <span className="text-neutral-700 font-normal">Email: </span>
          {activeEmail}
        </p>
      </div>

      {/* Phone Row */}
      <div className="flex items-center gap-4">
        <div className="text-[#3C50E0] shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <p>
          <span className="text-neutral-700 font-normal">Phone: </span>
          {activePhone}
        </p>
      </div>

      {/* Address Row */}
      <div className="flex items-start gap-4">
        <div className="text-[#3C50E0] shrink-0 mt-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <p className="leading-relaxed">
          <span className="text-neutral-700 font-normal">Address: </span>
          {activeLocation}
        </p>
      </div>

    </div>
  );
}