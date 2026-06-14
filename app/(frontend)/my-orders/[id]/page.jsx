"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderItemRow({ item, generateProductSlug }) {
  const [liveProduct, setLiveProduct] = useState(null);
  const actualProductId = item?.product_id || item?.item_id || item?.id;

  useEffect(() => {
    if (actualProductId && actualProductId !== "undefined") {
      fetch(`/api/products?search=${actualProductId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Network response error checking catalog path");
          return res.json();
        })
        .then((res) => {
          const productsArray = res?.data || [];
          if (productsArray.length > 0) {
            setLiveProduct(productsArray[0]);
          }
        })
        .catch((err) => console.error("Handled product query lookup recovery fallback:", err));
    }
  }, [actualProductId]);

  const displayTitle = liveProduct?.title || item?.product_title || item?.title || item?.name || "Premium Selection";
  const productImages = liveProduct?.images || item?.images || item?.image_url || item?.image;
  let targetImgSrc = null;

  if (Array.isArray(productImages) && productImages.length > 0) {
    targetImgSrc = productImages[0];
  } else if (typeof productImages === 'string' && productImages.trim() !== '') {
    if (productImages.startsWith('[') || productImages.startsWith('{')) {
      try {
        const cleanJson = productImages.replace(/^\{|\}$/g, '[').replace(/\'/g, '"');
        const parsedArr = JSON.parse(cleanJson);
        if (Array.isArray(parsedArr)) targetImgSrc = parsedArr[0];
      } catch (e) {
        targetImgSrc = productImages;
      }
    } else {
      targetImgSrc = productImages;
    }
  }

  const productRoute = generateProductSlug({
    product_title: displayTitle,
    product_id: actualProductId
  });

  return (
    <div className="flex items-start md:items-center justify-between gap-4 py-4 md:py-6">
      <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
        <Link 
          href={productRoute}
          className="w-16 h-20 md:w-20 md:h-24 bg-[#f3f3f4] border border-black/[0.04] flex items-center justify-center shrink-0 overflow-hidden hover:opacity-90 transition-all rounded-sm cursor-pointer group/img relative"
        >
          {targetImgSrc ? (
            <img 
              src={targetImgSrc} 
              alt={displayTitle} 
              className="w-full h-full object-cover group-hover/img:scale-102 transition-transform duration-500" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="material-symbols-outlined text-[20px] text-neutral-400">inventory_2</span>';
              }}
            />
          ) : (
            <span className="material-symbols-outlined text-[20px] text-neutral-400">inventory_2</span>
          )}
        </Link>
        
        <div className="min-w-0 flex-1">
          <Link 
            href={productRoute}
            className="text-[12px] md:text-[13px] font-semibold text-black uppercase tracking-wide truncate block hover:text-neutral-600 transition-colors cursor-pointer"
          >
            {displayTitle}
          </Link>
          
          <div className="text-[10px] md:text-[11px] text-[#777777] font-medium tracking-wide mt-1.5 space-y-0.5 uppercase">
            <p>Size: <span className="text-black font-semibold">{item?.size || 'M'}</span></p>
            <p>Qty: <span className="text-black font-semibold">{item?.quantity || 1}</span></p>
          </div>

          <p className="text-[11px] font-medium text-black font-mono mt-1.5 md:hidden">
            €{Number(item?.price || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <span className="hidden md:block text-[13px] font-medium text-black font-mono shrink-0">
        €{Number(item?.price || 0).toFixed(2)}
      </span>
    </div>
  );
}

export default function OrderDetailsPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetailedOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId.toUpperCase()}`);
        if (!res.ok) throw new Error("Could not find an order matching this reference ID.");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchDetailedOrder();
  }, [orderId]);

  const generateProductSlug = (item) => {
    const title = item?.product_title || item?.title || item?.name || "piece";
    const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `/${cleanSlug}-${item?.product_id || item?.id || 0}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center text-[#111111] gap-3">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <span className="material-symbols-outlined text-[24px] animate-spin">refresh</span>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Syncing Invoice Ledger...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center text-center p-4">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <span className="material-symbols-outlined text-[32px] text-neutral-400 mb-2">gpp_maybe</span>
        <h2 className="text-[11px] font-bold text-black uppercase tracking-[0.15em]">Tracking Mismatch</h2>
        <p className="text-[11px] text-[#777777] max-w-xs mt-2 font-light">{error || "Data load configuration exception."}</p>
        <button 
          onClick={() => router.push('/my-orders')} 
          className="mt-6 h-10 px-6 bg-[#111111] text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* ⚡ FIXED PADDING FOR COMPACT MOBILE SCREENS */}
      <main className="pt-6 md:pt-16 px-4 md:px-16 max-w-[1440px] mx-auto w-full box-border overflow-x-hidden">
        
        {/* Back navigation line */}
        <br />
        <button 
          onClick={() => router.push('/my-orders')}
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#777777] hover:text-black transition-colors mb-6 md:mb-8 group pt-2"
        >
            
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
          Back to Orders
        </button>

        {/* Top Summary Info Card Grid layout handles tiny sizes now */}
        <div className="bg-white border border-black/[0.06] rounded-sm p-4 md:p-6 mb-6 md:mb-8 grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4 md:gap-4 text-[11px] md:text-xs">
          <div>
            <p className="text-[#777777] uppercase text-[9px] md:text-[10px] tracking-wider font-medium">Order Placed</p>
            <p className="font-medium mt-1 text-black">
              {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[#777777] uppercase text-[9px] md:text-[10px] tracking-wider font-medium">Total Amount</p>
            <p className="font-semibold mt-1 text-black font-mono">€{Number(order.total_amount).toFixed(2)}</p>
          </div>
          <div className="min-w-0">
            <p className="text-[#777777] uppercase text-[9px] md:text-[10px] tracking-wider font-medium">Ship To</p>
            <p className="font-medium mt-1 text-black uppercase tracking-tight truncate w-full" title={order.customer_name}>
              {order.customer_name}
            </p>
          </div>
          <div className="col-span-1 md:text-right flex flex-col md:items-end justify-center min-w-0">
            <p className="text-[#777777] uppercase text-[9px] md:text-[10px] tracking-wider font-medium">Reference ID</p>
            <p className="font-bold mt-0.5 text-black uppercase tracking-wider truncate w-full md:w-auto">#{order.id}</p>
          </div>
        </div>

        {/* Main Content Splitting Block */}
        <div className="grid grid-cols-12 gap-y-6 lg:gap-16 items-start">
          
          {/* Order Manifest List */}
          <div className="col-span-12 lg:col-span-7 flex flex-col space-y-4 md:space-y-6">
            <div className="border border-black/[0.06] bg-white p-4 flex items-center justify-between rounded-sm">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${
                  order.status === 'Cancelled' ? 'bg-red-500' :
                  order.status === 'Pending' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-black">
                  Current Status: {order.status}
                </h3>
              </div>
            </div>

            <div className="border border-black/[0.06] bg-white rounded-sm divide-y divide-black/[0.06] px-4 md:px-6">
              {order.items?.map((item) => (
                <OrderItemRow 
                  key={item.id} 
                  item={item} 
                  generateProductSlug={generateProductSlug} 
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar Logistics Panels */}
          <div className="col-span-12 lg:col-span-5 space-y-4 md:space-y-6">
            <div className="bg-white border border-black/[0.06] p-4 md:p-6 rounded-sm">
              <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black border-b border-black/[0.06] pb-2.5 mb-3.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span> 
                Shipping Information
              </h3>
              <div className="text-[12px] text-[#333333] space-y-0.5 font-light leading-relaxed">
                <p className="font-semibold text-black uppercase tracking-wide text-[11px] mb-1">
                  {order.customer_name}
                </p>
                <p>{order.shipping_address}</p>
                <p className="uppercase tracking-wide">
                  {order.city}, {order.postal_code}
                </p>
                {order.phone && <p className="text-[#777777] pt-1 font-mono text-[11px]">Tel: {order.phone}</p>}
              </div>
            </div>

            <div className="bg-white border border-black/[0.06] p-4 md:p-6 rounded-sm">
              <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black border-b border-black/[0.06] pb-2.5 mb-3.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">credit_card</span> 
                Payment Terms
              </h3>
              <div className="text-[12px] text-[#333333] font-light">
                <p className="font-semibold text-black uppercase tracking-wide text-[11px]">
                  {order.payment_method === 'COD' ? 'Cash On Delivery' : order.payment_method}
                </p>
                <p className="mt-1 text-[#777777] leading-relaxed text-[11px]">
                  {order.payment_method === 'COD' 
                    ? 'Please settle payment totals in full cash directly with your courier service professional upon destination drop-off clearance.' 
                    : 'Transaction cleared securely via digital transaction processing parameters.'}
                </p>
              </div>
            </div>

            <div className="bg-white border border-black/[0.06] p-4 md:p-6 rounded-sm">
              <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black border-b border-black/[0.06] pb-2.5 mb-3.5">
                Financial Breakdown
              </h3>
              <div className="space-y-2.5 text-[12px]">
                <div className="flex justify-between items-center font-light text-[#555555]">
                  <span>Items Subtotal</span>
                  <span className="font-mono">€{Number(order.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-light text-[#555555]">
                  <span>Shipping & Delivery</span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-600">Complimentary</span>
                </div>
                <div className="border-t border-black/[0.06] pt-3.5 mt-1.5 flex justify-between items-baseline">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-black">Grand Total</span>
                  <span className="text-[16px] md:text-[18px] font-semibold font-mono text-black">
                    €{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}