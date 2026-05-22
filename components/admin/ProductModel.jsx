"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { X, Upload, Trash2, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProductModal({ isOpen, onClose, onSave, product = null, categories = [] }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Expanded State Matrix matching all new DB fields
  const [formData, setFormData] = useState({
    title: '', slug: '', sku: '', barcode: '', brand: '',
    category_id: '', sub_category: '', tags: '',
    short_description: '', description: '', specifications: '',
    price: '', compare_at_price: '', cost_per_item: '', discount_price: '', badge_text: '',
    stock_qty: '', availability: 'In Stock',
    colors: '', sizes: '', material: '', warranty: '',
    weight: '', length: '', width: '', height: '',
    seo_title: '', seo_description: '',
    images: [], is_active: true, is_featured: false
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const triggerToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 4000);
  };

  const generateSlug = (text) => {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, title: value, slug: generateSlug(value) }));
  };

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || '',
        title: product.title || '',
        slug: product.slug || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        brand: product.brand || '',
        category_id: product.category_id ? String(product.category_id) : '',
        sub_category: product.sub_category || '',
        tags: product.tags || '',
        short_description: product.short_description || '',
        description: product.description || '',
        specifications: product.specifications || '',
        price: product.price || '',
        compare_at_price: product.compare_at_price || '',
        cost_per_item: product.cost_per_item || '',
        discount_price: product.discount_price || '',
        badge_text: product.badge_text || '',
        stock_qty: product.stock_qty || '',
        availability: product.availability || 'In Stock',
        colors: product.colors || '',
        sizes: product.sizes || '',
        material: product.material || '',
        warranty: product.warranty || '',
        weight: product.weight || '',
        length: product.length || '',
        width: product.width || '',
        height: product.height || '',
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        images: product.images || [],
        is_active: product.is_active !== undefined ? product.is_active : true,
        is_featured: product.is_featured !== undefined ? product.is_featured : false
      });
    } else {
      // Reset form
      setFormData({
        title: '', slug: '', sku: '', barcode: '', brand: '',
        category_id: '', sub_category: '', tags: '',
        short_description: '', description: '', specifications: '',
        price: '', compare_at_price: '', cost_per_item: '', discount_price: '', badge_text: '',
        stock_qty: '', availability: 'In Stock',
        colors: '', sizes: '', material: '', warranty: '',
        weight: '', length: '', width: '', height: '',
        seo_title: '', seo_description: '',
        images: [], is_active: true, is_featured: false
      });
    }
    setIsSaving(false);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      triggerToast("Streaming device files to Supabase...", "info");
      const files = Array.from(e.target.files);
      const updatedUrls = [...formData.images];

      for (const file of files) {
        const cleanFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error } = await supabase.storage.from('product-images').upload(cleanFilename, file, { cacheControl: '3600', upsert: false });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(cleanFilename);
        updatedUrls.push(publicUrl);
      }

      setFormData(prev => ({ ...prev, images: updatedUrls }));
      triggerToast("Assets synced successfully!", "success");
    } catch (err) {
      triggerToast(`Storage Rejected Upload: ${err.message}`, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = async (indexToRemove) => {
    const targetUrl = formData.images[indexToRemove];
    try {
      if (targetUrl) {
        const urlParts = targetUrl.split('/storage/v1/object/public/product-images/');
        if (urlParts.length === 2) {
          const { error } = await supabase.storage.from('product-images').remove([urlParts[1]]);
          if (error) throw error;
        }
      }
      setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== indexToRemove) }));
      triggerToast("Image purged successfully.", "success");
    } catch (err) {
      triggerToast(`Storage clean failed: ${err.message}`, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    triggerToast("Committing catalog mutations to core server...", "info");
    
    const normalizedPayload = {
      ...formData,
      category_id: formData.category_id ? String(formData.category_id).trim() : 'categories',
      price: parseFloat(formData.price) || 0,
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      cost_per_item: formData.cost_per_item ? parseFloat(formData.cost_per_item) : null,
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      stock_qty: parseInt(formData.stock_qty, 10) || 0
    };

    await onSave(normalizedPayload);
  };

  const inputStyle = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-black transition-all placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5";
  const sectionTitleStyle = "text-sm font-bold uppercase tracking-widest text-black mb-4 pb-2 border-b border-gray-100 mt-8 first:mt-0";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all ${toast.type === 'success' ? 'bg-black text-white border-neutral-800' : toast.type === 'error' ? 'bg-red-50 text-red-900 border-red-200' : 'bg-neutral-900 text-white border-neutral-800'}`}>
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.type === 'info' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
          <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-black tracking-tight flex items-center gap-2">
              {formData.id ? 'Modify Catalog Entry' : 'Create New Product Listing'}
              {!formData.id && <Sparkles className="w-4 h-4 text-amber-500" />}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Fill out comprehensive product records to sync to retail channels.</p>
          </div>
          <button type="button" onClick={onClose} disabled={isSaving || uploading} className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all disabled:opacity-30">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1">
          
          {/* IDENTIFICATION SECTION */}
          <h4 className={sectionTitleStyle}>1. Core Identification</h4>
          <div className="grid grid-cols-2 gap-5">
            <div><label className={labelStyle}>Product Title *</label><input required type="text" className={inputStyle} value={formData.title} onChange={handleTitleChange} /></div>
            <div><label className={labelStyle}>URL Slug *</label><input required type="text" className={inputStyle} value={formData.slug} onChange={e => setFormData({...formData, slug: generateSlug(e.target.value)})} /></div>
            <div><label className={labelStyle}>Brand</label><input type="text" className={inputStyle} value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} /></div>
            <div><label className={labelStyle}>Tags (Comma Separated)</label><input type="text" className={inputStyle} placeholder="e.g. casual, cotton, summer" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} /></div>
          </div>

          {/* ORGANIZATION SECTION */}
          <h4 className={sectionTitleStyle}>2. Classification & Tracking</h4>
          <div className="grid grid-cols-3 gap-5">
            <div>
              <label className={labelStyle}>Primary Category</label>
              <select className={inputStyle} value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                <option value="categories">Unassigned</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div><label className={labelStyle}>Sub Category</label><input type="text" className={inputStyle} placeholder="e.g. Men / T-Shirts" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})} /></div>
            <div><label className={labelStyle}>Availability Status</label>
              <select className={inputStyle} value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-Order">Pre-Order</option>
              </select>
            </div>
            <div><label className={labelStyle}>SKU Code</label><input type="text" className={inputStyle} value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} /></div>
            <div><label className={labelStyle}>Barcode</label><input type="text" className={inputStyle} value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} /></div>
            <div><label className={labelStyle}>Stock Quantity *</label><input required type="number" min="0" className={inputStyle} value={formData.stock_qty} onChange={e => setFormData({...formData, stock_qty: e.target.value})} /></div>
          </div>

          {/* PRICING SECTION */}
          <h4 className={sectionTitleStyle}>3. Pricing Strategy</h4>
          <div className="grid grid-cols-3 gap-5 bg-gray-50/40 p-5 rounded-2xl border border-gray-100">
            <div><label className={labelStyle}>Retail Price ($) *</label><input required type="number" step="0.01" className={inputStyle} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
            <div><label className={labelStyle}>Compare At Price ($)</label><input type="number" step="0.01" className={inputStyle} value={formData.compare_at_price} onChange={e => setFormData({...formData, compare_at_price: e.target.value})} /></div>
            <div><label className={labelStyle}>Cost Per Item ($)</label><input type="number" step="0.01" className={inputStyle} value={formData.cost_per_item} onChange={e => setFormData({...formData, cost_per_item: e.target.value})} /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-5 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            <div><label className={labelStyle}>Sale Price ($)</label><input type="number" step="0.01" className={inputStyle} value={formData.discount_price} onChange={e => setFormData({...formData, discount_price: e.target.value})} /></div>
            <div>
              <label className={labelStyle}>Marketing Badge</label>
              <input type="text" list="badge-options" className={inputStyle} value={formData.badge_text} onChange={e => setFormData({...formData, badge_text: e.target.value})} />
              <datalist id="badge-options">
                <option value="Hot" /><option value="New Drop" /><option value="Season End" />
                <option value="-10% OFF" /><option value="-30% OFF" /><option value="-50% OFF" />
              </datalist>
            </div>
          </div>

          {/* PHYSICAL & LOGISTICS SECTION */}
          <h4 className={sectionTitleStyle}>4. Physical Attributes & Variants</h4>
          <div className="grid grid-cols-4 gap-5">
            <div><label className={labelStyle}>Weight (g/kg)</label><input type="text" className={inputStyle} placeholder="180g" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} /></div>
            <div><label className={labelStyle}>Length</label><input type="text" className={inputStyle} placeholder="70cm" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} /></div>
            <div><label className={labelStyle}>Width</label><input type="text" className={inputStyle} placeholder="50cm" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} /></div>
            <div><label className={labelStyle}>Height</label><input type="text" className={inputStyle} placeholder="1cm" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} /></div>
            
            <div className="col-span-2"><label className={labelStyle}>Colors (Comma Separated)</label><input type="text" className={inputStyle} placeholder="Black, White, Navy Blue" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} /></div>
            <div className="col-span-2"><label className={labelStyle}>Sizes (Comma Separated)</label><input type="text" className={inputStyle} placeholder="S, M, L, XL" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} /></div>
          </div>

          {/* MEDIA SECTION */}
          <h4 className={sectionTitleStyle}>5. Media Assets</h4>
          <div>
            <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} disabled={isSaving || uploading} />
            <div className="grid grid-cols-5 gap-4 mt-2">
              {formData.images.map((url, index) => (
                <div key={url} className="relative group aspect-[4/5] rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shadow-sm">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeImage(index)} className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <button type="button" disabled={uploading || isSaving} onClick={() => fileInputRef.current?.click()} className="aspect-[4/5] rounded-xl border-2 border-dashed border-gray-200 hover:border-black transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50/50 hover:bg-white text-gray-400 hover:text-black disabled:opacity-40">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /><span className="text-[10px] font-bold">UPLOAD</span></>}
              </button>
            </div>
          </div>

          {/* DESCRIPTIONS & COPY */}
          <h4 className={sectionTitleStyle}>6. Descriptions & Specs</h4>
          <div className="space-y-5">
            <div><label className={labelStyle}>Short Description</label><textarea rows="2" className={inputStyle} value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} /></div>
            <div><label className={labelStyle}>Full Description</label><textarea rows="4" className={inputStyle} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            
            <div className="grid grid-cols-2 gap-5">
              <div><label className={labelStyle}>Material</label><input type="text" className={inputStyle} placeholder="e.g. 100% Cotton" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} /></div>
              <div><label className={labelStyle}>Warranty Policy</label><input type="text" className={inputStyle} placeholder="e.g. 7 Days Return" value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} /></div>
            </div>
            
            <div><label className={labelStyle}>Specifications (Comma Separated)</label><textarea rows="2" className={inputStyle} placeholder="Breathable Fabric, Soft Touch, Regular Fit" value={formData.specifications} onChange={e => setFormData({...formData, specifications: e.target.value})} /></div>
          </div>

          {/* SEO META */}
          <h4 className={sectionTitleStyle}>7. Search Engine Optimization</h4>
          <div className="grid grid-cols-2 gap-5">
            <div><label className={labelStyle}>SEO Title</label><input type="text" className={inputStyle} value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} /></div>
            <div><label className={labelStyle}>SEO Description</label><textarea rows="1" className={inputStyle} value={formData.seo_description} onChange={e => setFormData({...formData, seo_description: e.target.value})} /></div>
          </div>

          {/* PUBLISHING CONTROLS */}
          <div className="flex gap-8 items-center border-t border-gray-100 pt-8 mt-8">
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 cursor-pointer select-none">
              <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 rounded text-black border-gray-300 focus:ring-0" /> Publish Immediately
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 cursor-pointer select-none">
              <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4 rounded text-black border-gray-300 focus:ring-0" /> Feature on Storefront Hero
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-5 py-2.5 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40">Cancel</button>
            <button type="submit" disabled={uploading || isSaving} className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:bg-gray-400 flex items-center gap-2 min-w-[140px] justify-center">
              {isSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Processing</span></> : <span>Save Changes</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}