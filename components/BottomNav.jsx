import React from 'react';
import { Plus } from 'lucide-react';
export const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-black/5 h-[72px] flex justify-around items-center px-4 pb-4">
    <a className="flex flex-col items-center justify-center text-black tap-scale" href="#">
      <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
      <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Shop</span>
    </a>
    <a className="flex flex-col items-center justify-center text-gray-400 tap-scale" href="#">
      <span className="material-symbols-outlined text-[26px]">category</span>
      <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">Explore</span>
    </a>
    <a className="flex flex-col items-center justify-center text-gray-400 tap-scale" href="#">
      <span className="material-symbols-outlined text-[26px]">favorite</span>
      <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">Wishlist</span>
    </a>
    <a className="flex flex-col items-center justify-center text-gray-400 tap-scale" href="#">
      <span className="material-symbols-outlined text-[26px]">person</span>
      <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">Profile</span>
    </a>
  </nav>
);