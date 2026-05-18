import { Menu, Search, Bell } from 'lucide-react';
export const TopBar = ({ onMenuOpen }) => (
  <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 lg:px-10 sticky top-0 z-40">
    <div className="flex items-center gap-4">
      <button className="lg:hidden p-2 hover:bg-gray-50 rounded-lg" onClick={onMenuOpen}><Menu size={20} /></button>
      <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl w-64 lg:w-96">
        <Search size={18} className="text-gray-400" />
        <input type="text" placeholder="Quick search..." className="bg-transparent border-none focus:ring-0 w-full text-xs font-medium outline-none" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative">
        <Bell size={20} />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block"></div>
      <div className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">AD</div>
        <span className="text-sm font-semibold hidden sm:inline">Admin</span>
      </div>
    </div>
  </header>
);