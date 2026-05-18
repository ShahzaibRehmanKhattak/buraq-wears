import { Home, Box, ShoppingBag, User } from 'lucide-react';
export const BottomBar = () => (
  <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-white/90 backdrop-blur-2xl border-t border-gray-100 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] lg:hidden">
    <button className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 group">
      <div className="p-2 rounded-xl transition-all group-active:scale-90"><Home size={22} /></div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">Home</span>
    </button>
    <button className="relative flex flex-col items-center justify-center w-full h-full text-black group">
      <div className="relative p-2 rounded-xl bg-black/5 transition-all group-active:scale-90">
        <Box size={22} fill="currentColor" fillOpacity={1} />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full border-2 border-white"></div>
      </div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">Stock</span>
    </button>
    <button className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 group">
      <div className="p-2 rounded-xl transition-all group-active:scale-90"><ShoppingBag size={22} /></div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">Orders</span>
    </button>
    <button className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 group">
      <div className="p-2 rounded-xl transition-all group-active:scale-90"><User size={22} /></div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">User</span>
    </button>
  </nav>
);