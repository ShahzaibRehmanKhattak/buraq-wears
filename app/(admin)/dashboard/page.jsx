"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Package, 
  ShoppingBag, 
  Users, 
  Layers, 
  Sparkles, 
  Settings, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Share2, 
  ShoppingCart, 
  Receipt,
  Plus,
  ChevronRight,
  Globe,
  BarChart3,
  Command,
  Menu,
  X,
  Bell,
  ChevronLeft
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { id: 'products', icon: Package, label: 'Products' },
  { id: 'orders', icon: ShoppingBag, label: 'Orders' },
  { id: 'customers', icon: Users, label: 'Customers' },
  { id: 'categories', icon: Layers, label: 'Categories' },
  { id: 'marketing', icon: Sparkles, label: 'Marketing' },
];

const PLATFORMS = [
  { name: 'Shopee', value: '200.9k', trend: '12% ↓', trendUp: false },
  { name: 'Tokopedia', value: '90.12k', trend: '80% ↑', trendUp: true },
  { name: 'Amazon', value: '65.74k', trend: '71% ↑', trendUp: true },
  { name: 'Lazada', value: '55.12k', trend: '10% ↓', trendUp: false },
];


// Glassmorphism Container
const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl ${className}`}>
    {children}
  </div>
);

// Sidebar Navigation Link
const SidebarItem = ({ icon: Icon, label, active, collapsed, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 w-full transition-all duration-300 rounded-xl group relative
      ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
      ${active ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}
    `}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
    {collapsed && active && (
      <div className="absolute left-0 w-1 h-6 bg-black rounded-r-full" />
    )}
  </button>
);

// Mobile Bottom Navigation Item
const BottomNavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors
      ${active ? 'text-black' : 'text-gray-400'}
    `}
  >
    <div className="relative">
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      {active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

// Stat Card
const MetricCard = ({ title, value, trend, trendUp, icon: Icon, isPrimary = false }) => (
  <GlassCard className="p-5 flex flex-col justify-between min-h-[140px] group transition-all hover:-translate-y-1 hover:shadow-md">
    <div className="flex justify-between items-start">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPrimary ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trend}
      </span>
    </div>
    <div className="mt-4">
      <div className="text-2xl font-bold text-black tracking-tight">{value}</div>
      <div className="text-gray-400 text-[9px] uppercase tracking-widest font-bold">{title}</div>
    </div>
  </GlassCard>
);


export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#111827] font-sans flex overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {}
      <aside 
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200/50 transition-all duration-300 ease-in-out z-50 
          ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="h-20 flex items-center px-6 justify-between border-b border-gray-100">
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight">IBNA Admin</h1>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Architecture</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem 
              key={item.id} 
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id}
              collapsed={isSidebarCollapsed}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
          <div className="my-4 border-t border-gray-100 mx-4"></div>
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'} 
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <div className={`p-4 border-t border-gray-100 transition-all ${isSidebarCollapsed ? 'items-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm shrink-0">JD</div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">John Doe</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase truncate">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] lg:hidden transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 justify-between border-b border-gray-50">
          <h1 className="text-lg font-bold">IBNA Admin</h1>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2"><X size={20}/></button>
        </div>
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 w-full p-4 rounded-xl font-semibold text-sm ${activeTab === item.id ? 'bg-black text-white' : 'text-gray-500'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile App-Style Header */}
        <header className="lg:hidden flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
            <Menu size={24} />
          </button>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 leading-tight">IBNA</p>
            <p className="font-bold text-sm">Dashboard</p>
          </div>
          <div className="relative">
            <Bell size={22} className="text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </header>

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-6 md:space-y-8 pb-28 lg:pb-10 no-scrollbar">
          
          {/* Welcome Header (Desktop only or prominent on mobile) */}
          <section className="flex flex-col gap-6">
            <div className="hidden lg:block">
              <p className="text-gray-500 text-sm font-medium mb-1">Monday, 24 June</p>
              <h2 className="text-3xl font-bold tracking-tight text-black">Platform Overview</h2>
            </div>

            <GlassCard className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 border-gray-200/60">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium"
              />
              <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-500 font-mono">
                <Command size={10} /> K
              </div>
            </GlassCard>
          </section>

          {}
          <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <MetricCard title="Views" value="411.9K" trend="2.9%" trendUp={true} icon={Eye} isPrimary={true} />
            <MetricCard title="Shares" value="230.4K" trend="13.3%" trendUp={true} icon={Share2} />
            <MetricCard title="Added" value="20.9K" trend="4.3%" trendUp={false} icon={ShoppingCart} />
            <MetricCard title="Orders" value="410.5K" trend="30.2%" trendUp={true} icon={Receipt} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <GlassCard className="lg:col-span-2 p-6 md:p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight">Platform Performance</h3>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-tighter">Real-time engagement</p>
                </div>
                <button className="bg-black text-white h-9 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10">
                  More <Plus size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLATFORMS.map((platform, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-white/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-[9px] uppercase font-black">{platform.name}</span>
                      <span className={`text-[9px] font-bold ${platform.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>{platform.trend}</span>
                    </div>
                    <div className="text-md font-bold text-black">{platform.value}</div>
                  </div>
                ))}
              </div>

              {/* Simulated SVG Graph */}
              <div className="relative h-48 md:h-64 w-full pt-10">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="black" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="black" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q50,70 100,85 T200,40 T300,20 T400,10 L400,100 L0,100 Z" fill="url(#areaGradient)" />
                  <path d="M0,80 Q50,70 100,85 T200,40 T300,20 T400,10" fill="none" stroke="black" strokeLinecap="round" strokeWidth="2" />
                  <circle cx="300" cy="20" fill="black" r="4" stroke="white" strokeWidth="2" />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
                  {[1,2,3,4].map(v => <div key={v} className="border-t border-gray-100 w-full opacity-50" />)}
                </div>
              </div>
            </GlassCard>

            {/* Revenue Sidebar */}
            <GlassCard className="p-6 md:p-8 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight">Net Revenue</h3>
                  <p className="text-gray-400 text-xs">Realization this month</p>
                </div>
                <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tighter">$991,761</div>
                
                <div className="h-20 w-full flex items-end gap-1 px-1">
                  {[30, 40, 35, 60, 80, 95, 85, 70].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className={`flex-1 rounded-t-sm transition-all duration-700 ${i > 4 ? 'bg-black' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-[10px] font-bold uppercase">Quarter Target</span>
                  <span className="font-bold text-sm">$1.9B</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-black h-full w-[65%] rounded-full"></div>
                </div>
                <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase">65% Progress</p>
              </div>
            </GlassCard>
          </section>

          {/* Quick Insights Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-4 md:p-6 flex justify-between items-center group cursor-pointer hover:bg-white active:scale-[0.99] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all border border-gray-100">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 className="text-gray-400 text-[9px] font-bold uppercase tracking-widest leading-none">Top Performance</h4>
                  <p className="text-md md:text-lg font-bold tracking-tight">Amazon Global</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-black" size={18} />
            </GlassCard>

            <GlassCard className="p-4 md:p-6 flex justify-between items-center group cursor-pointer hover:bg-white active:scale-[0.99] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all border border-gray-100">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="text-gray-400 text-[9px] font-bold uppercase tracking-widest leading-none">Primary Hub</h4>
                  <p className="text-md md:text-lg font-bold tracking-tight">Jakarta (JKT)</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-black" size={18} />
            </GlassCard>
          </section>

        </main>

        {}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full h-20 bg-white/90 backdrop-blur-2xl border-t border-gray-100 flex items-center px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <BottomNavItem icon={LayoutGrid} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <BottomNavItem icon={ShoppingBag} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
          <BottomNavItem icon={Package} label="Stock" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <BottomNavItem icon={Settings} label="Setup" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

      </div>
    </div>
  );
}