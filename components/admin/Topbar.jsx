import { Menu, Search, Bell } from 'lucide-react';
import Link from 'next/link';
export const TopBar = ({ onMenuOpen }) => (
  <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-[#eeeeee] lg:px-10 sticky top-0 z-40 font-sans antialiased text-black">
    
    {/* SEARCH & MOBILE NAVIGATION CONTROLS */}
    <div className="flex items-center gap-4">
      <button 
        className="lg:hidden p-2 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors" 
        onClick={onMenuOpen}
      >
        <Menu size={18} />
      </button>
      
     <div className="hidden md:flex items-center gap-2.5 px-3 h-9 bg-white border border-[#e5e5e5] rounded-md w-64 lg:w-96 transition-all duration-150 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
  <Search size={14} className="text-[#888888] shrink-0" />
  <input 
    type="text" 
    placeholder="Quick search across terminal..." 
    className="bg-transparent border-none w-full text-[12px] font-medium text-black placeholder-[#999999] outline-none ring-0 focus:ring-0 p-0" 
  />
</div>
    </div>

    {/* UTILITY NOTIFICATIONS & PROFILE SYSTEM LOG */}
    <div className="flex items-center gap-2">
      <Link href="/notifications" className="p-2 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md relative transition-colors">
        <Bell size={16} />
        {/* Sharp status signal indicator dot */}
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#de350b] rounded-full"></span>
      </Link>

      {/* Structural Minimal Line Divider */}
      <div className="h-6 w-[1px] bg-[#eeeeee] mx-2 hidden sm:block"></div>
      
      {/* Admin Quick Identity Panel */}
      <div className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-black/[0.02] rounded-md transition-colors cursor-pointer group">
        <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-bold text-[10px] tracking-tight shrink-0 select-none">
          AD
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-black hidden sm:inline">
          Admin
        </span>
      </div>
    </div>

  </header>
);