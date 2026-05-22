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

  // 3-Second Search Debouncer to optimize performance
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 3000);

    return () => clearTimeout(delayTimer);
  }, [searchInput]);

  // SMART FALLBACK SYSTEM: If categories array is empty, automatically build tabs from your product data
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

  // Combined Filter Architecture: Filters products by both tab selection and search input
  const filteredProducts = useMemo(() => {
    setCurrentPage(1); // Reset page layout index during filter changes
    
    return products.filter((product) => {
      if (!product) return false;

      const rawProductCat = product.category_id || product.categoryId || product.category || '';
      const normalizedProductCat = String(rawProductCat).toLowerCase().trim();
      const normalizedTargetTab = selectedCategoryTab.toLowerCase().trim();
      
      // 1. Tab Filtering System
      const matchesTab = selectedCategoryTab === 'ALL' || normalizedProductCat === normalizedTargetTab;
      
      // 2. Search Input Query Match
      const normalizedSearch = debouncedSearch.toLowerCase().trim();
      const matchesSearch = normalizedSearch === '' || 
        (product.title && product.title.toLowerCase().includes(normalizedSearch)) ||
        (product.name && product.name.toLowerCase().includes(normalizedSearch)) ||
        (product.sku && product.sku.toLowerCase().includes(normalizedSearch)) ||
        normalizedProductCat.includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [products, debouncedSearch, selectedCategoryTab]);

  // Pagination Lookups
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="w-full flex flex-col gap-4 text-gray-800 font-sans antialiased">
      
      {/* ----------------- CONTROL NAVIGATION HEADER (CLEAN TABS) ----------------- */}
      <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full overflow-hidden">
        
        {/* Clean Category Navigation Panel (Supports native smooth horizontal swiping layout on mobile) */}
        <div className="w-full lg:w-auto overflow-x-auto scrollbar-none flex items-center">
          <div className="flex flex-nowrap gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100 min-w-max">
            <button
              onClick={() => setSelectedCategoryTab('ALL')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all tracking-wide shrink-0 ${
                selectedCategoryTab === 'ALL'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:text-black border border-gray-200/60 shadow-sm hover:border-gray-300'
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
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all tracking-wide whitespace-nowrap capitalize shrink-0 ${
                    isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-gray-500 hover:text-black border border-gray-200/60 shadow-sm hover:border-gray-300'
                  }`}
                >
                  {tabName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Live Text Search Bar */}
        <div className="relative w-full lg:max-w-xs shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search titles, SKUs, or categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-16 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all text-black placeholder-gray-400"
          />
          {searchInput !== debouncedSearch && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-500 animate-pulse tracking-wider">
              WAITING...
            </span>
          )}
        </div>
      </div>

      {/* ----------------- LEAN BORDERLESS INTERIOR DATA TABLE ----------------- */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-4 md:px-6">Product Details</th>
                <th className="py-4 px-4 md:px-6">SKU Reference</th>
                <th className="py-4 px-4 md:px-6">Category Relation</th>
                <th className="py-4 px-4 md:px-6">Price Point</th>
                <th className="py-4 px-4 md:px-6">Stock Allocation</th>
                <th className="py-4 px-4 md:px-6">Visibility</th>
                <th className="py-4 px-4 md:px-6 text-right">Actions Matrix</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium text-gray-700">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400 font-normal italic">
                    No registry assets found matching this active category layout parameter.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const displayCategoryName = product.category_id || product.categoryId || product.category || "Unassigned";

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition-colors group">
                      
                      {/* Product details thumbnail block */}
                      <td className="py-4 px-4 md:px-6 flex items-center gap-4">
                        <div className="w-10 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <h4 
                            className="font-bold text-gray-900 tracking-tight hover:text-gray-600 cursor-pointer transition-colors"
                            onClick={() => onEdit && onEdit(product)}
                          >
                            {product.title || product.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5 max-w-[150px] truncate">{product.slug}</p>
                        </div>
                      </td>

                      {/* SKU Column */}
                      <td className="py-4 px-4 md:px-6 text-gray-500 font-mono tracking-tight">
                        {product.sku || '—'}
                      </td>

                      {/* Category Badge Column */}
                      <td className="py-4 px-4 md:px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200 group-hover:border-gray-300 transition-colors">
                          <Table2 className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-sans font-normal text-gray-600 capitalize">{displayCategoryName}</span>
                        </div>
                      </td>

                      {/* Financial Price Metric */}
                      <td className="py-4 px-4 md:px-6 font-bold text-gray-900">
                        ${Number(product.price || 0).toFixed(2)}
                      </td>

                      {/* Inventory Stock Tracker Status */}
                      <td className="py-4 px-4 md:px-6">
                        <span className={`font-bold ${(product.stock_qty || product.stock || 0) <= 0 ? 'text-red-500' : 'text-gray-700'}`}>
                          {product.stock_qty || product.stock || 0} units
                        </span>
                      </td>

                      {/* Production Visibility Switches */}
                      <td className="py-4 px-4 md:px-6">
                        {(product.is_active || product.status === 'Active') ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-green-50 text-green-700 border border-green-200 font-bold uppercase tracking-wider">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 border border-gray-200 font-bold uppercase tracking-wider">
                            Hidden
                          </span>
                        )}
                      </td>

                      {/* Action Triggers */}
                      <td className="py-4 px-4 md:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => onEdit && onEdit(product)}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onDelete && onDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

        {/* ----------------- CLEAN FOOTER PAGINATION CONTAINER ----------------- */}
        {filteredProducts.length > 0 && (
          <div className="border-t border-gray-200 px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 w-full">
            <p className="text-xs text-gray-500 font-medium text-center sm:text-left">
              Showing <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold text-gray-800">{filteredProducts.length}</span> nodes
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-gray-600 px-1 select-none">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}