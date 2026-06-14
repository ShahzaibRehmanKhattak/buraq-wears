"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, X, AlertCircle, ShoppingBag, Loader2, Check, Clock, ArrowLeft, ChevronRight, AlertTriangle } from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const [userOrders, setUserOrders] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [componentLoading, setComponentLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    async function syncProfileOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const json = await res.json();
          setUserOrders(json.orders || []);
          setIsUserLoggedIn(true);
        } else if (res.status === 401) {
          setIsUserLoggedIn(false);
          router.push('/login?redirect=/my-orders');
        }
      } catch (err) {
        console.error("Dashboard synchronization error:", err.message);
      } finally {
        setComponentLoading(false);
      }
    }
    syncProfileOrders();
  }, [router]);

  const openConfirmationModal = (e, orderId) => {
    e.stopPropagation(); 
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const executeCancellation = async () => {
    if (!selectedOrderId) return;
    
    const targetId = selectedOrderId;
    setModalOpen(false); 
    setIsCancelling(targetId);
    setFeedback({ text: '', type: '' });

    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: targetId })
      });

      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Cancellation rejected.");

      setFeedback({ text: 'Order successfully cancelled.', type: 'success' });
      setUserOrders(prev => prev.map(o => o.id === targetId ? { ...o, status: 'Cancelled' } : o));
    } catch (err) {
      setFeedback({ text: err.message, type: 'error' });
    } finally {
      setIsCancelling(null);
      setSelectedOrderId(null);
    }
  };

  if (componentLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-black stroke-[1.5]" size={28} />
        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Syncing Orders...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pt-28 md:pt-36 pb-32 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header Title Area */}
        <div className="mb-8 md:mb-12 border-b border-black/[0.06] pb-5">
          <h1 className="text-[22px] md:text-[32px] font-semibold tracking-tight uppercase text-black">Order History</h1>
          <p className="text-[10px] text-[#777777] uppercase tracking-wider mt-1 font-medium">
            Manage, review, and track past and active shipments.
          </p>
        </div>

        {/* Global Feedback Banner */}
        {feedback.text && (
          <div className={`mb-6 p-4 border text-[11px] font-semibold uppercase tracking-wider rounded-sm flex items-center justify-between gap-3 ${
            feedback.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-700'
          }`}>
            <div className="flex items-center gap-2.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback({ text: '', type: '' })} className="hover:opacity-70 transition-opacity">
              <X size={14} />
            </button>
          </div>
        )}

        {userOrders.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            
            {/* Desktop Headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 border-b border-black/[0.04]">
              <div className="col-span-3">Order ID</div>
              <div className="col-span-3">Date Registered</div>
              <div className="col-span-2">Total Price</div>
              <div className="col-span-2">Logistics Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Orders Map Container */}
            {userOrders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => router.push(`/my-orders/${order.id}`)}
                className="bg-white border border-black/[0.05] rounded-sm hover:border-black/20 transition-all duration-300 cursor-pointer group shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              >
                {/* Responsive Content Mesh Grid */}
                <div className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-12 gap-3.5 md:gap-4 md:items-center">
                  
                  {/* Row Element 1: Order Reference */}
                  <div className="md:col-span-3 flex justify-between items-center md:block">
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider md:hidden">Order ID</span>
                    <p className="text-[12px] md:text-[13px] font-bold text-black uppercase tracking-wide">#{order.id}</p>
                  </div>

                  {/* Row Element 2: Date Stamp */}
                  <div className="md:col-span-3 flex justify-between items-center md:block border-t border-black/[0.03] pt-2.5 md:pt-0 md:border-none">
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider md:hidden">Date</span>
                    <p className="text-[11px] md:text-[12px] font-medium text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Row Element 3: Price Aggregation */}
                  <div className="md:col-span-2 flex justify-between items-center md:block border-t border-black/[0.03] pt-2.5 md:pt-0 md:border-none">
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider md:hidden">Total</span>
                    <p className="text-[12px] md:text-[13px] font-semibold text-black font-mono">€{Number(order.total_amount).toFixed(2)}</p>
                  </div>

                  {/* Row Element 4: Life Cycle Status Badge */}
                  <div className="md:col-span-2 flex justify-between items-center md:block border-t border-black/[0.03] pt-2.5 md:pt-0 md:border-none">
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider md:hidden">Status</span>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-wider uppercase ${
                      order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100/30' :
                      order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-100/30'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        order.status === 'Cancelled' ? 'bg-rose-500' :
                        order.status === 'Pending' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {order.status}
                    </div>
                  </div>

                  {/* Row Element 5: Action Interface Controllers */}
                  <div className="md:col-span-2 border-t border-black/[0.03] pt-3.5 md:pt-0 md:border-none mt-1 md:mt-0">
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full">

                      {/* Mobile Only: See Details text link anchor */}
                      <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-black border-b border-black/30 pb-0.5">
                        See Details
                      </span>

                      {/* Cancel Button: Standard inline placement on desktop / Docked right on mobile */}
                      {order.status === 'Pending' ? (
                        <button
                          onClick={(e) => openConfirmationModal(e, order.id)}
                          disabled={isCancelling === order.id}
                          className="text-[9px] font-bold uppercase tracking-wider text-rose-600 hover:text-white transition-all px-3 h-8 rounded-sm border border-rose-200 bg-white hover:bg-rose-600 disabled:opacity-40 flex items-center justify-center md:h-8"
                        >
                          {isCancelling === order.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <>Cancel Order</>
                          )}
                        </button>
                      ) : (
                        <div className="hidden md:block w-20" />
                      )}

                      {/* Desktop Only Navigation Arrow element pointer */}
                      <div className="h-7 w-7 items-center justify-center text-neutral-300 group-hover:text-black transition-colors hidden md:flex ml-2">
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5 duration-300" />
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Layout */
          <div className="text-center py-20 bg-white border border-black/[0.06] rounded-sm p-8 max-w-sm mx-auto mt-12">
            <div className="w-12 h-12 bg-[#f3f3f4] border border-black/[0.04] text-[#111111] flex items-center justify-center rounded-sm mx-auto mb-4">
              <ShoppingBag size={18} className="stroke-[1.5]" />
            </div>
            <h3 className="text-[12px] font-bold text-black uppercase tracking-widest">No history logs</h3>
            <p className="text-[11px] text-[#777777] mt-1 max-w-xs mx-auto leading-relaxed">
              You haven't checked out any active selection purchases yet.
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="mt-6 inline-flex h-10 px-6 bg-[#111111] text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors rounded-sm items-center gap-2"
            >
              <ArrowLeft size={12} /> Return to Shop
            </button>
          </div>
        )}
      </div>

      {/* Luxury Minimalist Confirmation Overlay Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity" 
            onClick={() => setModalOpen(false)}
          />
          
          <div className="relative bg-white w-full max-w-[360px] p-5 rounded-sm border border-black/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.12)] transform scale-100 transition-all duration-200">
            <div className="flex flex-col text-center items-center">
              <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 mb-3">
                <AlertTriangle className="text-rose-500" size={16} />
              </div>
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-black">Cancel Order</h3>
              <p className="text-[11px] text-[#777777] mt-2 leading-relaxed font-light">
                Are you sure you want to cancel order <span className="font-semibold font-mono text-black">#{selectedOrderId}</span>? This action cannot be undone.
              </p>
            </div>

            {/* Action Dialog Controls */}
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-black/[0.05] pt-3.5">
              <button
                onClick={() => setModalOpen(false)}
                className="h-8 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-black border border-neutral-200 rounded-sm transition-colors bg-white"
              >
                Keep Order
              </button>
              <button
                onClick={executeCancellation}
                className="h-8 text-[10px] font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-sm transition-colors shadow-sm"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}