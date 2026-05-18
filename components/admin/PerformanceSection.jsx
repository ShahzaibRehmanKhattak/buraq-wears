import { useState } from 'react';
import { Filter } from 'lucide-react';
import { GlassCard } from './GlassCard';
const PLATFORMS = [
  { name: 'Shopee', value: '200.9k', trend: '12% ↓', trendUp: false },
  { name: 'Tokopedia', value: '90.12k', trend: '80% ↑', trendUp: true },
  { name: 'Amazon', value: '65.74k', trend: '71% ↑', trendUp: true },
  { name: 'Lazada', value: '55.12k', trend: '10% ↓', trendUp: false },
];


export const PerformanceSection = () => (
  <GlassCard className="p-6 md:p-8 space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Platform Performance</h3>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-tighter">Cross-channel engagement</p>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Filter size={18} /></button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {PLATFORMS.map((platform, idx) => (
        <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-white/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-[9px] uppercase font-black">{platform.name}</span>
            <span className={`text-[9px] font-bold ${platform.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>{platform.trend}</span>
          </div>
          <div className="text-md font-bold text-black">{platform.value}</div>
        </div>
      ))}
    </div>

    <div className="relative h-48 md:h-64 w-full pt-10">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.08" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,80 Q50,70 100,85 T200,40 T300,20 T400,10 L400,100 L0,100 Z" fill="url(#areaGradient)" />
        <path d="M0,80 Q50,70 100,85 T200,40 T300,20 T400,10" fill="none" stroke="black" strokeLinecap="round" strokeWidth="2.5" />
        <circle cx="300" cy="20" fill="black" r="5" stroke="white" strokeWidth="3" />
      </svg>
    </div>
  </GlassCard>
);