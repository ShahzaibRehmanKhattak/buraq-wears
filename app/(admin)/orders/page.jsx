"use client";
import React, { useState } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Eye, Plus, Menu, X, Bell, ChevronLeft,
  Calendar, User, Settings, Package, 
  AlertTriangle, Layers, Edit3, Trash2, ChevronRight,
  ShoppingBag, Home, Box, Clock, Truck, CheckCircle, Filter
} from 'lucide-react';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm rounded-2xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-blue-50 text-blue-700",
    error: "bg-red-50 text-red-700"
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

const MetricCard = ({ title, value, icon: Icon, isPrimary, trend, trendUp }) => (
  <GlassCard className="p-5 flex flex-col justify-between min-h-[140px] group transition-all hover:-translate-y-1 hover:shadow-md">
    <div className="flex justify-between items-start">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isPrimary ? 'bg-black text-white' : 'bg-gray-100 text-black group-hover:bg-black group-hover:text-white'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trend}
      </span>
    </div>
    <div className="mt-4">
      <div className="text-2xl font-bold text-black tracking-tight tabular-nums">{value}</div>
      <div className="text-gray-400 text-[9px] uppercase tracking-widest font-bold">{title}</div>
    </div>
  </GlassCard>
);

const Sidebar = ({ collapsed, setCollapsed }) => (
  <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out z-50 ${collapsed ? 'w-20' : 'w-72'}`}>
    <div className="h-20 flex items-center px-6 justify-between border-b border-gray-100">
      {!collapsed && (
        <div className="flex flex-col">
          <h1 className="text-lg font-extrabold tracking-tight text-black uppercase">IBNA</h1>
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Systems</span>
        </div>
      )}
      <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors">
        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
    
    <nav className="flex-1 py-8 px-4 space-y-2">
      <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-gray-400 hover:text-black hover:bg-gray-50">
        <Home size={20} />
        {!collapsed && <span className="text-sm font-semibold tracking-tight">Overview</span>}
      </button>
      <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-gray-400 hover:text-black hover:bg-gray-50">
        <Box size={20} />
        {!collapsed && <span className="text-sm font-semibold tracking-tight">Inventory</span>}
      </button>
      <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl bg-black text-white shadow-xl shadow-black/10 transition-all">
        <ShoppingBag size={20} />
        {!collapsed && <span className="text-sm font-semibold tracking-tight">Orders</span>}
      </button>
      <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all text-gray-400 hover:text-black hover:bg-gray-50">
        <Settings size={20} />
        {!collapsed && <span className="text-sm font-semibold tracking-tight">Configuration</span>}
      </button>
    </nav>

    <div className={`p-6 border-t border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">AD</div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Admin User</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Master</p>
          </div>
        )}
      </div>
    </div>
  </aside>
);

const TopBar = ({ onMenuOpen }) => (
  <header className="flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 lg:px-10 sticky top-0 z-40">
    <div className="flex items-center gap-4">
      <button className="lg:hidden p-2 hover:bg-gray-50 rounded-lg" onClick={onMenuOpen}><Menu size={20} /></button>
      <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl w-64 lg:w-96 focus-within:bg-white focus-within:ring-4 focus-within:ring-black/5 transition-all">
        <Search size={18} className="text-gray-400" />
        <input type="text" placeholder="Search orders, customers..." className="bg-transparent border-none focus:ring-0 w-full text-xs font-semibold outline-none text-black" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full relative transition-colors">
        <Bell size={20} />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
      </button>
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-black font-bold text-xs cursor-pointer border border-gray-200">AD</div>
    </div>
  </header>
);

const BottomBar = () => (
  <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] lg:hidden">
    <button className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 group">
      <div className="p-2 rounded-xl transition-all group-active:scale-90"><Home size={22} /></div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">Home</span>
    </button>
    <button className="relative flex flex-col items-center justify-center w-full h-full text-black group">
      <div className="relative p-2 rounded-xl bg-black/5 transition-all group-active:scale-90">
        <ShoppingBag size={22} fill="currentColor" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full border-2 border-white"></div>
      </div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">Orders</span>
    </button>
    <button className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 group">
      <div className="p-2 rounded-xl transition-all group-active:scale-90"><Box size={22} /></div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">Stock</span>
    </button>
    <button className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 group">
      <div className="p-2 rounded-xl transition-all group-active:scale-90"><User size={22} /></div>
      <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">Profile</span>
    </button>
  </nav>
);

const OrderMobileCard = ({ order }) => (
  <GlassCard className="p-4 mb-4 md:hidden overflow-hidden border-gray-100/80">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-bold inline-block mb-1">
          {order.id}
        </div>
        <h3 className="font-bold text-base text-black leading-tight tracking-tight">{order.customer}</h3>
        <p className="text-[11px] text-gray-400 font-medium mt-1">{order.items} items • {order.date}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-black text-black tabular-nums">${order.amount}</div>
        <div className="mt-1">
          <Badge variant={
            order.status === 'Pending' ? 'warning' : 
            order.status === 'Shipped' ? 'info' : 
            order.status === 'Delivered' ? 'default' : 'success'
          }>
            {order.status}
          </Badge>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3">
      <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-gray-600 font-bold text-[11px] hover:bg-gray-100 active:bg-gray-200 transition-colors uppercase tracking-wider">
        <Eye size={14} /> View
      </button>
      <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-gray-600 font-bold text-[11px] hover:bg-gray-100 active:bg-gray-200 transition-colors uppercase tracking-wider">
        <Edit3 size={14} /> Edit
      </button>
      <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl text-red-500 font-bold text-[11px] hover:bg-red-50 active:bg-red-100 transition-colors uppercase tracking-wider">
        <Trash2 size={14} /> Del
      </button>
    </div>
  </GlassCard>
);

const OrderDesktopTable = ({ orders }) => (
  <div className="hidden md:block overflow-hidden border border-gray-100 rounded-3xl bg-white shadow-xl shadow-black/[0.02]">
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-50/50 border-b border-gray-100">
        <tr>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Order ID</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Customer</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Status</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Items</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400">Amount</th>
          <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-gray-400 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {orders.map((order, idx) => (
          <tr key={idx} className="hover:bg-gray-50/40 transition-all group">
            <td className="px-8 py-5">
              <span className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter bg-gray-100 px-2 py-1 rounded-lg">
                {order.id}
              </span>
            </td>
            <td className="px-8 py-5">
              <div className="font-bold text-sm text-black">{order.customer}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{order.date}</div>
            </td>
            <td className="px-8 py-5">
              <Badge variant={
                order.status === 'Pending' ? 'warning' : 
                order.status === 'Shipped' ? 'info' : 
                order.status === 'Delivered' ? 'default' : 'success'
              }>
                {order.status}
              </Badge>
            </td>
            <td className="px-8 py-5">
              <div className="text-sm font-semibold text-gray-600">{order.items} Units</div>
            </td>
            <td className="px-8 py-5 font-black text-sm text-black tabular-nums">
              ${order.amount}
            </td>
            <td className="px-8 py-5">
              <div className="flex justify-end gap-2">
                <button title="View" className="p-2.5 bg-transparent hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all"><Eye size={18} /></button>
                <button title="Edit" className="p-2.5 bg-transparent hover:bg-gray-100 rounded-xl text-gray-400 hover:text-black transition-all"><Edit3 size={18} /></button>
                <button title="Delete" className="p-2.5 bg-transparent hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OrdersView = () => {
  const orders = [
    { id: '#ORD-8821', customer: 'Alexander Rossi', status: 'Confirmed', amount: '420.00', items: 2, date: 'May 12, 2024' },
    { id: '#ORD-8819', customer: 'Elena Gilbert', status: 'Pending', amount: '1,250.00', items: 1, date: 'May 11, 2024' },
    { id: '#ORD-8815', customer: 'Marcus Holloway', status: 'Shipped', amount: '89.00', items: 4, date: 'May 11, 2024' },
    { id: '#ORD-8812', customer: 'Sophia Chen', status: 'Delivered', amount: '315.00', items: 1, date: 'May 10, 2024' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header Section (Restored style from previous) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">Orders Management</h2>
          <p className="text-gray-500 text-sm font-medium">Manage customer orders and track fulfillment status.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter Orders
          </button>
          <button className="hidden md:flex h-10 px-4 rounded-xl bg-black text-white text-sm font-semibold items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={16} /> Create Order
          </button>
        </div>
      </div>

      {/* Analytics Overview using established MetricCard design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <MetricCard title="Total Orders" value="1,284" icon={ShoppingBag} isPrimary trend="12%" trendUp />
        <MetricCard title="Pending" value="42" icon={Clock} trend="3%" trendUp={false} />
        <MetricCard title="Shipped" value="156" icon={Truck} trend="8%" trendUp />
        <MetricCard title="Delivered" value="1,086" icon={CheckCircle} trend="24%" trendUp />
      </div>

      {/* Responsive List Section */}
      <div className="mb-10">
        <OrderDesktopTable orders={orders} />
        <div className="md:hidden space-y-4">
          {orders.map((o, idx) => (
            <OrderMobileCard key={idx} order={o} />
          ))}
        </div>
      </div>

      {/* Premium Pagination Structure (Restored) */}
      <div className="flex justify-center items-center gap-6 py-12 border-t border-gray-100">
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all group active:scale-90">
          <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Archives 01/24</span>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all group active:scale-90">
          <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <OrdersView />
        </main>
        <BottomBar />
      </div>

      {/* Mobile Floating Action Button (FAB) for New Order */}
      <button className="fixed bottom-24 right-6 lg:hidden w-14 h-14 bg-black text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center active:scale-90 transition-all z-40 border-4 border-white/20">
        <Plus size={28} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setMobileMenuOpen(false)}>
           <div className="w-80 h-full bg-white p-8 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 ease-out" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-12">
                <div className="flex flex-col">
                  <h1 className="text-xl font-black tracking-tighter uppercase">IBNA</h1>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Portal</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-gray-50 rounded-2xl"><X size={20} /></button>
              </div>
              <nav className="space-y-3">
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold text-gray-400 hover:bg-gray-50"><Home size={22} /> Overview</button>
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold bg-black text-white shadow-xl shadow-black/10"><ShoppingBag size={22} /> Orders</button>
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold text-gray-400 hover:bg-gray-50"><Box size={22} /> Inventory</button>
                <button className="flex items-center gap-4 w-full p-5 rounded-2xl font-bold text-gray-400 hover:bg-gray-50"><Settings size={22} /> Settings</button>
              </nav>
           </div>
        </div>
      )}
    </div>
  );
}