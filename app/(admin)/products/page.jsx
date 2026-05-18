"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Eye, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, User, Settings, Package, 
  AlertTriangle, Layers, Edit3, Trash2, ChevronRight,
  ShoppingBag, Home, Box, DollarSign, UploadCloud, Info, Check, Image
} from 'lucide-react';

import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';
import { BottomBar } from '@/components/admin/BottomBar';
import { MetricCard } from '@/components/admin/MetricCards';
import { Badge } from '@/components/admin/Badges';
import { GlassCard } from '@/components/admin/GlassCard';
import { supabase } from '@/lib/supabase/client';

// ==========================================
// 0. SYSTEM TOAST ENGINE
// ==========================================
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[250] flex flex-col gap-2 w-full max-w-sm px-4">
    {toasts.map((toast) => (
      <div 
        key={toast.id}
        className={`w-full p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-center justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
          toast.type === 'error' 
            ? 'bg-red-50/95 border-red-200 text-red-800' 
            : 'bg-black/95 border-neutral-800 text-white'
        }`}
      >
        <p className="text-xs font-semibold tracking-wide uppercase">{toast.message}</p>
        <button onClick={() => removeToast(toast.id)} className="p-1 hover:opacity-70 transition-opacity">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

// ==========================================
// 1. DYNAMIC COMPREHENSIVE PRODUCT MODAL
// ==========================================
const ProductModal = ({ isOpen, onClose, editProduct, onSaveSuccess, addToast }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    compare_at_price: '',
    cost_price: '',
    stock_quantity: '',
    brand: 'IBNA',
    category: 'Apparel',
    sizes: [],
    image: '',
    description: ''
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const categories = ['Apparel', 'Footwear', 'Accessories', 'Atelier', 'Essentials'];

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        sku: editProduct.sku || '',
        price: editProduct.price || '',
        compare_at_price: editProduct.compare_at_price || '',
        cost_price: editProduct.cost_price || '',
        stock_quantity: editProduct.stock_quantity ?? '',
        brand: editProduct.brand || 'IBNA',
        category: editProduct.category || 'Apparel',
        sizes: editProduct.sizes || [],
        image: editProduct.image || '',
        description: editProduct.description || ''
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        price: '',
        compare_at_price: '',
        cost_price: '',
        stock_quantity: '',
        brand: 'IBNA',
        category: 'Apparel',
        sizes: [],
        image: '',
        description: ''
      });
    }
  }, [editProduct, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
      addToast('Featured asset mapped successfully');
    } catch (err) {
      addToast(`Upload failure: ${err.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Featured asset reference cleared');
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // -- Fetch the active authenticated user's metadata profile details
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication validation failed. Please sign in again.");
    }

    const qty = parseInt(formData.stock_quantity, 10) || 0;
    let computedStatus = 'In Stock';
    if (qty <= 0) computedStatus = 'Out of Stock';
    else if (qty <= 5) computedStatus = 'Low Stock';

    // -- Build payload with unified matching parameter keys
    const payload = {
      name: formData.name,
      sku: formData.sku,
      brand: formData.brand,
      category: formData.category,
      description: formData.description,
      sizes: formData.sizes,
      image: formData.image,
      price: parseFloat(formData.price) || 0,
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      stock_quantity: qty,
      stockStatus: computedStatus,
      user_id: user.id  //-- Assigns the validated creator UID tracking parameter
    };

    if (editProduct?.id) {
    //   -- Update existing record where IDs match
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editProduct.id);
      
      if (error) throw error;
      addToast('Inventory record updated cleanly');
    } else {
    //   -- Insert completely new specification record entry
      const { error } = await supabase
        .from('products')
        .insert([payload]);
      
      if (error) throw error;
      addToast('New product blueprint archived');
    }

    onSaveSuccess();
    onClose();
  } catch (err) {
    addToast(err.message, 'error');
  } finally {
    setLoading(false);
  }
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-[#f9f9f9] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <header className="flex justify-between items-center px-8 h-20 bg-[#f9f9f9] border-b border-gray-100 shrink-0">
          <div>
            <h1 className="text-base font-black uppercase tracking-widest text-black">
              {editProduct ? 'Modify Parameters' : 'Create Specification'}
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">Verify system keys and parameters.</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-black" />
          </button>
        </header>

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6 pb-28 no-scrollbar">
          
          {/* FEATURED ASSET SHOWCASE DISPLAY LAYER (FIRST ELEMENT) */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-gray-400">Primary Featured Image</label>
            <div className="w-full h-56 bg-white border border-gray-200 rounded-2xl overflow-hidden relative group flex flex-col items-center justify-center shadow-inner">
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Featured Master Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white text-black rounded-xl font-bold text-xs shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                      <UploadCloud size={16} /> Replace Asset
                    </button>
                    <button type="button" onClick={handleRemoveImage} className="p-3 bg-white text-red-500 rounded-xl shadow-xl hover:scale-105 transition-transform">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 mb-3 text-gray-400">
                    <Image size={22} />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="h-10 px-4 bg-black text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <UploadCloud size={14} /> {uploading ? 'Processing File...' : 'Upload Core Image'}
                  </button>
                  <p className="text-[10px] text-gray-400 font-medium mt-2">Recommended resolution square context asset aspect ratios.</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          {/* IDENTITY CONTROLS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-100 pb-1.5">Identity Metrics</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Title</label>
                <input 
                  type="text" required name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm font-medium"
                  placeholder="e.g. Tailored Noir Blazer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand Mark</label>
                  <input 
                    type="text" name="brand" value={formData.brand} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category Context</label>
                  <select 
                    name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm font-semibold"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* FINANCIAL ENGINE */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-100 pb-1.5">Financial Stratification</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retail Price ($)</label>
                <input 
                  type="number" step="0.01" required name="price" value={formData.price} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm font-black"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compare Price</label>
                <input 
                  type="number" step="0.01" name="compare_at_price" value={formData.compare_at_price} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm text-gray-500 line-through"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cost Per Item</label>
                <input 
                  type="number" step="0.01" name="cost_price" value={formData.cost_price} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm text-emerald-600 font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* STOCK LOGISTICS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-gray-400 border-b border-gray-100 pb-1.5">Logistical Track Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Physical Units Count</label>
                <input 
                  type="number" required name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm font-bold"
                  placeholder="e.g. 150"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking SKU</label>
                <input 
                  type="text" required name="sku" value={formData.sku} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm font-mono uppercase tracking-wider"
                  placeholder="IBNA-BOX-01"
                />
              </div>
            </div>
          </div>

          {/* MATRICES LAYOUT */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size Matrix Dimensions</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => {
                const isSelected = formData.sizes.includes(size);
                return (
                  <button
                    type="button" key={size} onClick={() => toggleSize(size)}
                    className={`h-11 px-4 text-xs font-black rounded-xl transition-all border flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-black text-white border-black shadow-md shadow-black/10' 
                        : 'bg-white text-black border-gray-200 hover:border-black'
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DESCRIPTION INTERFACES */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleInputChange} rows="3"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-0 focus:border-black outline-none text-sm resize-none font-medium"
              placeholder="Enter comprehensive item structural craftsmanship technical descriptions..."
            />
          </div>

        </form>

        <footer className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-5 grid grid-cols-2 gap-3 shrink-0">
          <button 
            type="button" onClick={onClose} disabled={loading}
            className="px-4 py-3.5 border border-gray-200 text-black font-bold text-[10px] tracking-widest hover:bg-gray-50 transition-colors uppercase rounded-xl"
          >
            Cancel
          </button>
          <button 
            type="submit" onClick={handleFormSubmit} disabled={loading || uploading}
            className="px-4 py-3.5 bg-black text-white font-bold text-[10px] tracking-widest hover:opacity-90 transition-all uppercase rounded-xl flex items-center justify-center disabled:opacity-40"
          >
            {loading ? 'Archiving Records...' : 'Commit Database Configuration'}
          </button>
        </footer>
      </div>
    </div>
  );
};

// ==========================================
// 2. RENDERING RESPONSIVE VIEWS LAYOUT
// ==========================================
const ProductMobileCard = ({ product, onEdit, onDelete }) => (
  <GlassCard className="p-4 mb-4 md:hidden overflow-hidden border-gray-100/80">
    <div className="flex gap-4 items-start mb-4">
      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package size={24} className="text-gray-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base text-black leading-tight tracking-tight mb-1 truncate pr-1">{product.name}</h3>
          <Badge variant={product.stockStatus === 'Low Stock' ? 'warning' : product.stockStatus === 'Out of Stock' ? 'error' : 'success'}>
            {product.stockStatus}
          </Badge>
        </div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">{product.brand} · {product.category}</div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-bold">{product.sku}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-black">${product.price}</span>
            <span className="text-[10px] font-bold text-gray-400 line-through">{product.stock_quantity} Left</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3">
      <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-gray-600 font-bold text-[11px] hover:bg-gray-100 transition-colors uppercase tracking-wider">
        <Eye size={14} /> View
      </button>
      <button onClick={() => onEdit(product)} className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-gray-600 font-bold text-[11px] hover:bg-gray-100 transition-colors uppercase tracking-wider">
        <Edit3 size={14} /> Edit
      </button>
      <button onClick={() => onDelete(product.id)} className="flex items-center justify-center gap-2 py-2.5 bg-red-50 rounded-xl text-red-500 font-bold text-[11px] hover:bg-red-100 transition-colors uppercase tracking-wider">
        <Trash2 size={14} /> Del
      </button>
    </div>
  </GlassCard>
);

const ProductDesktopTable = ({ products, onEdit, onDelete }) => (
  <div className="hidden md:block overflow-hidden border border-gray-100 rounded-3xl bg-white shadow-xl shadow-black/[0.02]">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50 border-b border-gray-100">
        <tr>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Product Entry</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Stock SKU</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Availability</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Stock Units</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Unit Price</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400 text-right">Management</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-50/40 transition-all group">
            <td className="px-8 py-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center bg-gray-50">
                  {product.image ? (
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Package size={18} className="text-gray-300" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-black">{product.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{product.brand} · {product.category}</div>
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
            <td className="px-8 py-5 font-bold text-sm text-gray-600 tabular-nums">{product.stock_quantity ?? 0} units</td>
            <td className="px-8 py-5">
              <div className="flex flex-col">
                <span className="font-black text-sm text-black tabular-nums">${product.price}</span>
                {product.compare_at_price && (
                  <span className="text-[10px] text-gray-400 line-through">${product.compare_at_price}</span>
                )}
              </div>
            </td>
            <td className="px-8 py-5">
              <div className="flex justify-end gap-2">
                <button title="View" className="p-2.5 bg-transparent hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all"><Eye size={18} /></button>
                <button onClick={() => onEdit(product)} title="Edit" className="p-2.5 bg-transparent hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all"><Edit3 size={18} /></button>
                <button onClick={() => onDelete(product.id)} title="Delete" className="p-2.5 bg-transparent hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
              </div>
            </td>
          </tr>
        ))}
        {products.length === 0 && (
          <tr>
            <td colSpan="6" className="px-8 py-12 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
              No products found in the vault catalog.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const ProductsView = ({ onOpenAdd, onOpenEdit, onDeleteProduct, products, metrics }) => {
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
          <button onClick={onOpenAdd} className="hidden md:flex h-10 px-4 rounded-xl bg-black text-white text-sm font-semibold items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {/* Dynamic Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <MetricCard title="Total Assets" value={metrics.total} icon={Package} isPrimary trend="12.4%" trendUp />
        <MetricCard title="Low Stock Alerts" value={metrics.lowStock} icon={AlertTriangle} trend="3.2%" trendUp={false} />
        <MetricCard title="Active Collections" value="48" icon={Layers} trend="2.1%" trendUp />
        <MetricCard title="Turnover Rate" value="84%" icon={TrendingUp} trend="8.4%" trendUp />
      </div>

      {/* List Section */}
      <div className="mb-10">
        <ProductDesktopTable products={products} onEdit={onOpenEdit} onDelete={onDeleteProduct} />
        <div className="md:hidden space-y-4">
          {products.map((p) => (
            <ProductMobileCard key={p.id} product={p} onEdit={onOpenEdit} onDelete={onDeleteProduct} />
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

// ==========================================
// 3. MASTER APPLICATION CONTAINER
// ==========================================
export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, lowStock: 0 });

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
      
      const lowStockCount = (data || []).filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock').length;
      setMetrics({
        total: (data || []).length,
        lowStock: lowStockCount
      });
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product structure record?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      addToast('Product entry removed cleanly');
      fetchProducts();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
          <ProductsView 
            products={products}
            metrics={metrics}
            onOpenAdd={handleOpenAddModal}
            onOpenEdit={handleOpenEditModal}
            onDeleteProduct={handleDeleteProduct}
          />
        </main>
        <BottomBar />
      </div>

      <button 
        onClick={handleOpenAddModal}
        className="fixed bottom-24 right-6 lg:hidden w-14 h-14 bg-black text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center active:scale-90 transition-all z-40 border-4 border-white/20"
      >
        <Plus size={28} />
      </button>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editProduct={selectedProduct}
        onSaveSuccess={fetchProducts}
        addToast={addToast}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />

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