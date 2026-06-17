"use client";
import React, { useState } from 'react';
import { 
  LayoutGrid, Search, TrendingUp, TrendingDown, Eye, Share2, 
  ShoppingCart, Receipt, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, Filter, User, Settings, LogOut
} from 'lucide-react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';
import { MetricCard } from '@/components/admin/MetricCards';
import { Badge } from '@/components/admin/Badges';
import { PerformanceSection } from '@/components/admin/PerformanceSection';
import { StatsGrid } from '@/components/admin/StatisticsGrid';
import { RevenueSection } from '@/components/admin/RevenueSection';

export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex overflow-hidden font-sans antialiased" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Sidebar Navigation Component */}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden border-l border-[#eeeeee]">
        {/* TopBar Infrastructure Node */}
        <TopBar onMenuOpen={() => setMobileMenuOpen(true)} />

        {/* Main Content Area Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-24 lg:pb-10 no-scrollbar bg-white">
          
          {/* CONTROL DASHBOARD HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#eeeeee]">
            <div>
              <h2 className="text-[20px] font-bold tracking-tight text-black uppercase">Platform Overview</h2>
              <p className="text-[#777777] text-[12px] font-medium mt-0.5">Welcome back! Here's what's happening today.</p>
            </div>
            
            {/* ACTION TRIGGERS MATRIX */}
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 rounded-md border border-[#dddddd] bg-white text-[11px] font-semibold uppercase tracking-wider text-[#555555] flex items-center gap-2 hover:border-black transition-colors">
                <Calendar size={14} /> Last 30 Days
              </button>
              <button className="h-9 px-4 rounded-md bg-black text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#222222] transition-colors">
                <Plus size={14} /> New Report
              </button>
            </div>
          </div>

          {/* Core Analytics Metric Matrices */}
          <div className="mb-6">
            <StatsGrid />
          </div>

          {/* Combined Performance & Revenue Graphs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceSection />
            </div>
            <div>
              <RevenueSection />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}