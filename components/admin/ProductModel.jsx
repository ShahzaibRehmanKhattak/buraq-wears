"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { X, Upload, Trash2, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProductModal({ isOpen, onClose, onSave, product = null, categories = [] }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Expanded State Matrix matching all new DB fields (including page)
  const [formData, setFormData] = useState({
    title: '', slug: '', sku: '', barcode: '', brand: '',
    category_id: '', sub_category: '', tags: '', page: '',
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
        page: product.page || '', 
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
      setFormData({
        title: '', slug: '', sku: '', barcode: '', brand: '',
        category_id: '', sub_category: '', tags: '', page: '', 
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
      page: formData.page ? String(formData.page).toLowerCase().trim() : null, 
      price: parseFloat(formData.price) || 0,
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      cost_per_item: formData.cost_per_item ? parseFloat(formData.cost_per_item) : null,
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      stock_qty: parseInt(formData.stock_qty, 10) || 0
    };

    await onSave(normalizedPayload);
  };

  const inputStyle = "w-full rounded-md border border-[#dddddd] bg-white px-3 h-9 text-[12px] font-medium text-black transition-colors placeholder-[#888888] focus:border-black outline-none";
  const textareaStyle = "w-full rounded-md border border-[#dddddd] bg-white px-3 py-2 text-[12px] font-medium text-black transition-colors placeholder-[#888888] focus:border-black outline-none resize-y";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee] mt-8 first:mt-0";

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 font-sans antialiased">
      {/* System Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-md border text-[12px] font-medium transition-all ${
          toast.type === 'success' ? 'bg-black text-white border-black' : 
          toast.type === 'error' ? 'bg-red-50 text-[#de350b] border-red-200' : 'bg-[#111111] text-white border-[#111111]'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
          {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-[#de350b]" />}
          {toast.type === 'info' && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
          <span className="tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="bg-white border border-[#eeeeee] rounded-md w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col no-scrollbar">
        
        {/* MODAL STRUCTURAL HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#eeeeee] sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-[15px] font-semibold text-black tracking-wide flex items-center gap-2">
              {formData.id ? 'Modify Catalog Entry' : 'Create New Product Listing'}
              {!formData.id && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            </h3>
            <p className="text-[11px] text-[#666666] mt-0.5">Fill out comprehensive product records to sync to retail channels.</p>
          </div>
          <button type="button" onClick={onClose} disabled={isSaving || uploading} className="p-1.5 text-[#888888] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors disabled:opacity-30">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 bg-white">
          
          {/* IDENTIFICATION SECTION */}
          <div>
            <h4 className={sectionTitleStyle}>1. Core Identification</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelStyle}>Product Title *</label><input required type="text" className={inputStyle} value={formData.title} onChange={handleTitleChange} /></div>
              <div><label className={labelStyle}>URL Slug *</label><input required type="text" className={inputStyle} value={formData.slug} onChange={e => setFormData({...formData, slug: generateSlug(e.target.value)})} /></div>
              <div><label className={labelStyle}>Brand</label><input type="text" className={inputStyle} value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} /></div>
              <div><label className={labelStyle}>Tags (Comma Separated)</label><input type="text" className={inputStyle} placeholder="e.g. casual, cotton, summer" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} /></div>
            </div>
          </div>

          {/* ORGANIZATION SECTION */}
          <div>
            <h4 className={sectionTitleStyle}>2. Classification & Tracking</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>Primary Category</label>
                <select className={inputStyle} value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                  <option value="categories">Unassigned</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelStyle}>Target Page Channel</label>
                <select className={inputStyle} value={formData.page} onChange={e => setFormData({...formData, page: e.target.value})}>
                  <option value="">Unassigned (Null)</option>
                  <option value="home">Home Page</option>
                  <option value="shirts">Shirts Page</option>
                  <option value="trousers">Trousers Page</option>
                  <option value="accessories">Accessories Page</option>
                  <option value="atelier">Atelier Page</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Availability Status</label>
                <select className={inputStyle} value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Pre-Order">Pre-Order</option>
                </select>
              </div>
              <div><label className={labelStyle}>Sub Category</label><input type="text" className={inputStyle} placeholder="e.g. Men / T-Shirts" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})} /></div>
              <div><label className={labelStyle}>SKU Code</label><input type="text" className={inputStyle} value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} /></div>
              <div><label className={labelStyle}>Barcode</label><input type="text" className={inputStyle} value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} /></div>
              <div className="col-span-3"><label className={labelStyle}>Stock Quantity *</label><input required type="number" min="0" className={inputStyle} value={formData.stock_qty} onChange={e => setFormData({...formData, stock_qty: e.target.value})} /></div>
            </div>
          </div>

          {/* PRICING SECTION */}
          <div>
            <h4 className={sectionTitleStyle}>3. Pricing Strategy</h4>
            <div className="grid grid-cols-3 gap-4 border border-[#eeeeee] p-4 bg-[#fafafa] rounded-md mb-4">
              <div><label className={labelStyle}>Retail Price ($) *</label><input required type="number" step="0.01" className={inputStyle} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
              <div><label className={labelStyle}>Compare At Price ($)</label><input type="number" step="0.01" className={inputStyle} value={formData.compare_at_price} onChange={e => setFormData({...formData, compare_at_price: e.target.value})} /></div>
              <div><label className={labelStyle}>Cost Per Item ($)</label><input type="number" step="0.01" className={inputStyle} value={formData.cost_per_item} onChange={e => setFormData({...formData, cost_per_item: e.target.value})} /></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border border-[#eeeeee] p-4 bg-white rounded-md">
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
          </div>

          {/* PHYSICAL & LOGISTICS SECTION */}
          <div>
            <h4 className={sectionTitleStyle}>4. Physical Attributes & Variants</h4>
            <div className="grid grid-cols-4 gap-4">
              <div><label className={labelStyle}>Weight (g/kg)</label><input type="text" className={inputStyle} placeholder="180g" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} /></div>
              <div><label className={labelStyle}>Length</label><input type="text" className={inputStyle} placeholder="70cm" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} /></div>
              <div><label className={labelStyle}>Width</label><input type="text" className={inputStyle} placeholder="50cm" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} /></div>
              <div><label className={labelStyle}>Height</label><input type="text" className={inputStyle} placeholder="1cm" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} /></div>
              
              <div className="col-span-2"><label className={labelStyle}>Colors (Comma Separated)</label><input type="text" className={inputStyle} placeholder="Black, White, Navy Blue" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} /></div>
              <div className="col-span-2"><label className={labelStyle}>Sizes (Comma Separated)</label><input type="text" className={inputStyle} placeholder="S, M, L, XL" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} /></div>
            </div>
          </div>

          {/* MEDIA SECTION */}
          <div>
            <h4 className={sectionTitleStyle}>5. Media Assets</h4>
            <div>
              <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} disabled={isSaving || uploading} />
              <div className="grid grid-cols-5 gap-3 mt-2">
                {formData.images.map((url, index) => (
                  <div key={url} className="relative group aspect-[4/5] rounded-md border border-[#eeeeee] overflow-hidden bg-[#fafafa]">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(index)} className="p-1.5 bg-white text-[#de350b] rounded-md hover:scale-105 transition-transform">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  type="button" 
                  disabled={uploading || isSaving} 
                  onClick={() => fileInputRef.current?.click()} 
                  className="aspect-[4/5] rounded-md border border-dashed border-[#dddddd] hover:border-black transition-colors flex flex-col items-center justify-center gap-1 bg-[#fafafa] text-[#888888] hover:text-black disabled:opacity-40"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-wider">Upload</span></>}
                </button>
              </div>
            </div>
          </div>

          {/* DESCRIPTIONS & COPY */}
          <div>
            <h4 className={sectionTitleStyle}>6. Descriptions & Specs</h4>
            <div className="space-y-4">
              <div><label className={labelStyle}>Short Description</label><textarea rows="2" className={textareaStyle} value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} /></div>
              <div><label className={labelStyle}>Full Description</label><textarea rows="4" className={textareaStyle} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelStyle}>Material</label><input type="text" className={inputStyle} placeholder="e.g. 100% Cotton" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} /></div>
                <div><label className={labelStyle}>Warranty Policy</label><input type="text" className={inputStyle} placeholder="e.g. 7 Days Return" value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} /></div>
              </div>
              
              <div><label className={labelStyle}>Specifications (Comma Separated)</label><textarea rows="2" className={textareaStyle} placeholder="Breathable Fabric, Soft Touch, Regular Fit" value={formData.specifications} onChange={e => setFormData({...formData, specifications: e.target.value})} /></div>
            </div>
          </div>

          {/* SEO META */}
          <div>
            <h4 className={sectionTitleStyle}>7. Search Engine Optimization</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelStyle}>SEO Title</label><input type="text" className={inputStyle} value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} /></div>
              <div><label className={labelStyle}>SEO Description</label><textarea rows="1" className={textareaStyle} value={formData.seo_description} onChange={e => setFormData({...formData, seo_description: e.target.value})} /></div>
            </div>
          </div>

          {/* PUBLISHING CONTROLS */}
          <div className="flex gap-6 items-center border-t border-[#eeeeee] pt-5 mt-6">
            <label className="flex items-center gap-2 text-[12px] font-medium text-black cursor-pointer select-none">
              <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-3.5 h-3.5 border-[#dddddd] text-black focus:ring-0 rounded-sm" /> 
              Publish Immediately
            </label>
            <label className="flex items-center gap-2 text-[12px] font-medium text-black cursor-pointer select-none">
              <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-3.5 h-3.5 border-[#dddddd] text-black focus:ring-0 rounded-sm" /> 
              Feature on Storefront Hero
            </label>
          </div>

          {/* ACTIONS TRIGGER CONTAINER */}
          <div className="flex justify-end gap-2 pt-5 border-t border-[#eeeeee]">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSaving} 
              className="h-9 px-4 border border-[#dddddd] bg-white rounded-md text-[11px] font-semibold uppercase tracking-wider text-[#555555] hover:border-black transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={uploading || isSaving} 
              className="h-9 px-5 bg-black text-white rounded-md text-[11px] font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors disabled:bg-[#aaaaaa] flex items-center justify-center gap-2 min-w-[130px]"
            >
              {isSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Processing</span></> : <span>Save Changes</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}