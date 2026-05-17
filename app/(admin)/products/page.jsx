"use client";
import React, { useState } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Eye, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, User, Settings, Package, 
  AlertTriangle, Layers, Edit3, Trash2, ChevronRight,
  ShoppingBag, Home, Box
} from 'lucide-react';

import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';
import { BottomBar } from '@/components/admin/BottomBar';
import { MetricCard } from '@/components/admin/MetricCards';
import { Badge } from '@/components/admin/Badges';
import { GlassCard } from '@/components/admin/GlassCard';

const ProductMobileCard = ({ product }) => (
  <GlassCard className="p-4 mb-4 md:hidden overflow-hidden border-gray-100/80">
    <div className="flex gap-4 items-start mb-4">
      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base text-black leading-tight tracking-tight mb-1">{product.name}</h3>
          <Badge variant={product.stockStatus === 'Low Stock' ? 'warning' : product.stockStatus === 'Out of Stock' ? 'error' : 'success'}>
            {product.stockStatus}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-bold">{product.sku}</span>
          <span className="text-sm font-black text-black">${product.price}</span>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3">
      <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-gray-600 font-bold text-[11px] hover:bg-gray-100 transition-colors uppercase tracking-wider">
        <Eye size={14} /> View
      </button>
      <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-gray-600 font-bold text-[11px] hover:bg-gray-100 transition-colors uppercase tracking-wider">
        <Edit3 size={14} /> Edit
      </button>
      <button className="flex items-center justify-center gap-2 py-2.5 bg-red-50 rounded-xl text-red-500 font-bold text-[11px] hover:bg-red-100 transition-colors uppercase tracking-wider">
        <Trash2 size={14} /> Del
      </button>
    </div>
  </GlassCard>
);

const ProductDesktopTable = ({ products }) => (
  <div className="hidden md:block overflow-hidden border border-gray-100 rounded-3xl bg-white shadow-xl shadow-black/[0.02]">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50 border-b border-gray-100">
        <tr>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Product Entry</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Stock SKU</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Availability</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Unit Price</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400 text-right">Management</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {products.map((product, idx) => (
          <tr key={idx} className="hover:bg-gray-50/40 transition-all group">
            <td className="px-8 py-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <div className="font-bold text-sm text-black">{product.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Physical Stock</div>
                </div>
              </div>
            </td>
            <td className="px-8 py-5">
              <span className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter bg-gray-100 px-2 py-1 rounded-lg">{product.sku}</span>
            </td>
            <td className="px-8 py-5">
              <Badge variant={product.stockStatus === 'Low Stock' ? 'warning' : product.stockStatus === 'Out of Stock' ? 'error' : 'success'}>
                {product.stockStatus}
              </Badge>
            </td>
            <td className="px-8 py-5 font-black text-sm text-black tabular-nums">${product.price}</td>
            <td className="px-8 py-5">
              <div className="flex justify-end gap-2">
                <button title="View" className="p-2.5 bg-transparent hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all"><Eye size={18} /></button>
                <button title="Edit" className="p-2.5 bg-transparent hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all"><Edit3 size={18} /></button>
                <button title="Delete" className="p-2.5 bg-transparent hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProductsView = () => {
  const products = [
    { name: 'Essential White Tee', sku: 'IBNA-001', price: '45.00', stockStatus: 'In Stock', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300' },
    { name: 'Tailored Noir Blazer', sku: 'IBNA-042', price: '210.00', stockStatus: 'Low Stock', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300' },
    { name: 'Mono-Tech Runner', sku: 'IBNA-099', price: '135.00', stockStatus: 'Out of Stock', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300' },
    { name: 'Heavy Cotton Hoodie', sku: 'IBNA-112', price: '85.00', stockStatus: 'In Stock', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">Master Inventory</h2>
          <p className="text-gray-500 text-sm font-medium">Global stock levels and SKU performance tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Calendar size={16} /> Filter Stock
          </button>
          <button className="hidden md:flex h-10 px-4 rounded-xl bg-black text-white text-sm font-semibold items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {/* Metrics Section using exact provided design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <MetricCard title="Total Assets" value="1,284" icon={Package} isPrimary trend="12.4%" trendUp />
        <MetricCard title="Low Stock Alerts" value="12" icon={AlertTriangle} trend="3.2%" trendUp={false} />
        <MetricCard title="Active Collections" value="48" icon={Layers} trend="2.1%" trendUp />
        <MetricCard title="Turnover Rate" value="84%" icon={TrendingUp} trend="8.4%" trendUp />
      </div>

      {/* List Section */}
      <div className="mb-10">
        <ProductDesktopTable products={products} />
        <div className="md:hidden space-y-4">
          {products.map((p, idx) => (
            <ProductMobileCard key={idx} product={p} />
          ))}
        </div>
      </div>

      {/* Professional Pagination Structure */}
      <div className="flex justify-center items-center gap-6 py-12 border-t border-gray-100">
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all group active:scale-90">
          <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Vault 01/12</span>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all group active:scale-90">
          <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111827] flex overflow-hidden font-sans selection:bg-black selection:text-white" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar onMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 lg:pb-12 no-scrollbar bg-gradient-to-b from-white to-[#fafafa]">
          <ProductsView />
        </main>
        <BottomBar />
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <button className="fixed bottom-24 right-6 lg:hidden w-14 h-14 bg-black text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center active:scale-90 transition-all z-40 border-4 border-white/20">
        <Plus size={28} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setMobileMenuOpen(false)}>
           <div className="w-80 h-full bg-white p-8 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 ease-out" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-12">
                <div className="flex flex-col">
                  <h1 className="text-xl font-black tracking-tighter uppercase">IBNA</h1>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 rounded-2xl"><X size={20} /></button>
              </div>
              <nav className="space-y-3">
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold text-gray-400 hover:bg-gray-50"><Home size={22} /> Dashboard</button>
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold bg-black text-white shadow-xl shadow-black/10"><Box size={22} /> Inventory</button>
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold text-gray-400 hover:bg-gray-50"><ShoppingBag size={22} /> Orders</button>
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold text-gray-400 hover:bg-gray-50"><Settings size={22} /> Settings</button>
              </nav>
           </div>
        </div>
      )}
    </div>
  );
}