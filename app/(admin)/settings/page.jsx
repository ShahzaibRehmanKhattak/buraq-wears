"use client";
import React, { useState, useEffect } from 'react';
import { 
  Save, Loader2, CheckCircle2, Image as ImageIcon, Settings, Truck, CreditCard, 
  SlidersHorizontal, Globe, Users, Share2, Search
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';

// Module Component Imports
import { GeneralFields } from '@/components/admin/settings/GeneralFields';
import { BrandingFields } from '@/components/admin/settings/BrandingFields';
import { HomepageFields } from '@/components/admin/settings/HomepageFields';
import { SocialFields } from '@/components/admin/settings/SocialFields';
import { SeoFields } from '@/components/admin/settings/SeoFields';
import { ContactFields } from '@/components/admin/settings/ContactFields';
import { ShippingFields } from '@/components/admin/settings/ShippingFields';
import { PaymentFields } from '@/components/admin/settings/PaymentFields';
import { FeatureFields } from '@/components/admin/settings/FeatureFields';

function SettingsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 bg-neutral-100 w-1/4 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-3 bg-neutral-100 w-1/3 rounded"></div>
            <div className="h-9 bg-neutral-50 rounded border border-neutral-100"></div>
          </div>
        ))}
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-neutral-100 w-1/5 rounded"></div>
        <div className="h-24 bg-neutral-50 rounded border border-neutral-100"></div>
      </div>
      <div className="flex justify-end pt-4 border-t border-[#eeeeee]">
        <div className="h-9 bg-neutral-100 w-36 rounded-md"></div>
      </div>
    </div>
  );
}

export default function GrandStoreSettingsStudio() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBucket, setUploadingBucket] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [storeData, setStoreData] = useState({});

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  useEffect(() => {
    async function loadMasterSettings() {
      try {
        const settingsRes = await fetch('/api/admin/settings');
        const settingsJson = await settingsRes.json();
        if (settingsJson.success) {
          setStoreData(settingsJson.data);
        }
      } catch (err) {
        console.error("Critical error pulling database structures:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMasterSettings();
  }, []);

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  const handleFieldUpdate = (moduleKey, fieldKey, value) => {
    setStoreData(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [fieldKey]: value
      }
    }));
  };

  const handleAssetUpload = async (e, bucketName, moduleKey, stateKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBucket(stateKey);
    try {
      const extension = file.name.split('.').pop();
      const randomId = Math.random().toString(36).substring(2, 10);
      const uniqueName = `asset_${randomId}_${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(uniqueName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(uniqueName);
      handleFieldUpdate(moduleKey, stateKey, publicUrl);
      triggerToast(`Asset uploaded into [${bucketName}] successfully!`);
    } catch (err) {
      triggerToast(`Upload Error: ${err.message}`);
    } finally {
      setUploadingBucket(null);
    }
  };

  const commitTabChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/settings?module=${activeTab}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData[activeTab])
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error || "Server rejected save update operations.");
      triggerToast("Configuration options updated smoothly.");
    } catch (err) {
      triggerToast(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabsList = [
    { id: 'general', label: 'General Info', icon: Settings },
    { id: 'branding', label: 'Branding & Colors', icon: ImageIcon },
    { id: 'homepage', label: 'Homepage Canvas', icon: Globe },
    { id: 'social', label: 'Social Networks', icon: Share2 },
    { id: 'seo', label: 'SEO Metadata', icon: Search },
    { id: 'contact', label: 'Contact & Maps', icon: Users },
    { id: 'shipping', label: 'Shipping Channels', icon: Truck },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'features', label: 'Engine Toggles', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex overflow-hidden font-sans antialiased w-full" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {toast.show && (
        <div className="fixed top-6 right-6 flex items-center gap-3 px-4 py-3 rounded-md border text-[12px] font-medium shadow-lg bg-black text-white border-black z-50">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span className="tracking-wide">{toast.message}</span>
        </div>
      )}

      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden border-l border-[#eeeeee]">
        <TopBar onMenuOpen={() => setSidebarCollapsed(false)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-24 lg:pb-10 no-scrollbar bg-white">
          <div className="mb-8 pb-5 border-b border-[#eeeeee]">
            <h2 className="text-[20px] font-bold tracking-tight text-black uppercase">Grand Store Configuration Hub</h2>
            <p className="text-[#777777] text-[12px] font-medium mt-0.5">Control branding files, payments, layouts, and system triggers seamlessly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="flex flex-col space-y-1 lg:col-span-1">
              {tabsList.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-md text-left transition-colors ${
                      activeTab === tab.id ? 'bg-black text-white' : 'text-[#555555] hover:bg-black/[0.04] hover:text-black'
                    } disabled:opacity-50`}
                  >
                    <TabIcon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-3 border border-[#eeeeee] p-6 bg-white rounded-md">
              {isLoading ? (
                <SettingsSkeleton />
              ) : (
                <form onSubmit={commitTabChanges} className="space-y-6">
                  
                  {/* Dynamic Modular Content Core Rendering Switch */}
                  {activeTab === 'general' && <GeneralFields data={storeData.general} onUpdate={handleFieldUpdate} />}
                  {activeTab === 'branding' && <BrandingFields data={storeData.branding} onUpdate={handleFieldUpdate} onUpload={handleAssetUpload} uploadingBucket={uploadingBucket} />}
                  {activeTab === 'homepage' && <HomepageFields data={storeData.homepage} onUpdate={handleFieldUpdate} onUpload={handleAssetUpload} />}
                  {activeTab === 'social' && <SocialFields data={storeData.social} onUpdate={handleFieldUpdate} />}
                  {activeTab === 'seo' && <SeoFields data={storeData.seo} onUpdate={handleFieldUpdate} onUpload={handleAssetUpload} />}
                  {activeTab === 'contact' && <ContactFields data={storeData.contact} onUpdate={handleFieldUpdate} />}
                  {activeTab === 'shipping' && <ShippingFields data={storeData.shipping} onUpdate={handleFieldUpdate} />}
                  {activeTab === 'payment' && <PaymentFields data={storeData.payment} onUpdate={handleFieldUpdate} />}
                  {activeTab === 'features' && <FeatureFields data={storeData.features} onUpdate={handleFieldUpdate} />}

                  <div className="flex justify-end pt-5 border-t border-[#eeeeee] mt-8">
                    <button 
                      type="submit" 
                      disabled={isSaving} 
                      className="h-9 px-6 bg-black text-white rounded-md text-[11px] font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-all disabled:bg-neutral-300 flex items-center justify-center gap-2 min-w-[160px]"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving Elements...</span>
                        </>
                      ) : (
                        <>
                          <Save size={13} />
                          <span>Commit Module Updates</span>
                        </>
                      )}
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