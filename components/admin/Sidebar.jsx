"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutGrid, Menu, ChevronLeft, Shirt, ShoppingBag, 
  Layers, X
} from 'lucide-react';

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  // Navigation Links configuration array
  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutGrid 
    },
    { 
      label: 'Products', 
      path: '/products', 
      icon: Shirt 
    },
    { 
      label: 'Orders', 
      path: '/orders', 
      icon: ShoppingBag 
    },
    { 
      label: 'Categories', 
      path: '/categories', 
      icon: Layers 
    }
  ];

  return (
    <>
      {/* =========================================================================
          1. FIXED MOBILE FLOATING TRIGGER (Stays visible on top left of screen)
          ========================================================================= */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2.5 bg-white border border-gray-200 text-gray-700 hover:text-black rounded-xl shadow-sm flex items-center justify-center active:scale-95 transition-all"
        >
          {/* If collapsed is true on mobile, sidebar is closed, so show Menu icon to open it */}
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* =========================================================================
          2. MOBILE OVERLAY BACKDROP (Closes drawer on background tap)
          ========================================================================= */}
      {!collapsed && (
        <div 
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
        />
      )}

      {/* =========================================================================
          3. COMPACT RESPONSIVE SIDEBAR
          ========================================================================= */}
      <aside className={`
        /* Structural Positions */
        fixed inset-y-0 left-0 flex flex-col bg-white border-r border-gray-200/50 transition-all duration-300 ease-in-out z-50
        lg:sticky lg:h-screen lg:translate-x-0
        
        /* Mobile Layout vs Desktop Layout Responsive Matrices */
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'}
      `}>
        
        {/* Header Panel */}
        <div className="h-20 flex items-center px-6 justify-between border-b border-gray-100">
          {(!collapsed || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
            <div className="flex flex-col animate-fadeIn pl-10 lg:pl-0">
              <h1 className="text-lg font-bold tracking-tight text-black">IBNA Admin</h1>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Commerce Pro</span>
            </div>
          )}
          
          {/* Desktop Only Close Arrow Layout trigger */}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className={`hidden lg:flex p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors ${
              collapsed ? 'lg:mx-auto' : ''
            }`}
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        {/* Dynamic Navigation Area */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.label}
                href={item.path}
                // Instantly auto-closes mobile navigation drawer on element click selection
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setCollapsed(true);
                  }
                }}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  collapsed ? 'lg:justify-center lg:px-3' : ''
                } ${
                  isActive 
                    ? 'bg-black text-white shadow-md shadow-black/10 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'
                }`}
              >
                <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                  collapsed ? 'lg:hidden' : 'inline'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer Context */}
        <div className={`p-4 border-t border-gray-100 ${collapsed ? 'lg:flex lg:justify-center' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden pl-10 lg:pl-0">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 select-none">
              AD
            </div>
            <div className={`overflow-hidden animate-fadeIn ${collapsed ? 'lg:hidden' : 'block'}`}>
              <p className="text-sm font-bold truncate text-black">Admin User</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};