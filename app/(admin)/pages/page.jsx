"use client";
import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, Globe, Ruler, RefreshCw, HelpCircle, Phone, LayoutGrid } from 'lucide-react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';

// Dynamic Sub-Form Components
import { HomeHeroFields } from '@/components/admin/pages/HomeHeroFields';
import { StandardHeroFields } from '@/components/admin/pages/StandardHeroFields';
import { SizeGuideFields } from '@/components/admin/pages/SizeGuideFields';
import { ReturnsModuleFields } from '@/components/admin/pages/ReturnsModuleFields';
import { ContactPageFields } from '@/components/admin/pages/ContactPageFields';
import { FaqManagerFields } from '@/components/admin/pages/FaqManagerFields';

export default function GrandPagesStudioHub() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [pageData, setPageData] = useState({});

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  useEffect(() => {
    async function loadActivePageModule() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/pages?module=${activeTab}`);
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        } else {
          setPageData({});
        }
      } catch (err) {
        triggerToast("Failed to pull backend metadata schema matrices.");
      } finally {
        setIsLoading(false);
      }
    }
    loadActivePageModule();
  }, [activeTab]);

  const handleFlatFieldChange = (fieldKey, value) => {
    setPageData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const commitPageContentChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/pages?module=${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error || "Validation rejected.");
      triggerToast(`[/${activeTab}] canvas configurations saved cleanly.`);
    } catch (err) {
      triggerToast(`Update Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const pagesTabsList = [
    { id: 'home', label: 'Home Carousel Canvas', icon: Globe },
    { id: 'about', label: 'Standard Hero Sections', icon: LayoutGrid },
    { id: 'size-guide', label: 'Sizing Fits Matrix', icon: Ruler },
    { id: 'returns', label: 'Returns & Reverse Logistics', icon: RefreshCw },
    { id: 'contact', label: 'Contact Terminal HQ', icon: Phone },
    { id: 'faqs', label: 'Master Help FAQ System', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex overflow-hidden font-sans antialiased w-full">
      {toast.show && (
        <div className="fixed top-6 right-6 flex items-center gap-3 px-4 py-3 rounded border text-[11px] font-bold shadow-xl bg-black text-white border-black z-50 tracking-wider uppercase">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden border-l border-[#eeeeee]">
        <TopBar onMenuOpen={() => setSidebarCollapsed(false)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 lg:pb-10 no-scrollbar bg-white">
          <div className="mb-8 pb-5 border-b border-[#eeeeee]">
            <h2 className="text-[22px] font-bold tracking-tight text-black uppercase">Dynamic Content Studio</h2>
            <p className="text-[#777777] text-[12px] font-medium mt-0.5">Scale operational arrays, link parameters, or pipeline slides in real-time.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="flex flex-col space-y-1 lg:col-span-1">
              {pagesTabsList.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-md text-left transition-colors ${
                      activeTab === tab.id ? 'bg-black text-white' : 'text-[#555555] hover:bg-black/[0.04]'
                    }`}
                  >
                    <TabIcon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-3 border border-[#eeeeee] p-6 bg-white rounded-md">
              {isLoading ? (
                <div className="space-y-4 py-6">
                  <div className="h-4 bg-neutral-100 w-1/4 rounded animate-pulse"></div>
                  <div className="h-32 bg-neutral-50 rounded border animate-pulse"></div>
                </div>
              ) : (
                <form onSubmit={commitPageContentChanges} className="space-y-8">
                  
                  {activeTab === 'home' && (
                    <HomeHeroFields 
                      slides={pageData.home_carousel_slides || []} 
                      onChange={(val) => handleFlatFieldChange('home_carousel_slides', val)} 
                    />
                  )}
                  
                  {activeTab === 'about' && (
                    <StandardHeroFields 
                      matrixItems={pageData.standard_heroes_matrix || []} 
                      onChange={(val) => handleFlatFieldChange('standard_heroes_matrix', val)} 
                    />
                  )}
                  
                  {activeTab === 'size-guide' && <SizeGuideFields imperial={pageData.sizing_matrix_imperial || []} metric={pageData.sizing_matrix_metric || []} profileText={pageData.sizing_fit_profile_text || ''} onUpdate={handleFlatFieldChange} />}
                  {activeTab === 'returns' && <ReturnsModuleFields directives={pageData.returns_directives || []} faqs={pageData.returns_faqs || []} onUpdate={handleFlatFieldChange} />}
                  {activeTab === 'contact' && <ContactPageFields loc={pageData.contact_hub_location || ''} mail={pageData.contact_receiver_email || ''} phone={pageData.contact_support_phone || ''} hours={pageData.contact_operational_hours || ''} onUpdate={handleFlatFieldChange} />}
                  {activeTab === 'faqs' && <FaqManagerFields items={pageData.master_faqs_list || []} onChange={(val) => handleFlatFieldChange('master_faqs_list', val)} />}

                  <div className="flex justify-end pt-5 border-t border-[#eeeeee] mt-8">
                    <button 
                      type="submit" 
                      disabled={isSaving} 
                      className="h-11 px-8 bg-black text-white rounded text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all disabled:bg-neutral-300 flex items-center justify-center gap-2"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={14} />}
                      <span>Deploy Configurations</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}