"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Plus, Home, Box, Settings, X, 
  RefreshCcw, Loader2, AlertCircle, Clock, Truck, CheckCircle
} from 'lucide-react';

import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';
import { MetricCard } from '@/components/admin/MetricCards';
import { BottomBar } from '@/components/admin/BottomBar';
import { OrderTable } from '@/components/admin/OrderTable';
import { OrderModal } from '@/components/admin/OrderModal';

function OrdersView({ orders, loading, error, onRefresh, onOpenDetails, onStatusChange }) {
  const metrics = useMemo(() => {
    const total = orders.length;
    let pending = 0;
    let shipped = 0;
    let delivered = 0;

    orders.forEach(o => {
      const s = String(o.status).toLowerCase();
      if (s === 'pending') pending++;
      else if (s === 'shipped') shipped++;
      else if (s === 'delivered') delivered++;
    });

    return { total, pending, shipped, delivered };
  }, [orders]);

  return (
    <div className="w-full space-y-6">
      {/* HEADER ACTION CONSOLE ZONE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#eeeeee] pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#777777]">Fulfillment Ops</span>
          <h1 className="text-[18px] font-semibold tracking-wide text-black mt-0.5">Orders Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="h-8 px-3 rounded-md border border-[#dddddd] bg-white text-[12px] font-medium flex items-center gap-1.5 hover:border-black transition-colors disabled:opacity-40 text-black"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Live Ledger
          </button>
        </div>
      </div>

      {/* STRATIFIED SYSTEM METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Orders" value={String(metrics.total)} icon={ShoppingBag} isPrimary trend="Live System" trendUp />
        <MetricCard title="Pending" value={String(metrics.pending)} icon={Clock} trend="Awaiting Action" trendUp={false} />
        <MetricCard title="Shipped" value={String(metrics.shipped)} icon={Truck} trend="In Logistics" trendUp />
        <MetricCard title="Delivered" value={String(metrics.delivered)} icon={CheckCircle} trend="Completed" trendUp />
      </div>

      {/* ERROR HANDLER LOGISTICS COMPONENT */}
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-[#de350b] text-[12px] font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#de350b]" />
          <p>Execution Failure: {error}. Verify admin workspace permissions manifest schema endpoints.</p>
        </div>
      ) : loading && orders.length === 0 ? (
        <div className="w-full h-64 border border-[#eeeeee] rounded-md bg-white flex flex-col items-center justify-center gap-2 text-[#777777]">
          <Loader2 className="w-5 h-5 animate-spin text-black" />
          <span className="text-[11px] font-medium tracking-wide">Assembling Ledger Document Matrices...</span>
        </div>
      ) : (
        <div className="w-full rounded-md border border-[#eeeeee] bg-white overflow-hidden">
          <OrderTable orders={orders} onOpenDetails={onOpenDetails} onStatusChange={onStatusChange} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrdersManifest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/orders');
      const payload = await res.json();
      if (!payload.success) throw new Error(payload.error || "Failed sequence lookup");
      setOrders(payload.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersManifest();
  }, []);

  const handleOrderStatusMutation = async (orderId, targetPayload) => {
    const normalizedPayload = typeof targetPayload === 'string' ? { status: targetPayload } : targetPayload;
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...normalizedPayload })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed database patch");
      
      setOrders(prevOrders => 
        prevOrders.map(ord => ord.id === orderId ? { ...ord, ...normalizedPayload } : ord)
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, ...normalizedPayload }));
      }
    } catch (err) {
      alert(`System Error: ${err.message}`);
    }
  };

  const openInspectionView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-black flex overflow-hidden font-sans antialiased selection:bg-black/[0.06]" suppressHydrationWarning>
      <style>{`
        body { letter-spacing: -0.01em; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* CORE SIDEBAR MODULE PANEL */}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* WORKSPACE APP RENDER FRAME */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <TopBar onMenuOpen={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar bg-white">
          <div className="w-full max-w-[1600px] mx-auto">
            <OrdersView 
              orders={orders} 
              loading={loading} 
              error={error} 
              onRefresh={fetchOrdersManifest} 
              onOpenDetails={openInspectionView} 
              onStatusChange={handleOrderStatusMutation} 
            />
          </div>
        </main>
        
        
      </div>

      {/* FULL RECORD MODAL VIEW DETAILED INSPECTOR */}
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedOrder(null); }} 
        order={selectedOrder} 
        onSaveStatus={handleOrderStatusMutation} 
      />

      {/* RESPONSIVE DRAWER OVERLAY NAVIGATION SYSTEM */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-[100] lg:hidden flex justify-start" onClick={() => setMobileMenuOpen(false)}>
           <div className="w-72 h-full bg-white p-6 border-r border-[#eeeeee] flex flex-col z-10 transition-transform duration-300 ease-out" onClick={e => e.stopPropagation()}>
              
              <div className="flex justify-between items-center border-b border-[#eeeeee] pb-4 mb-6">
                <div>
                  <h1 className="text-[14px] font-semibold tracking-wide uppercase text-black">IBNA ATELIER</h1>
                  <span className="text-[10px] uppercase font-medium text-[#777777]">Administration Portal</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors">
                  <X size={16} />
                </button>
              </div>

              <nav className="space-y-1 text-[13px] font-medium text-black">
                <button className="flex items-center gap-3 w-full h-9 px-2 rounded-md text-[#555555] hover:text-black hover:bg-black/[0.04] transition-colors">
                  <Home size={16} /> Overview
                </button>
                <button className="flex items-center gap-3 w-full h-9 px-2 rounded-md bg-black text-white transition-colors">
                  <ShoppingBag size={16} /> Orders
                </button>
                <button className="flex items-center gap-3 w-full h-9 px-2 rounded-md text-[#555555] hover:text-black hover:bg-black/[0.04] transition-colors">
                  <Box size={16} /> Inventory
                </button>
                <button className="flex items-center gap-3 w-full h-9 px-2 rounded-md text-[#555555] hover:text-black hover:bg-black/[0.04] transition-colors">
                  <Settings size={16} /> Settings
                </button>
              </nav>
              
           </div>
        </div>
      )}
    </div>
  );
}