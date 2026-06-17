"use client";
import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle, ShoppingBag, Truck, User, CreditCard, ChevronDown } from 'lucide-react';

export function OrderModal({ isOpen, onClose, onSaveStatus, order = null }) {
  const [isSaving, setIsSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Pending');
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const triggerToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 4000);
  };

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status || 'Pending');
    }
    setIsSaving(false);
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    triggerToast("Updating order status...", "info");
    try {
      await onSaveStatus(order.id, { status: currentStatus });
      triggerToast("Order status updated successfully.", "success");
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      triggerToast(`Error updating order: ${err.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[200] p-4 font-sans antialiased">
      
      {/* ================= NOTIFICATION TOAST SYSTEM ================= */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[210] flex items-center gap-2.5 px-4 py-3 rounded-md bg-white border border-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-black transition-all">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00875a]" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#de350b]" />}
          {toast.type === 'info' && <Loader2 className="w-4 h-4 text-[#555555] animate-spin" />}
          <span className="text-[12px] font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* ================= MODAL SURFACE BODY ================= */}
      <div className="bg-white rounded-md w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-black/10 flex flex-col no-scrollbar shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        
        {/* Modal Header Panel */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#eeeeee] sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-[15px] font-semibold text-black tracking-wide">
              Order #{String(order.id).substring(0, 8).toUpperCase()}
            </h3>
            <p className="text-[11px] text-[#777777] font-normal mt-0.5">
              Review line items, destination parameters, and system fulfillment updates.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSaving} 
            className="p-1.5 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Main Info Body Layer */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Metadata Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-[#eeeeee] p-4 rounded-md bg-white">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#666666] mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Customer Profile
              </h4>
              <div className="space-y-1 text-[12px]">
                <p className="font-semibold text-black">{order.customer_name}</p>
                <p className="text-[#555555] font-normal">{order.customer_email}</p>
                <p className="text-[#777777] font-normal">{order.phone || 'No phone record provided'}</p>
              </div>
            </div>

            <div className="border border-[#eeeeee] p-4 rounded-md bg-white">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#666666] mb-3 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Shipping Destination
              </h4>
              <div className="space-y-1 text-[12px]">
                <p className="font-semibold text-black">{order.shipping_address}</p>
                <p className="text-[#555555] font-normal">{order.city}{order.postal_code ? `, ${order.postal_code}` : ''}</p>
                <div className="mt-2 inline-block text-[10px] font-medium tracking-wide bg-black/[0.04] text-black px-2 py-0.5 rounded-sm">
                  Method: {order.payment_method || 'COD'}
                </div>
              </div>
            </div>
          </div>

          {/* Table Framework Grid */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#666666] mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Line Items
            </h4>
            <div className="border border-[#eeeeee] rounded-md overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#fcfcfc] border-b border-[#eeeeee] text-[#666666] font-semibold text-[11px] tracking-wide">
                    <th className="py-2.5 px-4 w-1/2">Product Description</th>
                    <th className="py-2.5 px-4 text-center w-16">Size</th>
                    <th className="py-2.5 px-4 text-center w-16">Qty</th>
                    <th className="py-2.5 px-4 text-right w-24">Unit Rate</th>
                    <th className="py-2.5 px-4 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee] text-black font-normal">
                  {order.order_items?.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="py-3 px-4 font-medium flex items-center gap-3">
                        {item.image_url && (
                          <img src={item.image_url} alt="" className="w-7 h-7 rounded-sm object-cover bg-[#fcfcfc] border border-[#eeeeee]" />
                        )}
                        <span className="tracking-wide text-black">{item.product_title || 'Store Inventory Item'}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-[#555555]">{item.size || 'M'}</td>
                      <td className="py-3 px-4 text-center font-medium text-black">{item.quantity}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-[#555555]">${Number(item.price || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-black tabular-nums">${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Balance Sheet Matrix */}
            <div className="flex justify-end mt-3">
              <div className="w-64 border border-[#eeeeee] bg-[#fcfcfc] px-4 py-2.5 rounded-md text-[12px]">
                <div className="flex justify-between font-semibold text-black">
                  <span>Gross Remittance:</span>
                  <span className="font-bold text-[13px] text-black tabular-nums">${Number(order.total_amount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Form Update Action System */}
          <form onSubmit={handleSubmit} className="border-t border-[#eeeeee] pt-5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#666666] mb-3 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Pipeline Controller
            </h4>
            <div className="max-w-xs">
              <label className="block text-[11px] font-semibold text-[#555555] mb-1.5 tracking-wide">Fulfillment Status Flag</label>
              <div className="relative w-full">
                <select 
                  required 
                  value={currentStatus} 
                  onChange={e => setCurrentStatus(e.target.value)}
                  className="w-full appearance-none h-8 pl-3 pr-8 text-[12px] font-medium bg-white border border-[#dddddd] rounded-md focus:outline-none focus:border-black text-black transition-colors"
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt} className="bg-white text-black font-medium">{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none" strokeWidth={2} />
              </div>
            </div>

            {/* Cancel / Confirm Interface Triggers */}
            <div className="flex items-center justify-end gap-2 mt-6 border-t border-[#eeeeee] pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isSaving} 
                className="px-3 h-8 text-[12px] font-medium border border-[#dddddd] bg-white rounded-md text-[#555555] hover:text-black hover:border-black transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-3 h-8 text-[12px] font-medium bg-black text-white rounded-md hover:bg-neutral-900 transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}