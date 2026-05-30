"use client";
import React from 'react';

export function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
      }
      .product-card-shadow:hover {
        box-shadow: 0 20px 40px -20px rgba(0,0,0,0.08);
      }
      body {
        background-color: #f9f9f9;
      }
    `}</style>
  );
}