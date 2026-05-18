import { useState } from 'react';
import { 
  LayoutGrid, Search, TrendingUp, TrendingDown, Eye, Share2, 
  ShoppingCart, Receipt, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, Filter, User, Settings, LogOut
} from 'lucide-react';
import { GlassCard } from './GlassCard';
export const MetricCard = ({ title, value, trend, trendUp, icon: Icon, isPrimary = false }) => (
  <GlassCard className="p-5 flex flex-col justify-between min-h-[140px] group transition-all hover:-translate-y-1 hover:shadow-md">
    <div className="flex justify-between items-start">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isPrimary ? 'bg-black text-white' : 'bg-gray-100 text-black group-hover:bg-black group-hover:text-white'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trend}
      </span>
    </div>
    <div className="mt-4">
      <div className="text-2xl font-bold text-black tracking-tight tabular-nums">{value}</div>
      <div className="text-gray-400 text-[9px] uppercase tracking-widest font-bold">{title}</div>
    </div>
  </GlassCard>
);