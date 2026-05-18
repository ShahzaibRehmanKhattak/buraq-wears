"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { X, Edit3, DollarSign, Package, Layers, Image as ImageIcon, Eye, UploadCloud, Plus } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, editProduct, onSaveSuccess }) {
  const [loading, setLoading] = useState(false);

  // Core Form Fields State mapped to SQL definitions
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    brand: 'IBNA',
    category: 'Apparel',
    description: '',
    price: '',
    discount_price: '',
    stock_quantity: '0',
    sku: '',
    sizes: [],
    colors: ['#000000'],
    thumbnail_url: '',
    images_gallery: [],
    is_featured: false,
    is_published: true
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];
  const defaultColors = ['#000000', '#E5E5E5', '#D1C9BC', '#2A352F'];

  // Automatically switch between Insert and Update modes based on the edit target
  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title || '',
        slug: editProduct.slug || '',
        brand: editProduct.brand || 'IBNA',
        category: editProduct.category || 'Apparel',
        description: editProduct.description || '',
        price: editProduct.price || '',
        discount_price: editProduct.discount_price || '',
        stock_quantity: editProduct.stock_quantity?.toString() || '0',
        sku: editProduct.sku || '',
        sizes: editProduct.sizes || [],
        colors: editProduct.colors || ['#000000'],
        thumbnail_url: editProduct.thumbnail_url || '',
        images_gallery: editProduct.images_gallery || [],
        is_featured: editProduct.is_featured || false,
        is_published: editProduct.is_published !== undefined ? editProduct.is_published : true
      });
    } else {
      // Reset form default structural properties for fresh items
      setFormData({
        title: '',
        slug: '',
        brand: 'IBNA',
        category: 'Apparel',
        description: '',
        price: '',
        discount_price: '',
        stock_quantity: '0',
        sku: '',
        sizes: [],
        colors: ['#000000'],
        thumbnail_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600', // Mock item fallback values
        images_gallery: [],
        is_featured: false,
        is_published: true
      });
    }
  }, [editProduct, isOpen]);

  // Sync title inputs directly down to URL Slugs automatically on creation
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editProduct ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const activeSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: activeSizes };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0.00,
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      stock_quantity: parseInt(formData.stock_quantity, 10) || 0
    };

    try {
      if (editProduct?.id) {
        // Execute Update Target
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editProduct.id);

        if (error) throw error;
      } else {
        // Execute Fresh Insert Operation 
        const { error } = await supabase
          .from('products')
          .insert([payload]);

        if (error) throw error;
      }

      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Failed processing operation updates on Supabase targets:', err.message);
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#f9f9f9] shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Grid Context */}
        <header className="flex justify-between items-center px-6 h-16 w-full z-50 bg-[#f9f9f9]/95 backdrop-blur-md border-b border-[#cfc4c5]/40 shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-black">
            {editProduct ? 'Edit Product' : 'Add Product'}
          </h1>
          <button onClick={onClose} className="p-2 hover:bg-[#e8e8e8] transition-colors rounded-full">
            <X size={18} className="text-black" />
          </button>
        </header>

        {/* Form Body Scroll Track */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-28">
          
          {/* SECTION 1: Basic Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#cfc4c5]/40 pb-2">
              <Edit3 size={16} className="text-[#5e5e5e]" />
              <h2 className="text-xs font-semibold text-[#5e5e5e] uppercase tracking-widest">Basic Information</h2>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Product Title</label>
                <input 
                  type="text" required value={formData.title} onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm placeholder:text-[#cfc4c5]"
                  placeholder="e.g. Minimalist Linen Shirt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#5e5e5e]">Slug</label>
                  <input 
                    type="text" required name="slug" value={formData.slug} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm bg-gray-50 text-gray-500"
                    placeholder="linen-shirt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#5e5e5e]">Brand</label>
                  <input 
                    type="text" name="brand" value={formData.brand} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm"
                    placeholder="IBNA"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Category</label>
                <select 
                  name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm appearance-none"
                >
                  <option value="Shirts">Shirts</option>
                  <option value="Trousers">Trousers</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Atelier">Atelier</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Description</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleInputChange} rows="3"
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm resize-none"
                  placeholder="Describe the premium details..."
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Pricing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#cfc4c5]/40 pb-2">
              <DollarSign size={16} className="text-[#5e5e5e]" />
              <h2 className="text-xs font-semibold text-[#5e5e5e] uppercase tracking-widest">Pricing Strategy</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Base Price ($)</label>
                <input 
                  type="number" step="0.01" required name="price" value={formData.price} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Discount Price ($)</label>
                <input 
                  type="number" step="0.01" name="discount_price" value={formData.discount_price} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: Inventory */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#cfc4c5]/40 pb-2">
              <Package size={16} className="text-[#5e5e5e]" />
              <h2 className="text-xs font-semibold text-[#5e5e5e] uppercase tracking-widest">Inventory Control</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Stock Quantity</label>
                <input 
                  type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm"
                  placeholder="100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">SKU</label>
                <input 
                  type="text" name="sku" value={formData.sku} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm"
                  placeholder="IB-LNS-001"
                />
              </div>
            </div>
          </section>

          {/* SECTION 4: Variants */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#cfc4c5]/40 pb-2">
              <Layers size={16} className="text-[#5e5e5e]" />
              <h2 className="text-xs font-semibold text-[#5e5e5e] uppercase tracking-widest">Product Variants</h2>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#5e5e5e]">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => {
                    const selected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button" key={size} onClick={() => toggleSize(size)}
                        className={`px-4 py-1.5 border text-xs font-semibold tracking-wider transition-all duration-150 ${
                          selected 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-black border-[#cfc4c5] hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#5e5e5e]">Color Palette</label>
                <div className="flex flex-wrap gap-3 items-center">
                  {defaultColors.map(color => (
                    <div 
                      key={color} style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full border border-black/10 cursor-pointer ring-2 ring-offset-2 ${
                        formData.colors.includes(color) ? 'ring-black' : 'ring-transparent'
                      }`}
                    />
                  ))}
                  <button type="button" className="w-7 h-7 rounded-full border border-dashed border-[#cfc4c5] flex items-center justify-center hover:bg-[#e8e8e8] text-gray-500">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Images */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#cfc4c5]/40 pb-2">
              <ImageIcon size={16} className="text-[#5e5e5e]" />
              <h2 className="text-xs font-semibold text-[#5e5e5e] uppercase tracking-widest">Visual Assets</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Main Thumbnail Image URL</label>
                <input 
                  type="text" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-[#cfc4c5] rounded-none focus:ring-0 focus:border-black outline-none text-sm mb-2"
                  placeholder="Paste direct product image asset link..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#5e5e5e]">Product Gallery Drop-Zone</label>
                <div className="w-full border border-dashed border-[#cfc4c5] bg-white p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <UploadCloud size={32} className="text-[#5e5e5e] mb-2" />
                  <p className="text-xs text-black font-medium mb-0.5">Drag and drop assets here</p>
                  <p className="text-[10px] text-gray-400 font-medium mb-3">PNG, JPG or WebP images up to 10MB each</p>
                  <button type="button" className="px-4 py-1.5 border border-black text-[10px] font-bold tracking-wider hover:bg-black hover:text-white transition-all">
                    BROWSE FILES
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: Product Visibility */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#cfc4c5]/40 pb-2">
              <Eye size={16} className="text-[#5e5e5e]" />
              <h2 className="text-xs font-semibold text-[#5e5e5e] uppercase tracking-widest">Visibility</h2>
            </div>
            <div className="space-y-4 pt-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-black">Featured Product</p>
                  <p className="text-xs text-[#5e5e5e]">Show in primary home collections</p>
                </div>
                <button 
                  type="button" onClick={() => setFormData(p => ({ ...p, is_featured: !p.is_featured }))}
                  className={`w-11 h-6 rounded-full relative p-1 transition-colors duration-200 ${formData.is_featured ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.is_featured ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-black">Publish Instantly</p>
                  <p className="text-xs text-[#5e5e5e]">Make product visible on public storefront</p>
                </div>
                <button 
                  type="button" onClick={() => setFormData(p => ({ ...p, is_published: !p.is_published }))}
                  className={`w-11 h-6 rounded-full relative p-1 transition-colors duration-200 ${formData.is_published ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.is_published ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>

        </form>

        {/* Sticky Action Footer */}
        <footer className="absolute bottom-0 left-0 w-full bg-white border-t border-[#cfc4c5]/40 p-4 grid grid-cols-2 gap-3 shrink-0 z-50">
          <button 
            type="button" onClick={onClose} disabled={loading}
            className="px-4 py-3 border border-[#cfc4c5] text-black font-bold text-xs tracking-widest hover:bg-gray-50 transition-colors uppercase disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" onClick={handleFormSubmit} disabled={loading}
            className="px-4 py-3 bg-black text-white font-bold text-xs tracking-widest hover:bg-black/90 transition-all uppercase disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Processing...' : editProduct ? 'Update Product' : 'Save Product'}
          </button>
        </footer>

      </div>
    </div>
  );
}