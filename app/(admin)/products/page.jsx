"use client";
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductModal } from '@/components/admin/ProductModel';
import { GlassCard } from '@/components/admin/GlassCard'; 
import { MetricCard } from '@/components/admin/MetricCards'; 
import { Plus, Box, AlertTriangle, XOctagon, Loader2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { TopBar } from '@/components/admin/Topbar'; 

export default function ProductManagementView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSelection, setActiveSelection] = useState(null);
  
  // Responsive sidebar shared state management
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global UI State
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
  // Custom Delete Modal State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    syncCatalogState();
    syncClassificationNodes();
  }, []);

  const triggerToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 4000);
  };

  const syncCatalogState = async () => {
    try {
      const res = await fetch('/api/products');
      const payload = await res.json();
      if (payload.success) setProducts(payload.data);
    } catch (err) {
      console.error("Failed to synchronize catalog metrics node:", err);
    }
  };

  const syncClassificationNodes = async () => {
    try {
      const res = await fetch('/api/categories');
      const payload = await res.json();
      if (payload.success) setCategories(payload.data);
    } catch (err) {
      console.error("Failed to synchronize classification data schema node:", err);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      const isEditing = !!productData.id;
      const targetEndpoint = '/api/products';
      
      const res = await fetch(targetEndpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setActiveSelection(null);
        syncCatalogState();
        triggerToast(`Product successfully ${isEditing ? 'updated' : 'created'}!`, "success");
      } else {
        triggerToast(`Operation Rejected: ${data.error}`, "error");
      }
    } catch (err) {
      triggerToast(`Network fault: ${err.message}`, "error");
    }
  };

  // 1. Triggers the custom UI confirmation modal
  const confirmDeleteAction = (id) => {
    const targetProduct = products.find(p => p.id === id);
    setDeleteDialog({ 
      isOpen: true, 
      id: id, 
      title: targetProduct?.title || 'this product' 
    });
  };

  // 2. Executes the actual destructive database API call
  const executeDelete = async () => {
    if (!deleteDialog.id) return;
    
    setIsDeleting(true);
    triggerToast("Purging product record from database...", "info");
    
    try {
      const res = await fetch(`/api/products?id=${deleteDialog.id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        syncCatalogState();
        setDeleteDialog({ isOpen: false, id: null, title: '' });
        triggerToast("Product permanently deleted.", "success");
      } else {
        triggerToast(`Deletion failed: ${data.error}`, "error");
      }
    } catch (err) {
      triggerToast(`Network connection fault: ${err.message}`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Theme State Data Computations ---
  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.stock_qty > 0 && p.stock_qty < 10).length;
  const outOfStockCount = products.filter(p => p.stock_qty <= 0).length;

  return (
    <div className="bg-gray-50/50 h-screen w-full flex flex-col font-sans antialiased text-gray-900 selection:bg-black selection:text-white overflow-hidden relative">
      
      {/* GLOBAL TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all animate-slideIn ${
          toast.type === 'success' ? 'bg-black text-white border-neutral-800' : 
          toast.type === 'error' ? 'bg-red-50 text-red-900 border-red-200' : 'bg-neutral-900 text-white border-neutral-800'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.type === 'info' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
          <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                You are about to permanently delete <strong className="text-black">"{deleteDialog.title}"</strong>. This will remove all associated media, variants, and metadata. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 px-8 py-6 bg-gray-50/50 border-t border-gray-100">
              <button 
                onClick={() => setDeleteDialog({ isOpen: false, id: null, title: '' })} 
                disabled={isDeleting}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-white transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                {isDeleting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Deleting...</span></>
                ) : (
                  <span>Yes, Delete It</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 1. TOP NAVBAR */}
     
      
      {/* 2. LOWER CONTENT ZONE CONTAINER */}
      <div className="flex flex-1 w-full h-[calc(100vh-5rem)] overflow-hidden relative">
        
        <Sidebar 
          collapsed={isSidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
        
        <main className="flex-1 overflow-y-auto  md:px-8 pb-24">
           <TopBar />
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 mt-6 lg:mt-0">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black">Product Management</h2>
              <p className="text-sm text-gray-400 mt-1">Manage global inventory visibility, retail configurations, and price controls.</p>
            </div>
            <button 
              onClick={() => { setActiveSelection(null); setIsModalOpen(true); }}
              className="w-full sm:w-auto px-6 py-2.5 bg-black text-white font-bold text-[11px] uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center gap-2 rounded-full shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Product Listing
            </button>
          </header>

          {/* Realtime Analytical Metric Dashboard */}
          <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
            <MetricCard 
              title="Total Inventory Items" 
              value={totalItems.toLocaleString()} 
              trend="Live state" 
              trendUp={true} 
              icon={Box} 
              isPrimary={true} 
            />
            <MetricCard 
              title="Low Stock Items" 
              value={lowStockCount} 
              trend="Attention" 
              trendUp={lowStockCount === 0} 
              icon={AlertTriangle} 
            />
            <div className="col-span-2 lg:col-span-1">
              <MetricCard 
                title="Out of Stock" 
                value={outOfStockCount} 
                trend="Critical" 
                trendUp={outOfStockCount === 0} 
                icon={XOctagon} 
              />
            </div>
          </section>

          {/* Inventory Active Log Core Table Display Module */}
          <GlassCard className="p-6">
            <ProductTable 
              products={products} 
              categories={categories}
              onEdit={(prod) => { setActiveSelection(prod); setIsModalOpen(true); }} 
              onDelete={confirmDeleteAction} // <-- Updated to use custom modal flow
            />
          </GlassCard>

        </main>
      </div>

      {/* Modular Overlay Dialog Handler Entry Node */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setActiveSelection(null); }} 
        onSave={handleSaveProduct} 
        product={activeSelection} 
        categories={categories} 
      />
    </div>
  );
}