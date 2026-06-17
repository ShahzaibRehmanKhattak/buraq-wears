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

  const confirmDeleteAction = (id) => {
    const targetProduct = products.find(p => p.id === id);
    setDeleteDialog({ 
      isOpen: true, 
      id: id, 
      title: targetProduct?.title || 'this product' 
    });
  };

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

  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.stock_qty > 0 && p.stock_qty < 10).length;
  const outOfStockCount = products.filter(p => p.stock_qty <= 0).length;

  return (
    <div className="bg-white h-screen w-full flex flex-col font-sans antialiased text-black selection:bg-black/[0.06] overflow-hidden relative">
      <style>{`
        body { letter-spacing: -0.01em; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      
      {/* SYSTEM SYSTEM-WIDE NOTIFICATIONS GRID */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-md border text-[12px] font-medium transition-all ${
          toast.type === 'success' ? 'bg-black text-white border-black' : 
          toast.type === 'error' ? 'bg-red-50 text-[#de350b] border-red-200' : 'bg-[#111111] text-white border-[#111111]'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
          {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-[#de350b]" />}
          {toast.type === 'info' && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
          <span className="tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* REFACTORED STRUCTURAL CRITICAL DELETE MODAL */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[70] p-4">
          <div className="bg-white border border-[#eeeeee] rounded-md w-full max-w-md overflow-hidden">
            <div className="p-6 flex flex-col items-start text-left">
              <div className="w-10 h-10 bg-red-50 rounded-md flex items-center justify-center mb-4 border border-red-100">
                <Trash2 className="w-5 h-5 text-[#de350b]" />
              </div>
              <h3 className="text-[16px] font-semibold text-black mb-1">Delete Product Listing</h3>
              <p className="text-[13px] text-[#555555] leading-relaxed">
                You are about to permanently delete <span className="text-black font-medium">"{deleteDialog.title}"</span>. This will eliminate all inventory ledger items, media nodes, and variants. This operation cannot be rolled back.
              </p>
            </div>
            
            <div className="flex gap-2 px-6 py-4 bg-[#fafafa] border-t border-[#eeeeee]">
              <button 
                onClick={() => setDeleteDialog({ isOpen: false, id: null, title: '' })} 
                disabled={isDeleting}
                className="flex-1 h-9 border border-[#dddddd] bg-white rounded-md text-[11px] font-semibold uppercase tracking-wider text-[#555555] hover:border-black transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                disabled={isDeleting}
                className="flex-1 h-9 bg-[#de350b] text-white rounded-md text-[11px] font-semibold uppercase tracking-wider hover:bg-[#c12e0a] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Processing</span></>
                ) : (
                  <span>Confirm Erase</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* LOWER CONTENT ZONE CONTAINER */}
      <div className="flex flex-1 w-full h-[calc(100vh-5rem)] overflow-hidden relative">
        
        <Sidebar 
          collapsed={isSidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
        
        <main className="flex-1 overflow-y-auto no-scrollbar md:px-8 pb-24 bg-white">
          <TopBar />
          
          <div className="w-full max-w-[1600px] mx-auto mt-6">
            {/* HEADER METADATA REGION */}
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-[#eeeeee] pb-5 gap-4 mb-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#777777]">Global Index</span>
                <h2 className="text-[18px] font-semibold tracking-wide text-black mt-0.5">Product Management</h2>
                <p className="text-[12px] text-[#555555] mt-0.5">Manage global inventory visibility, retail configurations, and price controls.</p>
              </div>
              <button 
                onClick={() => { setActiveSelection(null); setIsModalOpen(true); }}
                className="w-full sm:w-auto h-8 px-4 bg-black text-white font-medium text-[12px] hover:bg-[#222222] transition-colors flex items-center justify-center gap-1.5 rounded-md shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product Listing
              </button>
            </header>

            {/* REALTIME SYSTEM ANALYTICAL METRICS */}
            <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

            {/* PRODUCT SHELF TABLE LISTING COMPONENT */}
            <div className="w-full border border-[#eeeeee] rounded-md bg-white overflow-hidden">
              <ProductTable 
                products={products} 
                categories={categories}
                onEdit={(prod) => { setActiveSelection(prod); setIsModalOpen(true); }} 
                onDelete={confirmDeleteAction} 
              />
            </div>
          </div>

        </main>
      </div>

      {/* CORE INPUT MODAL DIALOG FLOWS */}
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