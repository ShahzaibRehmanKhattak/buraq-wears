"use client";
import React from 'react';
import { Home, Compass, Heart, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-black/5 h-[72px] flex justify-around items-center px-4 pb-4">
      
      <a className="flex flex-col items-center justify-center text-black" href="#">
        <Home size={24} strokeWidth={2} />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Shop</span>
      </a>
      
      <a className="flex flex-col items-center justify-center text-gray-400 hover:text-black transition-colors" href="#">
        <Compass size={24} strokeWidth={2} />
        <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">Explore</span>
      </a>
      
      <a className="flex flex-col items-center justify-center text-gray-400 hover:text-black transition-colors" href="#">
        <Heart size={24} strokeWidth={2} />
        <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">Wishlist</span>
      </a>
      
      <a className="flex flex-col items-center justify-center text-gray-400 hover:text-black transition-colors" href="#">
        <User size={24} strokeWidth={2} />
        <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">Profile</span>
      </a>

    </nav>
  );
};

export default BottomNav;