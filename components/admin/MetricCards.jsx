import { useState } from 'react';
import { 
  LayoutGrid, Search, TrendingUp, TrendingDown, Eye, Share2, 
  ShoppingCart, Receipt, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, Filter, User, Settings, LogOut
} from 'lucide-react';

export const MetricCard = ({ title, value, trend, trendUp, icon: Icon, isPrimary = false }) => (
  <div className="bg-white border border-black/[0.06] p-4 flex flex-col justify-between min-h-[120px] rounded-md transition-colors hover:bg-black/[0.01]">
    
    {/* Upper Matrix Layer */}
    <div className="flex justify-between items-center">
      <div className="text-[11px] font-semibold text-[#555555] tracking-wide uppercase">
        {title}
      </div>
      <div className={`w-7 h-7 rounded-md flex items-center justify-center border ${
        isPrimary 
          ? 'bg-black text-white border-transparent' 
          : 'bg-white text-black border-black/[0.08]'
      }`}>
        <Icon size={14} strokeWidth={2} />
      </div>
    </div>
    
    {/* Lower Data Value Matrix */}
    <div className="mt-4 flex items-baseline justify-between gap-2">
      <div className="text-[22px] font-semibold text-black tracking-wide tabular-nums leading-none">
        {value}
      </div>
      <span className={`text-[11px] font-medium tracking-wide flex items-center gap-1 ${
        trendUp ? 'text-[#00875a]' : 'text-[#de350b]'
      }`}>
        {trendUp ? <TrendingUp size={12} strokeWidth={2} /> : <TrendingDown size={12} strokeWidth={2} />}
        <span>{trend}</span>
      </span>
    </div>

  </div>
);