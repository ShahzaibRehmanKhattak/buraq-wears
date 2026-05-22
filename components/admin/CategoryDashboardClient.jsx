"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutGrid, Search, TrendingUp, TrendingDown, Eye, Share2, 
  ShoppingCart, Receipt, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, Filter, User, Settings, LogOut, Check, Edit2, Trash2,
  UploadCloud, Package, Layers, BarChart2,
  
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { MetricCard } from "@/components/admin/MetricCards";
import { GlassCard } from "@/components/admin/GlassCard";
import {Sidebar} from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/Topbar";
// Initialize client-side Supabase object instance
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);



export default function CategoryDashboardClient({ initialCategories = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  
  // App Shell UI State Trees
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Media Engine State Machine Hooks
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Payload Matrix Blueprint Data Map Form Layout
  const initialFormState = {
    id: null,
    name: "",
    slug: "",
    description: "",
    volume_units: 0,
    is_active: true,
    is_featured: false,
    classification_node: "Parent Category",
    target_audience: "Unisex",
    display_priority: 0,
    image_url: "",
    seo_keywords: "",
    seo_description: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // Calculated Real-time Administrative Workspace Operational Metadata
  const metrics = {
    total: categories.length,
    active: categories.filter(c => c.is_active).length,
    featured: categories.filter(c => c.is_featured).length,
    totalVolume: categories.reduce((acc, curr) => acc + (Number(curr.volume_units) || 0), 0)
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = selectedAudience === "All" || category.target_audience === selectedAudience;
    return matchesSearch && matchesAudience;
  });

  const openDrawer = (category = null) => {
    if (category) {
      setFormData({ ...category });
    } else {
      setFormData(initialFormState);
    }
    setGlobalError(null);
    setIsDrawerOpen(true);
  };

  // --- LOCAL COMPUTER FILE ATTACHMENT SYSTEM UPLOAD METHOD ---
  const handleLocalImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setGlobalError(null);

    try {
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
      const storageFilePath = `categories/${uniqueFileName}`;

      const { data, error: uploadError } = await supabaseClient.storage
        .from("category-media")
        .upload(storageFilePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseClient.storage
        .from("category-media")
        .getPublicUrl(storageFilePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      setGlobalError(`Media Storage Stream Disrupted: ${err.message}`);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setGlobalError(null);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const payload = await res.json();
      if (!payload.success) throw new Error(payload.error || "Save execution error.");

      setIsDrawerOpen(false);
      startTransition(() => { router.refresh(); });
      
      if (formData.id) {
        setCategories(prev => prev.map(c => c.id === formData.id ? { ...formData } : c));
      } else {
        setCategories(prev => [{ ...formData, id: crypto.randomUUID() }, ...prev]);
      }
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to permanently erase this classification node?")) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const payload = await res.json();
      if (!payload.success) throw new Error(payload.error);

      setCategories(prev => prev.filter(c => c.id !== id));
      startTransition(() => { router.refresh(); });
    } catch (err) {
      alert(`Error eliminating record node: ${err.message}`);
    }
  };
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex font-sans selection:bg-black selection:text-white overflow-x-hidden relative">
      
      {/* PERSISTENT RESPONSIVE SIDEBAR NAVIGATION COMPONENT */}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* COMPREHENSIVE WORKSPACE DESK AREA */}
      <div className="flex-1 flex flex-col transition-all duration-300 ">
        
        {/* COMPREHENSIVE TOPBAR MODULE */}
      
          <TopBar/>
        {/* PRIMARY MAIN CONSOLE INTERACTION PANEL */}
        <main className="p-6 lg:p-10 flex-1">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Inventory Core</span>
              <h1 className="text-2xl font-black tracking-tight text-black">Categories Control Desk</h1>
            </div>
            <button
              onClick={() => openDrawer()}
              className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 self-start sm:self-auto"
            >
              <Plus size={15} strokeWidth={2.5} /> Add Category Node
            </button>
          </div>

          {/* DYNAMIC INTEGRATED GRID RENDER VIA ORIGINAL SPEC METRICCARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <MetricCard title="Total Groupings" value={metrics.total} trend="+4% this wk" trendUp={true} icon={Layers} isPrimary={true} />
            <MetricCard title="Active Channels" value={metrics.active} trend="+12% MoM" trendUp={true} icon={Eye} />
            <MetricCard title="Featured Nodes" value={metrics.featured} trend="-2% vs yesterday" trendUp={false} icon={ShoppingCart} />
            <MetricCard title="Aggregated Storage Units" value={metrics.totalVolume.toLocaleString()} trend="Optimal Capacity" trendUp={true} icon={Receipt} />
          </div>

          {/* SEARCH CRITERIA BLOCK MOUNTED ON ORIGINAL GLASSCARD OBJECT LAYER */}
          <GlassCard className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Query category nomenclature or identifier slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50/50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-black placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex gap-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {["All", "Unisex", "Men", "Women", "Kids"].map((audience) => (
                <button
                  key={audience}
                  onClick={() => setSelectedAudience(audience)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all whitespace-nowrap ${selectedAudience === audience ? 'bg-black text-white shadow-sm' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100/60'}`}
                >
                  {audience}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* MAIN ADMINISTRATIVE LOGISTICS VIEW PANEL */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-xs bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-[9px] font-black tracking-widest text-gray-400 uppercase">
                  <th className="p-4 pl-6">Nomenclature & Identity</th>
                  <th className="p-4">Structural Node</th>
                  <th className="p-4">Target Matrix</th>
                  <th className="p-4 text-center">Active Status</th>
                  <th className="p-4 text-center">Featured Status</th>
                  <th className="p-4 text-right pr-6">Action Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-slate-600">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400 font-bold uppercase tracking-wider">
                      No operational records found matching search queries.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          {category.image_url ? (
                            <img src={category.image_url} alt={category.name} className="w-9 h-9 rounded-xl object-cover border border-gray-100 shadow-2xs" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-black font-black text-[10px]">
                              {category.name?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-black text-sm leading-snug">{category.name}</div>
                            <div className="text-gray-400 text-[10px] font-mono tracking-tight">{category.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200/40">
                          {category.classification_node || 'Parent Node'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">{category.target_audience}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${category.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          <Check size={12} strokeWidth={category.is_active ? 3 : 1} />
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${category.is_featured ? 'bg-amber-50 text-amber-600 border border-amber-200/50' : 'text-gray-300'}`}>
                          {category.is_featured ? 'Featured' : 'Standard'}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openDrawer(category)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDeleteCategory(category.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* --- SMOOTH TRANSITION SLIDE-OVER CONTROL DRAWER PANEL --- */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ease-in-out ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setIsDrawerOpen(false)} />
        
        {/* Slids over cleanly along X axis */}
        <div className={`relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out transform border-l border-gray-100 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-black tracking-tight text-black">
                {formData.id ? "Modify Node Parameters" : "Provision New Category"}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Database Write Interface</p>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-200/60 rounded-xl transition-all">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-semibold text-slate-800 scrollbar-thin">
            {globalError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-bold tracking-wide">
                Transaction Failure: {globalError}
              </div>
            )}

            {/* COMPUTER LOCAL FILE MEDIA LOADER & CLEAN REMOVE MECHANISM */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Media Cover Asset</label>
              
              {formData.image_url ? (
                <div className="relative group rounded-2xl border border-gray-100 overflow-hidden shadow-2xs h-40 bg-slate-50">
                  <img src={formData.image_url} alt="Uploaded Media Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-white hover:bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Purge File From Record
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-gray-200 hover:border-black rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 flex flex-col items-center justify-center h-40 ${uploadingMedia ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={handleLocalImageUpload} 
                    className="hidden" 
                  />
                  <UploadCloud size={28} className="text-gray-400 mb-2 group-hover:text-black transition-colors" />
                  <span className="font-bold text-slate-700 text-xs">
                    {uploadingMedia ? "Writing Raw Bytes to Storage..." : "Upload from Computer"}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest font-bold">PNG, JPG, WEBP up to 5MB</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Node Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="e.g., Premium Leather Jackets"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Slug Key (URL Identifier)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                  className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="premium-leather-jackets"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Public Overview Description</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                placeholder="Articulate details regarding structural classification parameters..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Classification Level</label>
                <select
                  value={formData.classification_node}
                  onChange={(e) => setFormData({ ...formData, classification_node: e.target.value })}
                  className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                >
                  <option value="Parent Category">Parent Structural Node</option>
                  <option value="Sub Category">Sub-Category Cluster</option>
                  <option value="Collection Set">Exclusive Collection Capsule</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Segment</label>
                <select
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                >
                  <option value="Unisex">Unisex Matrix</option>
                  <option value="Men">Men Segmentation</option>
                  <option value="Women">Women Segmentation</option>
                  <option value="Kids">Kids Department</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Volume Resource Units</label>
                <input
                  type="number"
                  value={formData.volume_units}
                  onChange={(e) => setFormData({ ...formData, volume_units: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Display Sorting Priority</label>
                <input
                  type="number"
                  value={formData.display_priority}
                  onChange={(e) => setFormData({ ...formData, display_priority: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-3">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Search Engine Optimization (SEO)</p>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Keywords</label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  className="w-full bg-slate-50/70 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="leather, coats, minimal fashion"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <label className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-gray-100 cursor-pointer select-none hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="accent-black w-4 h-4 rounded-md"
                />
                <div>
                  <div className="font-bold text-black text-xs">Active Status</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Visible Publicly</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-gray-100 cursor-pointer select-none hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="accent-black w-4 h-4 rounded-md"
                />
                <div>
                  <div className="font-bold text-black text-xs">Highlight Banner</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Promoted Node</div>
                </div>
              </label>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-black font-bold uppercase tracking-widest p-3.5 rounded-xl transition-colors text-[10px]"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-bold uppercase tracking-widest p-3.5 rounded-xl transition-all text-[10px]"
              >
                {isSaving ? "Processing..." : "Commit Structure"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}