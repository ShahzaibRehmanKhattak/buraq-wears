"use client";
import React, { useState, useMemo } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/admin/Badges';

export function OrderTable({ orders = [], onOpenDetails, onStatusChange }) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order) return false;
      
      const rawStatus = order.status || 'Pending';
      const normalizedStatus = String(rawStatus).toLowerCase().trim();
      const normalizedTargetTab = selectedStatusTab.toLowerCase().trim();
      const matchesTab = selectedStatusTab === 'ALL' || normalizedStatus === normalizedTargetTab;

      const normalizedSearch = searchInput.toLowerCase().trim();
      const customerName = String(order.customer_name || '').toLowerCase();
      const customerEmail = String(order.customer_email || '').toLowerCase();
      const orderId = String(order.id || '').toLowerCase();
      const city = String(order.city || '').toLowerCase();

      const matchesSearch = normalizedSearch === '' || 
        orderId.includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        customerEmail.includes(normalizedSearch) ||
        city.includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [orders, searchInput, selectedStatusTab]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const getBadgeVariant = (status) => {
    switch (String(status).toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'default';
      case 'delivered': return 'success';
      default: return 'neutral';
    }
  };

  const renderPrioritizedOptions = (currentValue) => {
    const sorted = [...statusOptions].sort((a, b) => {
      if (a.toLowerCase() === String(currentValue).toLowerCase()) return -1;
      if (b.toLowerCase() === String(currentValue).toLowerCase()) return 1;
      return 0;
    });

    return sorted.map((opt) => (
      <option key={opt} value={opt} className="bg-white text-black font-medium">
        {opt}
      </option>
    ));
  };

  return (
    <div className="w-full flex flex-col text-black font-sans antialiased selection:bg-black/[0.06]">
      
      {/* ================= CONTROLS ROW ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#eeeeee] pb-4 gap-4 w-full">
        
        {/* Horizontal Navigation Grid Tabs */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {['ALL', ...statusOptions].map((statusOption) => {
              const isActive = selectedStatusTab.toLowerCase().trim() === statusOption.toLowerCase().trim();
              return (
                <button
                  key={statusOption}
                  onClick={() => { setSelectedStatusTab(statusOption); setCurrentPage(1); }}
                  className={`px-3 h-8 text-[12px] font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-black text-white' 
                      : 'text-[#555555] hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  {statusOption === 'ALL' ? 'All orders' : statusOption}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Context Input Field */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
          <input
            type="text"
            placeholder="Filter by name, ID, or city..."
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setCurrentPage(1); }}
            className="w-full pl-8 pr-3 h-8 text-[12px] bg-white border border-[#dddddd] rounded-md focus:outline-none focus:border-black transition-colors text-black placeholder-[#999999]"
          />
        </div>
      </div>

      {/* ================= MOBILE VIEW CARD DECKS ================= */}
      <div className="sm:hidden divide-y divide-[#eeeeee]">
        {paginatedOrders.length === 0 ? (
          <div className="text-center py-12 text-[#777777] text-[12px] font-medium bg-white">
            No items match this filter sequence.
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <div key={order.id} className="py-4 bg-white flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span onClick={() => onOpenDetails && onOpenDetails(order)} className="text-[11px] font-mono font-medium tracking-tight text-black bg-black/[0.04] px-1.5 py-0.5 rounded-sm inline-block hover:bg-black/[0.08] cursor-pointer">
                    #{String(order.id).substring(0, 8).toUpperCase()}
                  </span>
                  <h4 className="font-semibold text-[14px] text-black tracking-wide leading-tight">{order.customer_name}</h4>
                  <p className="text-[11px] text-[#555555]">
                    {order.order_items?.length || 0} units • {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[14px] font-semibold text-black tabular-nums">${Number(order.total_amount || 0).toFixed(2)}</div>
                  <div className="flex justify-end">
                    <Badge variant={getBadgeVariant(order.status)}>{order.status || 'Pending'}</Badge>
                  </div>
                </div>
              </div>

              {/* Action Ribbon Cluster */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onOpenDetails && onOpenDetails(order)} 
                  className="flex items-center justify-center gap-1.5 h-8 bg-white border border-[#dddddd] rounded-md text-black font-medium text-[12px] hover:bg-black/[0.02] transition-colors"
                >
                  <Eye size={13} /> Inspect
                </button>
                <div className="relative bg-white border border-[#dddddd] hover:border-black text-black rounded-md flex items-center justify-center overflow-hidden h-8 transition-colors">
                  <select
                    value={order.status || 'Pending'}
                    onChange={(e) => onStatusChange && onStatusChange(order.id, e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer bg-white text-black font-medium"
                  >
                    {renderPrioritizedOptions(order.status)}
                  </select>
                  <span className="flex items-center gap-1.5 font-medium text-[12px] pointer-events-none text-black">
                    Change status <ChevronDown size={12} strokeWidth={2} />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP WIRED SHEET MATRIX ================= */}
      <div className="hidden sm:block overflow-x-auto w-full bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#eeeeee]">
              <th className="py-3 text-[11px] font-semibold text-[#555555] tracking-wide w-28">Order Reference</th>
              <th className="py-3 text-[11px] font-semibold text-[#555555] tracking-wide">Customer Entity</th>
              <th className="py-3 text-[11px] font-semibold text-[#555555] tracking-wide w-32">Pipeline Flag</th>
              <th className="py-3 text-[11px] font-semibold text-[#555555] tracking-wide w-24">Volume</th>
              <th className="py-3 text-[11px] font-semibold text-[#555555] tracking-wide w-32">Total Price</th>
              <th className="py-3 text-[11px] font-semibold text-[#555555] tracking-wide text-right w-40">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eeeeee] text-[13px] text-black">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-[#777777] font-medium tracking-wide">
                  No records matching configuration rules discovered inside current trace.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const dateString = order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
                return (
                  <tr key={order.id} className="hover:bg-black/[0.01] transition-colors duration-700">
                    <td className="py-4 font-mono text-[12px] font-medium text-black">
                      <span onClick={() => onOpenDetails && onOpenDetails(order)} className="bg-black/[0.04] hover:bg-black/[0.08] px-2 py-0.5 cursor-pointer rounded-sm transition-colors">
                        #{String(order.id).substring(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-[13px] text-black tracking-wide">{order.customer_name}</div>
                      <div className="text-[11px] text-[#777777] font-normal mt-0.5">{dateString}</div>
                    </td>
                    <td className="py-4">
                      <Badge variant={getBadgeVariant(order.status)}>{order.status || 'Pending'}</Badge>
                    </td>
                    <td className="py-4 text-[#555555] font-normal">
                      {order.order_items?.length || 0} Units
                    </td>
                    <td className="py-4 font-medium text-black tabular-nums text-[13px]">
                      ${Number(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end items-center gap-2">
                        {/* Selected Option First Custom Context Menu Dropdown */}
                        <div className="relative bg-white border border-[#dddddd] hover:border-black text-black px-2.5 py-1 text-[12px] font-medium rounded-md h-8 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => onStatusChange && onStatusChange(order.id, e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer bg-white text-black font-medium"
                          >
                            {renderPrioritizedOptions(order.status)}
                          </select>
                          <span>Alter Status</span>
                          <ChevronDown size={12} strokeWidth={2} className="text-[#555555]" />
                        </div>
                        <button 
                          onClick={() => onOpenDetails && onOpenDetails(order)} 
                          className="p-2 border border-transparent hover:border-[#dddddd] text-[#555555] hover:text-black rounded-md transition-all"
                          title="View Node Metadata"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ALIGNMENT LINE ================= */}
      {filteredOrders.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 py-6 border-t border-[#eeeeee]">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1} 
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#dddddd] bg-white text-[#555555] hover:text-black hover:border-black transition-all disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft size={14} strokeWidth={2} />
          </button>
          <span className="text-[12px] font-medium text-black select-none tracking-wide">
            {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages} 
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#dddddd] bg-white text-[#555555] hover:text-black hover:border-black transition-all disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}