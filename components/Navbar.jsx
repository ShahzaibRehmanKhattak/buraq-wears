"use client";
import { Search, User, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <nav className={`hidden md:flex fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="flex justify-between items-center w-full px-20 max-w-[1440px] mx-auto">
          <div className="flex-1">
            <a href="#" className="font-display text-[32px] tracking-[-0.05em] text-black">IBNA</a>
          </div>
          <div className="flex items-center justify-center gap-10 flex-[2]">
            {['Collections', 'Shirts', 'Trousers', 'Accessories', 'Atelier'].map((item) => (
              <a key={item} href="#" className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant hover:text-black transition-all duration-300 pb-1 border-b border-transparent hover:border-black/20">{item}</a>
            ))}
          </div>
          <div className="flex items-center justify-end gap-8 flex-1">
            <Search size={20} className="cursor-pointer hover:opacity-50" />
            <User size={20} className="cursor-pointer hover:opacity-50" />
            <ShoppingBag size={20} className="cursor-pointer hover:opacity-50" />
          </div>
        </div>
      </nav>

      {/* Mobile Header (App-like) */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5 h-16">
        <div className="flex items-center justify-between px-5 h-full">
          <div className="flex items-center gap-4">
            <button className="tap-scale">
              <span className="material-symbols-outlined text-black">menu</span>
            </button>
            <h1 className="text-[22px] font-bold tracking-[-0.04em] text-black">IBNA</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="tap-scale flex items-center gap-2 bg-[#f3f3f4] px-3 py-1.5 rounded-full border border-black/5">
              <span className="material-symbols-outlined text-[20px] text-gray-500">search</span>
              <span className="text-[13px] text-gray-400 font-medium pr-2">Search</span>
            </button>
            <button className="tap-scale relative">
              <span className="material-symbols-outlined text-black">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">2</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};