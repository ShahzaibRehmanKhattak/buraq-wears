"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';
export const Footer = () => (
  <footer className="w-full bg-white pt-32 pb-16">
    <div className="max-w-[1440px] mx-auto px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
        <div className="md:col-span-4 space-y-10">
          <a href="#" className="font-display text-[24px] tracking-[-0.05em] text-black uppercase">IBNA ATELIER</a>
          <p className="text-[14px] text-gray-500 max-w-xs leading-relaxed">
            Defining the contemporary silhouette through architectural precision and minimalist philosophy.
          </p>
          <div className="flex gap-6 text-[12px] font-bold uppercase tracking-widest">
            {['Instagram', 'Vimeo', 'LinkedIn'].map(social => (
              <a key={social} href="#" className="text-gray-500 hover:text-black transition-colors">{social}</a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <h5 className="text-[12px] font-bold uppercase text-black">Atelier</h5>
          <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            {['The Edit', 'Lookbook', 'Sustainability', 'Stores'].map(link => (
              <li key={link}><a href="#" className="hover:text-black transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 space-y-8">
          <h5 className="text-[12px] font-bold uppercase text-black">Care</h5>
          <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            {['Orders', 'Returns', 'Size Guide', 'Contact'].map(link => (
              <li key={link}><a href="#" className="hover:text-black transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 space-y-8">
          <h5 className="text-[12px] font-bold uppercase text-black">The Correspondence</h5>
          <p className="text-[14px] text-gray-500">Access early releases and exclusive insights into our seasonal narratives.</p>
          <form className="flex border-b border-black pb-2 group" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              className="bg-transparent border-none focus:ring-0 text-[11px] font-bold w-full px-0 placeholder:text-gray-300 uppercase tracking-[0.2em]" 
            />
            <button className="group-hover:translate-x-1 transition-transform">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8 border-t border-black/5">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">© 2024 IBNA ATELIER. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);