"use client";
import React, { useState, useEffect } from 'react';
import { 
  Plus, Globe, Shield, Bell, Users, Save, Layout,
  Loader2, CheckCircle2, Sliders, Image, Trash2, Info 
} from 'lucide-react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/Topbar';

export default function SettingsPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('branding');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Baseline initial structural state matching your backend database maps
  const [settings, setSettings] = useState({
    storeName: 'IBNA Atelier Suite',
    tagline: 'Minimalist Ready-To-Wear & Tailored Essentials',
    logoUrl: 'https://ibna-atelier.com/assets/logo-black.png',
    faviconUrl: 'https://ibna-atelier.com/favicon.ico',
    supportEmail: 'operations@ibna-atelier.com',
    contactPhone: '+1 (555) 019-2831',
    primaryColor: '#000000',
    accentColor: '#777777',
    backgroundColor: '#ffffff',
    fontFamily: 'sans-serif',
    cornerRadius: 'square-cut',
    enableHeroBanner: true,
    enableMarqueeAnnouncement: true,
    announcementText: 'Complimentary worldwide express shipping on all orders over $350',
    currency: 'USD',
    taxRate: '12.5',
    enableGuestCheckout: true,
    requirePhoneForShipping: true,
    freeShippingThreshold: '350',
    flatShippingRate: '25.00',
    enableStockWarnings: true,
    lowStockThreshold: '10'
  });

  // Fetch settings baseline parameters on component render
  useEffect(() => {
    async function loadSystemSettings() {
      try {
        const response = await fetch('/api/admin/settings');
        const json = await response.json();
        
        if (json.success && json.data) {
          const db = json.data;
          // Re-map underscores from snake_case database schema back to camelCase form elements
          setSettings({
            storeName: db.store_name || '',
            tagline: db.tagline || '',
            logoUrl: db.logo_url || '',
            faviconUrl: db.favicon_url || '',
            supportEmail: db.support_email || '',
            contactPhone: db.contact_phone || '',
            primaryColor: db.primary_color || '#000000',
            accentColor: db.accent_color || '#777777',
            backgroundColor: db.background_color || '#ffffff',
            fontFamily: db.font_family || 'sans-serif',
            cornerRadius: db.corner_radius || 'square-cut',
            enableHeroBanner: db.enable_hero_banner !== undefined ? db.enable_hero_banner : true,
            enableMarqueeAnnouncement: db.enable_marquee_announcement !== undefined ? db.enable_marquee_announcement : true,
            announcementText: db.announcement_text || '',
            currency: db.currency || 'USD',
            taxRate: db.tax_rate ? String(db.tax_rate) : '0.00',
            enableGuestCheckout: db.enable_guest_checkout !== undefined ? db.enable_guest_checkout : true,
            requirePhoneForShipping: db.require_phone_for_shipping !== undefined ? db.require_phone_for_shipping : true,
            freeShippingThreshold: db.free_shipping_threshold ? String(db.free_shipping_threshold) : '0',
            flatShippingRate: db.flat_shipping_rate ? String(db.flat_shipping_rate) : '0',
            enableStockWarnings: db.enable_stock_warnings !== undefined ? db.enable_stock_warnings : true,
            lowStockThreshold: db.low_stock_threshold ? String(db.low_stock_threshold) : '10'
          });
        }
      } catch (err) {
        console.error("Configuration sync failure:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSystemSettings();
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      const json = await response.json();
      if (json.success) {
        triggerToast("Global database parameters committed smoothly.", "success");
      } else {
        throw new Error(json.error || "Mutation rejected by server rules.");
      }
    } catch (err) {
      triggerToast(err.message || "Failed to sync changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'branding', label: 'Identity & Logos', icon: Image },
    { id: 'theme', label: 'Storefront Theme Layout', icon: Layout },
    { id: 'commerce', label: 'Checkout & Rules', icon: Sliders },
  ];

  const inputStyle = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 h-9 text-[12px] font-medium text-black transition-all placeholder-[#999999] focus:border-black focus:ring-1 focus:ring-black outline-none";
  const labelStyle = "block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1.5";
  const sectionTitleStyle = "text-[12px] font-bold uppercase tracking-widest text-black mb-4 pb-1.5 border-b border-[#eeeeee] mt-6 first:mt-0";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-5 h-5 text-black animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#777777]">Synchronizing Terminal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-black flex overflow-hidden font-sans antialiased" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* System Toast Flash Module */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[120] flex items-center gap-3 px-4 py-3 rounded-md border text-[12px] font-medium ${
          toast.type === 'success' ? 'bg-black text-white border-black' : 'bg-red-600 text-white border-red-600'
        }`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Sidebar Core Dynamic Management Component */}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden border-l border-[#eeeeee]">
        {/* TopBar Infrastructure Node */}
        <TopBar onMenuOpen={() => setSidebarCollapsed(false)} />

        {/* Global Configuration Content Frame */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 pb-24 lg:pb-10 no-scrollbar bg-white">
          
          {/* TERMINAL OPERATIONS HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#eeeeee]">
            <div>
              <h2 className="text-[20px] font-bold tracking-tight text-black uppercase">Global Control Studio</h2>
              <p className="text-[#777777] text-[12px] font-medium mt-0.5">Configure public identity parameters, layout theme variables, and active checkouts execution vectors.</p>
            </div>
          </div>

          {/* TWO-COLUMN GRID ARCHITECTURE */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* SUBSECTION TAB SELECTOR PANEL */}
            <div className="flex flex-col space-y-1 lg:col-span-1">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isTabActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-md text-left transition-colors ${
                      isTabActive 
                        ? 'bg-black text-white' 
                        : 'text-[#555555] hover:bg-black/[0.04] hover:text-black'
                    }`}
                  >
                    <TabIcon size={14} strokeWidth={isTabActive ? 2.5 : 1.75} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* FORM CONFIGURATION PANEL SPACE */}
            <div className="lg:col-span-3 border border-[#eeeeee] p-6 bg-white rounded-md">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* BRANDING IDENTITY TARGET MAPS */}
                {activeTab === 'branding' && (
                  <div className="space-y-5">
                    <h4 className={sectionTitleStyle}>1. Public Core Identities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Storefront Suite Name</label>
                        <input type="text" className={inputStyle} value={settings.storeName} onChange={e => handleChange('storeName', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelStyle}>Global Index Tagline</label>
                        <input type="text" className={inputStyle} value={settings.tagline} onChange={e => handleChange('tagline', e.target.value)} />
                      </div>
                    </div>

                    <h4 className={sectionTitleStyle}>2. Public Asset Target URL Paths</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className={labelStyle}>Primary Vector Logo (.png / .svg)</label>
                        <input type="text" className={inputStyle} value={settings.logoUrl} onChange={e => handleChange('logoUrl', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelStyle}>Browser Favicon Node Path (.ico)</label>
                        <input type="text" className={inputStyle} value={settings.faviconUrl} onChange={e => handleChange('faviconUrl', e.target.value)} />
                      </div>
                    </div>

                    <h4 className={sectionTitleStyle}>3. Corporate Channels</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Customer Care Mail Receiver</label>
                        <input type="email" className={inputStyle} value={settings.supportEmail} onChange={e => handleChange('supportEmail', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelStyle}>Support Hotlines Record</label>
                        <input type="text" className={inputStyle} value={settings.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* THEME LAYOUTS & DESIGN DESIGN ARCHITECTURE */}
                {activeTab === 'theme' && (
                  <div className="space-y-5">
                    <h4 className={sectionTitleStyle}>1. Interface Colors Hex Matrix</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={labelStyle}>Primary Baseline Hex</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" className="w-8 h-8 rounded-md bg-transparent border border-[#dddddd] cursor-pointer shrink-0" value={settings.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} />
                          <input type="text" className={inputStyle} value={settings.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className={labelStyle}>Accent Token Hex</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" className="w-8 h-8 rounded-md bg-transparent border border-[#dddddd] cursor-pointer shrink-0" value={settings.accentColor} onChange={e => handleChange('accentColor', e.target.value)} />
                          <input type="text" className={inputStyle} value={settings.accentColor} onChange={e => handleChange('accentColor', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className={labelStyle}>Body Ground Hex</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" className="w-8 h-8 rounded-md bg-transparent border border-[#dddddd] cursor-pointer shrink-0" value={settings.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} />
                          <input type="text" className={inputStyle} value={settings.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <h4 className={sectionTitleStyle}>2. Geometric Corners & Typography Standards</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Component Border Radius Profile</label>
                        <select className={inputStyle} value={settings.cornerRadius} onChange={e => handleChange('cornerRadius', e.target.value)}>
                          <option value="square-cut">Architectural Square Cut (0px Radius)</option>
                          <option value="soft-cut">Clean Production Soft Cut (4px Radius)</option>
                          <option value="round-cut">Symmetric Round Cut (8px Radius)</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelStyle}>Typography Font Family Standard</label>
                        <select className={inputStyle} value={settings.fontFamily} onChange={e => handleChange('fontFamily', e.target.value)}>
                          <option value="sans-serif">Inter / Plus Jakarta Sans (Minimal Sans)</option>
                          <option value="serif">Playfair Display / Garamond (Classic Elegant Serif)</option>
                          <option value="mono">SF Mono / JetBrains Mono (Technical Monospace)</option>
                        </select>
                      </div>
                    </div>

                    <h4 className={sectionTitleStyle}>3. Global Announcement Banners System</h4>
                    <div className="space-y-4">
                      <div className="flex gap-6 items-center">
                        <label className="flex items-center gap-2 text-[12px] font-medium text-black cursor-pointer select-none">
                          <input type="checkbox" checked={settings.enableMarqueeAnnouncement} onChange={e => handleChange('enableMarqueeAnnouncement', e.target.checked)} className="w-3.5 h-3.5 border-[#dddddd] text-black focus:ring-0 rounded-sm" /> 
                          Mount Announcement Banner Topbar
                        </label>
                        <label className="flex items-center gap-2 text-[12px] font-medium text-black cursor-pointer select-none">
                          <input type="checkbox" checked={settings.enableHeroBanner} onChange={e => handleChange('enableHeroBanner', e.target.checked)} className="w-3.5 h-3.5 border-[#dddddd] text-black focus:ring-0 rounded-sm" /> 
                          Render Dynamic Editorial Hero Modules
                        </label>
                      </div>
                      {settings.enableMarqueeAnnouncement && (
                        <div>
                          <label className={labelStyle}>Announcement Live Context String</label>
                          <input type="text" className={inputStyle} value={settings.announcementText} onChange={e => handleChange('announcementText', e.target.value)} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* LOGISTIC REMITTANCE & CHECKOUT CONFIGURATION */}
                {activeTab === 'commerce' && (
                  <div className="space-y-5">
                    <h4 className={sectionTitleStyle}>1. Financial Transacting Parameters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Primary Transactional Currency</label>
                        <select className={inputStyle} value={settings.currency} onChange={e => handleChange('currency', e.target.value)}>
                          <option value="USD">USD ($) United States Dollar</option>
                          <option value="EUR">EUR (€) Euro</option>
                          <option value="GBP">GBP (£) British Pound Sterling</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelStyle}>Standard Order VAT / Tax Configuration (%)</label>
                        <input type="number" step="0.01" className={inputStyle} value={settings.taxRate} onChange={e => handleChange('taxRate', e.target.value)} />
                      </div>
                    </div>

                    <h4 className={sectionTitleStyle}>2. Logistic Remittance Thresholds</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Free Shipping Subtotal Triggers ($)</label>
                        <input type="number" className={inputStyle} value={settings.freeShippingThreshold} onChange={e => handleChange('freeShippingThreshold', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelStyle}>Base Flat-Rate Logistic Fees ($)</label>
                        <input type="number" step="0.01" className={inputStyle} value={settings.flatShippingRate} onChange={e => handleChange('flatShippingRate', e.target.value)} />
                      </div>
                    </div>

                    <h4 className={sectionTitleStyle}>3. Inventory Safety Controls</h4>
                    <div className="grid grid-cols-1 gap-4 pt-2">
                      <div className="flex gap-6 items-center">
                        <label className="flex items-center gap-2 text-[12px] font-medium text-black cursor-pointer select-none">
                          <input type="checkbox" checked={settings.enableGuestCheckout} onChange={e => handleChange('enableGuestCheckout', e.target.checked)} className="w-3.5 h-3.5 border-[#dddddd] text-black focus:ring-0 rounded-sm" /> 
                          Authorize Anonymous Guest Checkout
                        </label>
                        <label className="flex items-center gap-2 text-[12px] font-medium text-black cursor-pointer select-none">
                          <input type="checkbox" checked={settings.enableStockWarnings} onChange={e => handleChange('enableStockWarnings', e.target.checked)} className="w-3.5 h-3.5 border-[#dddddd] text-black focus:ring-0 rounded-sm" /> 
                          Activate System Stock Scarcity Alerts
                        </label>
                      </div>
                      {settings.enableStockWarnings && (
                        <div className="max-w-xs">
                          <label className={labelStyle}>Low Inventory Cues Trigger Level</label>
                          <input type="number" className={inputStyle} value={settings.lowStockThreshold} onChange={e => handleChange('lowStockThreshold', e.target.value)} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* FORM DISPATCH EXECUTION ROW ACTION */}
                <div className="flex justify-end pt-5 border-t border-[#eeeeee] mt-8">
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="h-9 px-5 bg-black text-white rounded-md text-[11px] font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors disabled:bg-[#aaaaaa] flex items-center justify-center gap-2 min-w-[160px]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Applying Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save size={13} />
                        <span>Update Configurations</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}