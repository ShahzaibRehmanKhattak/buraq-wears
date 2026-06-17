import { useState } from 'react';
import { Filter } from 'lucide-react';

const PLATFORMS = [
  { name: 'Shopee', value: '200.9k', trend: '12% ↓', trendUp: false },
  { name: 'Tokopedia', value: '90.12k', trend: '80% ↑', trendUp: true },
  { name: 'Amazon', value: '65.74k', trend: '71% ↑', trendUp: true },
  { name: 'Lazada', value: '55.12k', trend: '10% ↓', trendUp: false },
];

export const PerformanceSection = () => (
  <div className="w-full flex flex-col border border-[#eeeeee] p-5 bg-white font-sans antialiased text-black">
    
    {/* SECTION CONTROL HEADER */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="text-[14px] font-bold uppercase tracking-wider text-black">Platform Performance</h3>
        <p className="text-[#777777] text-[11px] font-medium uppercase tracking-tight mt-0.5">Cross-channel engagement</p>
      </div>
      <button className="p-1.5 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors">
        <Filter size={15} />
      </button>
    </div>

    {/* PERFORMANCE GRID OVERVIEW */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {PLATFORMS.map((platform, idx) => (
        <div key={idx} className="p-3 rounded-md border border-[#eeeeee] bg-white">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#666666] text-[10px] uppercase font-bold tracking-wider">{platform.name}</span>
            <span className={`text-[10px] font-bold ${platform.trendUp ? 'text-green-700' : 'text-[#de350b]'}`}>
              {platform.trend}
            </span>
          </div>
          <div className="text-[16px] font-semibold tracking-tight text-black">{platform.value}</div>
        </div>
      ))}
    </div>

    {/* VECTOR DATA GRAPH INFRASTRUCTURE */}
    <div className="relative h-44 md:h-52 w-full pt-4 border-t border-[#eeeeee]">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.04" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Solid Vector Path Geometry */}
        <path d="M0,80 Q50,70 100,85 T200,40 T300,20 T400,10 L400,100 L0,100 Z" fill="url(#areaGradient)" />
        <path d="M0,80 Q50,70 100,85 T200,40 T300,20 T400,10" fill="none" stroke="black" strokeLinecap="square" strokeWidth="1.5" />
        
        {/* Metric Intersection Node indicator */}
        <circle cx="300" cy="20" fill="black" r="4" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  </div>
);