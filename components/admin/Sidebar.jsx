"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutGrid, Menu, ChevronLeft, Shirt, ShoppingBag 
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
    }
  ];

  return (
    <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200/50 transition-all duration-300 ease-in-out z-50 ${
      collapsed ? 'w-20' : 'w-72'
    }`}>
      
      {/* Header Panel */}
      <div className="h-20 flex items-center px-6 justify-between border-b border-gray-100">
        {!collapsed && (
          <div className="flex flex-col animate-fadeIn">
            <h1 className="text-lg font-bold tracking-tight text-black">IBNA Admin</h1>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Commerce Pro</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className={`p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Dynamic Navigation Area */}
      <nav className="flex-1 py-6 px-3 space-y-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          // Matches parent links and deep nested nested items (/products/add, etc.)
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                collapsed ? 'justify-center px-3' : ''
              } ${
                isActive 
                  ? 'bg-black text-white shadow-md shadow-black/10 font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'
              }`}
            >
              <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && (
                <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Context */}
      <div className={`p-4 border-t border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 select-none">
            AD
          </div>
          {!collapsed && (
            <div className="overflow-hidden animate-fadeIn">
              <p className="text-sm font-bold truncate text-black">Admin User</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Super Admin</p>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};