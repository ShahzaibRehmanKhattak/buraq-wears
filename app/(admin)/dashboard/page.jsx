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
    <div className="min-h-screen bg-[#f9fafb] text-[#111827] flex overflow-hidden font-sans" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Sidebar Component */}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TopBar Component */}
        <TopBar onMenuOpen={() => setMobileMenuOpen(true)} />

        {/* Main Content Area - Your Dashboard Structure */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-24 lg:pb-10 no-scrollbar">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">Platform Overview</h2>
              <p className="text-gray-500 text-sm font-medium">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <Calendar size={16} /> Last 30 Days
              </button>
              <button className="h-10 px-4 rounded-xl bg-black text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Plus size={16} /> New Report
              </button>
            </div>
          </div>

          {/* Statistics Grid Component */}
          <StatsGrid />

          {/* Graphs & Detailed Data Sections */}
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

      {/* Mobile Menu Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setMobileMenuOpen(false)}>
           <div 
             className="w-72 h-full bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col" 
             onClick={e => e.stopPropagation()}
           >
              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold tracking-tight">IBNA Admin</h1>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Commerce Pro</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <button className="flex items-center gap-3 w-full p-4 rounded-xl font-semibold bg-black text-white shadow-lg shadow-black/10">
                <LayoutGrid size={20} /> Dashboard
              </button>
           </div>
        </div>
      )}
    </div>
  );
}