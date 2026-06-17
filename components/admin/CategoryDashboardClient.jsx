"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutGrid, Search, TrendingUp, TrendingDown, Eye, Share2, 
  ShoppingCart, Receipt, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, Filter, User, Settings, LogOut, Check, Edit2, Trash2,
  UploadCloud, Package, Layers, BarChart2, ChevronDown
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { MetricCard } from "@/components/admin/MetricCards";
import { GlassCard } from "@/components/admin/GlassCard";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/Topbar";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function CategoryDashboardClient({ initialCategories = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <div className="min-h-screen bg-white text-black flex font-sans antialiased selection:bg-black/[0.06] overflow-x-hidden relative">
      
      {/* SIDEBAR NAVIGATION */}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* PRIMARY CONSOLE DESK */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <TopBar />

        <main className="p-6 lg:p-8 flex-1 w-full max-w-[1600px] mx-auto space-y-6">
          
          {/* TOP HEADER CLUSTER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-5 gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#777777]">Core Modules</span>
              <h1 className="text-[18px] font-semibold tracking-wide text-black mt-0.5">Categories Workspace</h1>
            </div>
            <button
              onClick={() => openDrawer()}
              className="h-8 bg-black hover:bg-neutral-900 text-white font-medium text-[12px] px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus size={14} strokeWidth={2} /> Add Category
            </button>
          </div>

          {/* SYSTEM OVERVIEW METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Total Groupings" value={metrics.total} trend="+4% this wk" trendUp={true} icon={Layers} isPrimary={true} />
            <MetricCard title="Active Channels" value={metrics.active} trend="+12% MoM" trendUp={true} icon={Eye} />
            <MetricCard title="Featured Nodes" value={metrics.featured} trend="-2% vs yesterday" trendUp={false} icon={ShoppingCart} />
            <MetricCard title="Storage Volume" value={metrics.totalVolume.toLocaleString()} trend="Optimal Capacity" trendUp={true} icon={Receipt} />
          </div>

          {/* FILTERING MATRIX LAYER */}
          <div className="border border-[#eeeeee] p-3 flex flex-col md:flex-row gap-4 justify-between items-center rounded-md bg-white">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" size={13} />
              <input
                type="text"
                placeholder="Filter by name or identifier slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#dddddd] rounded-md h-8 pl-8 pr-3 text-[12px] font-normal focus:outline-none focus:border-black transition-colors text-black placeholder:text-[#999999]"
              />
            </div>
            
            <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
              {["All", "Unisex", "Men", "Women", "Kids"].map((audience) => (
                <button
                  key={audience}
                  onClick={() => setSelectedAudience(audience)}
                  className={`px-2.5 h-7 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                    selectedAudience === audience 
                      ? 'bg-black text-white' 
                      : 'text-[#555555] hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  {audience}
                </button>
              ))}
            </div>
          </div>

          {/* CORE ARCHITECTURAL METADATA SHEET TABLE */}
          <div className="overflow-x-auto border border-[#eeeeee] rounded-md bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eeeeee] text-[11px] font-semibold text-[#555555] tracking-wide">
                  <th className="py-3 px-4 pl-5">Nomenclature & Identity</th>
                  <th className="py-3 px-4 w-40">Structural Node</th>
                  <th className="py-3 px-4 w-32">Target Matrix</th>
                  <th className="py-3 px-4 text-center w-32">Active</th>
                  <th className="py-3 px-4 text-center w-32">Featured</th>
                  <th className="py-3 px-4 text-right pr-5 w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeee] text-[13px] text-black">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#777777] font-medium tracking-wide">
                      No operational records found matching filter constraints.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-black/[0.01] transition-colors duration-500">
                      <td className="py-3.5 px-4 pl-5">
                        <div className="flex items-center gap-3">
                          {category.image_url ? (
                            <img src={category.image_url} alt="" className="w-8 h-8 rounded-sm object-cover border border-[#eeeeee] bg-[#fcfcfc]" />
                          ) : (
                            <div className="w-8 h-8 rounded-sm bg-black/[0.04] flex items-center justify-center text-black font-semibold text-[11px]">
                              {category.name?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-[13px] text-black tracking-wide leading-tight">{category.name}</div>
                            <div className="text-[#777777] text-[11px] font-mono mt-0.5">{category.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-black/[0.04] text-black border border-black/[0.03] px-1.5 py-0.5 rounded-sm text-[11px] font-medium">
                          {category.classification_node || 'Parent Node'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#555555] font-normal">
                        {category.target_audience}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${category.is_active ? 'text-[#00875a]' : 'text-[#de350b]'}`}>
                          <Check size={14} strokeWidth={category.is_active ? 3 : 1} />
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-sm ${category.is_featured ? 'bg-[#fffae6] text-[#b35900]' : 'text-[#999999]'}`}>
                          {category.is_featured ? 'Featured' : 'Standard'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openDrawer(category)} className="p-1.5 border border-transparent hover:border-[#dddddd] text-[#555555] hover:text-black rounded-md transition-colors">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 border border-transparent hover:border-red-200 text-[#555555] hover:text-[#de350b] rounded-md transition-colors">
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

      {/* --- SIDE CONTROL SLIDE DRAWER COMPONENT --- */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${isDrawerOpen ? "visible" : "invisible opacity-0"}`}>
        <div className="absolute inset-0 bg-black/20" onClick={() => setIsDrawerOpen(false)} />
        
        <div className={`relative w-full max-w-md h-full bg-white border-l border-black/10 flex flex-col z-10 transition-transform duration-300 ease-out transform ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#eeeeee] flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-[14px] font-semibold tracking-wide text-black">
                {formData.id ? "Modify Node Parameters" : "Provision New Category"}
              </h2>
              <p className="text-[11px] text-[#777777] font-normal mt-0.5">Database Write Manifest Interface</p>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Main Form Fields Container */}
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-[12px] text-black font-normal no-scrollbar">
            {globalError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-md text-[#de350b] font-medium">
                Transaction Failure: {globalError}
              </div>
            )}

            {/* MEDIA ASSET CONTAINER */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Media Cover Asset</label>
              
              {formData.image_url ? (
                <div className="relative group rounded-md border border-[#eeeeee] overflow-hidden h-36 bg-[#fcfcfc]">
                  <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-white hover:bg-red-50 text-[#de350b] border border-[#dddddd] px-3 h-7 rounded-md text-[11px] font-medium transition-colors shadow-sm"
                    >
                      Purge File From Record
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed border-[#dddddd] hover:border-black rounded-md p-5 text-center cursor-pointer transition-colors bg-[#fcfcfc] flex flex-col items-center justify-center h-36 ${uploadingMedia ? "opacity-40 pointer-events-none" : ""}`}
                >
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLocalImageUpload} className="hidden" />
                  <UploadCloud size={22} className="text-[#777777] mb-1.5" />
                  <span className="font-medium text-black text-[12px]">
                    {uploadingMedia ? "Writing Raw Bytes..." : "Upload local asset file"}
                  </span>
                  <span className="text-[10px] text-[#888888] mt-0.5 font-normal">PNG, JPG, WEBP up to 5MB</span>
                </div>
              )}
            </div>

            {/* INPUT MATRIX FIELDS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Node Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#dddddd] rounded-md h-8 px-3 text-[12px] font-medium focus:outline-none focus:border-black transition-colors text-black placeholder:text-[#999999]"
                  placeholder="e.g., Leather Jackets"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Slug Key (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                  className="w-full bg-white border border-[#dddddd] rounded-md h-8 px-3 font-mono text-[11px] focus:outline-none focus:border-black transition-colors text-black placeholder:text-[#999999]"
                  placeholder="leather-jackets"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Overview Description</label>
              <textarea
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-[#dddddd] rounded-md p-2 text-[12px] focus:outline-none focus:border-black transition-colors text-black resize-none placeholder:text-[#999999]"
                placeholder="Articulate metadata details regarding structural configuration..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Classification Level</label>
                <div className="relative w-full">
                  <select
                    value={formData.classification_node}
                    onChange={(e) => setFormData({ ...formData, classification_node: e.target.value })}
                    className="w-full appearance-none h-8 pl-3 pr-8 text-[12px] font-medium bg-white border border-[#dddddd] rounded-md focus:outline-none focus:border-black text-black transition-colors"
                  >
                    <option value="Parent Category">Parent Structural Node</option>
                    <option value="Sub Category">Sub-Category Cluster</option>
                    <option value="Collection Set">Exclusive Collection</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Target Segment</label>
                <div className="relative w-full">
                  <select
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    className="w-full appearance-none h-8 pl-3 pr-8 text-[12px] font-medium bg-white border border-[#dddddd] rounded-md focus:outline-none focus:border-black text-black transition-colors"
                  >
                    <option value="Unisex">Unisex Matrix</option>
                    <option value="Men">Men Segmentation</option>
                    <option value="Women">Women Segmentation</option>
                    <option value="Kids">Kids Department</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Volume Units</label>
                <input
                  type="number"
                  value={formData.volume_units}
                  onChange={(e) => setFormData({ ...formData, volume_units: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-[#dddddd] rounded-md h-8 px-3 text-[12px] font-medium focus:outline-none focus:border-black transition-colors text-black"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Sorting Priority</label>
                <input
                  type="number"
                  value={formData.display_priority}
                  onChange={(e) => setFormData({ ...formData, display_priority: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-[#dddddd] rounded-md h-8 px-3 text-[12px] font-medium focus:outline-none focus:border-black transition-colors text-black"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#eeeeee] space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-[#777777] uppercase">Search Engine Optimization (SEO)</p>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#555555] tracking-wide">Keywords</label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  className="w-full bg-white border border-[#dddddd] rounded-md h-8 px-3 focus:outline-none focus:border-black transition-colors text-black placeholder:text-[#999999]"
                  placeholder="leather, coats, minimal fashion"
                />
              </div>
            </div>

            {/* SELECTION BOOLEAN CHECKBOX MATRIX */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2.5 p-2.5 border border-[#eeeeee] rounded-md cursor-pointer select-none bg-white hover:bg-black/[0.01] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="accent-black w-3.5 h-3.5 rounded-sm"
                />
                <div>
                  <div className="font-semibold text-black text-[12px]">Active Status</div>
                  <div className="text-[10px] text-[#777777] font-normal mt-0.5">Publicly visible</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 border border-[#eeeeee] rounded-md cursor-pointer select-none bg-white hover:bg-black/[0.01] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="accent-black w-3.5 h-3.5 rounded-sm"
                />
                <div>
                  <div className="font-semibold text-black text-[12px]">Highlight Banner</div>
                  <div className="text-[10px] text-[#777777] font-normal mt-0.5">Promoted node</div>
                </div>
              </label>
            </div>

            {/* TRIGGER CONTROL ACTIONS */}
            <div className="pt-4 flex gap-2 border-t border-[#eeeeee] sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 border border-[#dddddd] bg-white hover:border-black text-black font-medium h-9 rounded-md transition-colors text-[12px]"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-black hover:bg-neutral-900 disabled:bg-neutral-400 text-white font-medium h-9 rounded-md transition-colors text-[12px]"
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