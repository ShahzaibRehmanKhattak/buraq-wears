"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1b284f] text-white pt-24 pb-12 antialiased border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* ─── MAIN FOOTER GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* Column 1: Brand Identifier */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="text-[20px] font-semibold tracking-tight text-white uppercase">
              IBNA ATELIER
            </Link>
            <p className="text-[13px] text-white/50 max-w-xs leading-relaxed font-light">
              Defining the contemporary silhouette through structural precision and minimalist philosophy.
            </p>
            <div className="flex gap-6 text-[11px] font-medium tracking-wider">
              {['Instagram', 'Vimeo', 'LinkedIn'].map(social => (
                <a 
                  key={social} 
                  href={`https://${social.toLowerCase()}.com`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-white transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Core Directory */}
          <div className="md:col-span-2 space-y-5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#00b4d8]">Atelier</h5>
            <ul className="space-y-3 text-[12px] font-normal text-white/60">
              {[
                { name: 'The Edit', path: '/edit' },
                { name: 'Lookbook', path: '/lookbook' },
                { name: 'Sustainability', path: '/sustainability' },
                { name: 'Stores', path: '/stores' }
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.path} className="hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="md:col-span-2 space-y-5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#00b4d8]">Care</h5>
            <ul className="space-y-3 text-[12px] font-normal text-white/60">
              {[
                { name: 'Orders', path: '/orders' },
                { name: 'Returns', path: '/returns' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'Contact', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.path} className="hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Submission */}
          <div className="md:col-span-4 space-y-5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#00b4d8]">The Correspondence</h5>
            <p className="text-[13px] text-white/50 font-light leading-relaxed">
              Access early releases and exclusive insights into our seasonal collections.
            </p>
            <form className="flex border-b border-white/20 pb-2 items-center group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-[12px] w-full px-0 placeholder:text-white/20 text-white tracking-wide" 
              />
              <button type="submit" className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* ─── BOTTOM LEGAL & COPYRIGHT BAR ─── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 py-6 border-t border-white/5">
          <p className="text-[11px] text-white/30 tracking-wide font-light">
            © {new Date().getFullYear()} IBNA ATELIER. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[11px] text-white/30 font-light">
            <Link href="/privacy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}