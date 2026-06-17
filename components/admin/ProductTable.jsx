"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Edit3, Trash2, Image as ImageIcon, Search, ChevronLeft, ChevronRight, Table2 } from 'lucide-react';

export function ProductTable({ products = [], categories = [], onEdit, onDelete }) {
  // Search and Filter State Management
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reduced down to a standard 300ms delay to keep the interface highly responsive
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchInput]);

  // Fallback System: Dynamically build categories from array structures if needed
  const finalTabsList = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map(cat => (cat.name || cat.title || String(cat)).trim()).filter(Boolean);
    }
    
    const uniqueCats = new Set();
    products.forEach(product => {
      if (!product) return;
      const catName = product.category_id || product.categoryId || product.category;
      if (catName) {
        uniqueCats.add(String(catName).trim());
      }
    });
    return Array.from(uniqueCats);
  }, [categories, products]);

  // Filter Pipeline: Handles real-time cross-tab query parsing
  const filteredProducts = useMemo(() => {
    setCurrentPage(1);
    
    return products.filter((product) => {
      if (!product) return false;

      const rawProductCat = product.category_id || product.categoryId || product.category || '';
      const normalizedProductCat = String(rawProductCat).toLowerCase().trim();
      const normalizedTargetTab = selectedCategoryTab.toLowerCase().trim();
      
      const matchesTab = selectedCategoryTab === 'ALL' || normalizedProductCat === normalizedTargetTab;
      
      const normalizedSearch = debouncedSearch.toLowerCase().trim();
      const matchesSearch = normalizedSearch === '' || 
        (product.title && product.title.toLowerCase().includes(normalizedSearch)) ||
        (product.name && product.name.toLowerCase().includes(normalizedSearch)) ||
        (product.sku && product.sku.toLowerCase().includes(normalizedSearch)) ||
        normalizedProductCat.includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [products, debouncedSearch, selectedCategoryTab]);

  // Structural Pagination Computations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="w-full flex flex-col text-black font-sans antialiased bg-white">
      
      {/* CONTROL ACTIONS & NAVIGATION MANIFEST ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] p-4 gap-4 bg-white">
        
        {/* Crisp Linear Category Tabs */}
        <div className="overflow-x-auto no-scrollbar flex items-center max-w-full">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedCategoryTab('ALL')}
              className={`h-8 px-3 text-[12px] font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategoryTab === 'ALL'
                  ? 'bg-black text-white'
                  : 'text-[#555555] hover:text-black hover:bg-black/[0.04]'
              }`}
            >
              All Inventory
            </button>
            
            {finalTabsList.map((tabName) => {
              const isActive = selectedCategoryTab.toLowerCase().trim() === tabName.toLowerCase().trim();
              
              return (
                <button
                  key={tabName}
                  onClick={() => setSelectedCategoryTab(tabName)}
                  className={`h-8 px-3 text-[12px] font-medium rounded-md transition-colors whitespace-nowrap capitalize ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-[#555555] hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  {tabName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dense Minimal Input Search Node */}
        <div className="relative w-full sm:max-w-[260px] shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            type="text"
            placeholder="Search items, codes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-8 pl-8 pr-12 text-[12px] font-medium bg-white border border-[#dddddd] rounded-md focus:outline-none focus:border-black transition-colors text-black placeholder-[#888888]"
          />
          {searchInput !== debouncedSearch && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#999999] tracking-wider uppercase">
              ...
            </span>
          )}
        </div>
      </div>

      {/* RETAIL ASSET MATRIX WORKSPACE */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px] lg:min-w-full">
          <thead>
            <tr className="border-b border-[#eeeeee] bg-[#fafafa] text-[10px] font-bold uppercase tracking-wider text-[#666666]">
              <th className="h-10 px-5 vertical-align-middle">Product Details</th>
              <th className="h-10 px-5 vertical-align-middle">SKU Index</th>
              <th className="h-10 px-5 vertical-align-middle">Classification</th>
              <th className="h-10 px-5 vertical-align-middle">MSRP Price</th>
              <th className="h-10 px-5 vertical-align-middle">Stock Allocation</th>
              <th className="h-10 px-5 vertical-align-middle">Visibility</th>
              <th className="h-10 px-5 vertical-align-middle text-right">Actions Matrix</th>
            </tr>
          </thead>
          <tbody className="text-[12px] font-medium text-[#222222]">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-16 text-[#888888] font-normal italic bg-white">
                  No active registration logs match selected operational matrices.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const displayCategoryName = product.category_id || product.categoryId || product.category || "Unassigned";

                return (
                  <tr key={product.id} className="border-b border-[#eeeeee] last:border-0 hover:bg-black/[0.01] transition-colors group">
                    
                    {/* Primary Product Detail Block */}
                    <td className="py-3 px-5 flex items-center gap-3">
                      <div className="w-8 h-10 rounded-md bg-[#fafafa] border border-[#eeeeee] overflow-hidden shrink-0 flex items-center justify-center text-[#888888]">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 
                          className="font-semibold text-black tracking-wide truncate max-w-[220px] hover:underline cursor-pointer"
                          onClick={() => onEdit && onEdit(product)}
                        >
                          {product.title || product.name}
                        </h4>
                        <p className="text-[10px] text-[#777777] font-mono mt-0.5 truncate max-w-[140px] uppercase tracking-tight">{product.slug}</p>
                      </div>
                    </td>

                    {/* Alphanumeric SKU Mapping */}
                    <td className="py-3 px-5 text-[#555555] font-mono tracking-tight">
                      {product.sku || '—'}
                    </td>

                    {/* Context Relationship Node */}
                    <td className="py-3 px-5">
                      <div className="inline-flex items-center gap-1 text-[#555555]">
                        <Table2 className="w-3.5 h-3.5 text-[#999999]" />
                        <span className="capitalize text-[12px]">{displayCategoryName}</span>
                      </div>
                    </td>

                    {/* Financial Ledger Index */}
                    <td className="py-3 px-5 font-semibold text-black">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>

                    {/* System Quantity Evaluation Status */}
                    <td className="py-3 px-5">
                      <span className={`font-medium ${(product.stock_qty || product.stock || 0) <= 0 ? 'text-[#de350b]' : 'text-black'}`}>
                        {product.stock_qty || product.stock || 0} units
                      </span>
                    </td>

                    {/* Deployment Visibility Switches */}
                    <td className="py-3 px-5">
                      {(product.is_active || product.status === 'Active') ? (
                        <span className="px-1.5 py-0.5 rounded-sm text-[10px] bg-green-50 text-green-700 border border-green-200 font-medium uppercase tracking-wide">
                          Active
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-sm text-[10px] bg-gray-100 text-[#555555] border border-gray-200 font-medium uppercase tracking-wide">
                          Hidden
                        </span>
                      )}
                    </td>

                    {/* Modifiers Access Node */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => onEdit && onEdit(product)}
                          className="p-1.5 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDelete && onDelete(product.id)}
                          className="p-1.5 text-[#777777] hover:text-[#de350b] hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* MATRIX CONTROL FOOTER RECORD SYSTEM */}
      {filteredProducts.length > 0 && (
        <div className="border-t border-[#eeeeee] px-5 py-3 flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#fafafa] w-full">
          <p className="text-[12px] text-[#555555] font-medium">
            Showing <span className="font-semibold text-black">{(currentPage - 1) * itemsPerPage + 1}</span>–<span className="font-semibold text-black">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-semibold text-black">{filteredProducts.length}</span> registry rows
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#555555]">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-7 w-7 flex items-center justify-center rounded-md border border-[#dddddd] bg-white text-[#555555] disabled:opacity-30 hover:border-black transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-7 w-7 flex items-center justify-center rounded-md border border-[#dddddd] bg-white text-[#555555] disabled:opacity-30 hover:border-black transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}