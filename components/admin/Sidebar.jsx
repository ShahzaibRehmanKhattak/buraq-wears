"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutGrid, Menu, ChevronLeft, Shirt, ShoppingBag, 
  Layers, X, ArrowUpRight, Bell, Settings
} from 'lucide-react';

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024;

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Products', path: '/products', icon: Shirt },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* ================= Mobile Floating Action Trigger ================= */}
      <div className="lg:hidden fixed top-4 left-4 z-[110]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`h-9 w-9 rounded-md border border-[#dddddd] transition-colors flex items-center justify-center ${
            !collapsed 
              ? 'bg-black border-black text-white' 
              : 'bg-white text-black active:bg-gray-50'
          }`}
        >
          {collapsed ? <Menu size={15} /> : <X size={15} />}
        </button>
      </div>

      {/* ================= Flat Dimmer Layer Backdrop ================= */}
      {!collapsed && (
        <div 
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/10 z-[90] lg:hidden transition-opacity duration-200"
        />
      )}

      {/* ================= Primary Structural Sidebar Panel ================= */}
      <aside className={`
        fixed inset-y-0 left-0 flex flex-col bg-white border-r border-[#eeeeee] transition-all duration-200 ease-in-out z-[100]
        lg:sticky lg:h-screen lg:translate-x-0
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
      `}>
        
        {/* Workspace Branding Header */}
        <div className={`h-16 flex items-center border-b border-[#eeeeee] transition-all duration-150 ${
          collapsed ? 'justify-center px-0' : 'px-5 justify-between'
        }`}>
          {(!collapsed || isMobile) && (
            <div className={`flex flex-col tracking-tight text-black ${isMobile ? 'pl-12' : ''}`}>
              <h1 className="text-[12px] font-bold uppercase tracking-[0.15em] leading-none mb-1">
                IBNA Atelier
              </h1>
              <span className="text-[9px] uppercase tracking-widest text-[#777777] font-medium leading-none">
                Control Terminal
              </span>
            </div>
          )}
          
          {/* Desktop Collapse Arrow Layout Selector Trigger */}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className={`hidden lg:flex p-1.5 text-[#777777] hover:text-black hover:bg-black/[0.04] rounded-md transition-colors ${
              collapsed ? 'mx-auto' : ''
            }`}
          >
            {collapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
        
        {/* Dynamic Navigation Architecture Link Cluster */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto no-scrollbar bg-white">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.label}
                href={item.path}
                onClick={() => { if (isMobile) setCollapsed(true); }}
                className={`flex items-center gap-3 w-full rounded-md transition-colors relative group ${
                  collapsed ? 'justify-center py-3 px-0' : 'px-3 py-2.5'
                } ${
                  isActive 
                    ? 'bg-black text-white font-semibold' 
                    : 'text-[#555555] hover:bg-black/[0.04] hover:text-black'
                }`}
              >
                <div className="shrink-0">
                  <IconComponent size={14} strokeWidth={isActive ? 2.5 : 1.75} />
                </div>

                <span className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-opacity ${
                  collapsed ? 'hidden' : 'inline'
                }`}>
                  {item.label}
                </span>

                {/* Minimalist Indicator Element Line */}
                {isActive && !collapsed && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={11} />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System User Registry Footer Block */}
        <div className={`p-4 border-t border-[#eeeeee] bg-white ${collapsed ? 'flex justify-center' : 'px-4 py-3.5'}`}>
          <div className="flex items-center gap-3 overflow-hidden w-full">
            <div className="w-8 h-8 rounded-md bg-black text-white flex items-center justify-center font-bold text-[11px] shrink-0 select-none tracking-tighter">
              AD
            </div>
            
            <div className={`overflow-hidden transition-all ${collapsed ? 'hidden' : 'block'}`}>
              <p className="text-[11px] font-bold text-black uppercase tracking-wider leading-none">Admin User</p>
              <p className="text-[9px] text-[#777777] font-medium uppercase tracking-widest mt-1 leading-none">Super Administrator</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};