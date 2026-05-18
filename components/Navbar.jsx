"use client";

import { Search, ShoppingBag, LogOut, Menu, X, ClipboardList, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track authentication session states reactively
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!isMounted) return;

    try {
      setIsMobileMenuOpen(false);
      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      
      window.queueMicrotask(() => {
        router.refresh();
        router.push('/');
      });
    } catch (error) {
      console.error("Sign out encountered an error:", error);
    }
  };

  const navLinks = [
    { label: 'Collections', path: '/collections' },
    { label: 'Shirts', path: '/shirts' },
    { label: 'Trousers', path: '/trousers' },
    { label: 'Accessories', path: '/accessories' },
    { label: 'Atelier', path: '/atelier' }
  ];

  return (
    <>
      {/* Desktop Header */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-50 bg-white border-b border-black/[0.06] py-5">
        <div className="flex justify-between items-center w-full px-16 max-w-[1440px] mx-auto">
          
          {/* Logo */}
          <div className="flex-1">
            <Link href="/" className="font-display text-[26px] font-bold tracking-[-0.03em] text-black antialiased">
              IBNA
            </Link>
          </div>

          {/* Center Links */}
          <div className="flex items-center justify-center gap-10 flex-[2]">
            {navLinks.map((item) => (
              <Link 
                key={item.label} 
                href={item.path} 
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#555555] hover:text-black transition-colors duration-300 pb-0.5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Action Menu Area */}
          <div className="flex items-center justify-end gap-6 flex-1 text-black/80">
            <Search size={18} strokeWidth={1.5} className="cursor-pointer hover:text-black transition-colors" />
            
            {currentUser ? (
              <>
                {/* Active Session Utility Links */}
                <Link href="/my-orders" title="My Orders" className="hover:text-black transition-colors">
                  <ClipboardList size={18} strokeWidth={1.5} />
                </Link>

                <Link href="/my-orders" title="My Account" className="hover:text-black transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </Link>
              </>
            ) : (
              /* High-End Clean Typography Link for Logged Out Sessions */
              <Link 
                href="/login" 
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#444444] hover:text-black transition-colors pb-0.5 border-b border-transparent hover:border-black/30"
              >
                Login / Signup
              </Link>
            )}

            <Link href="/my-cart" title="Shopping Cart" className="relative hover:text-black transition-colors">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </Link>

            {currentUser && (
              <button 
                onClick={handleSignOut} 
                className="flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-red-600 transition-colors cursor-pointer ml-1 border-l border-black/[0.08] pl-5"
              >
                <LogOut size={15} strokeWidth={1.5} />
                <span className="uppercase tracking-[0.15em] text-[9px] font-semibold">Logout</span>
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b border-black/[0.05] h-16">
        <div className="flex items-center justify-between px-5 h-full">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="text-black focus:outline-none py-1"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <Link href="/" className="text-[19px] font-bold tracking-tight text-black">
              IBNA
            </Link>
          </div>

          <div className="flex items-center gap-4 text-black/80">
            {currentUser && (
              <Link href="/my-orders">
                <ClipboardList size={20} strokeWidth={1.5} />
              </Link>
            )}
            <Link href="/my-cart" className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
            </Link>
          </div>

        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar Drawer Panel */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[270px] bg-white z-50 shadow-xl transition-transform duration-300 ease-out flex flex-col md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Top Row */}
        <div className="p-5 flex justify-between items-center border-b border-black/[0.05]">
          <span className="font-semibold tracking-[0.15em] text-xs text-[#666666]">MENU</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-black p-1 hover:opacity-60 transition-opacity"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-grow p-6 flex flex-col gap-6">
          {navLinks.map((item) => (
            <Link 
              key={item.label} 
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[11px] font-medium tracking-[0.2em] text-[#444444] hover:text-black uppercase transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-px bg-black/[0.05] my-2" />

          {/* Account context links displayed only for verified logged in profiles */}
          {currentUser ? (
            <>
              <Link 
                href="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] font-medium tracking-[0.2em] text-[#444444] hover:text-black uppercase flex items-center gap-3"
              >
                <User size={16} strokeWidth={1.5} />
                <span>My Profile</span>
              </Link>

              <Link 
                href="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] font-medium tracking-[0.2em] text-[#444444] hover:text-black uppercase flex items-center gap-3"
              >
                <ClipboardList size={16} strokeWidth={1.5} />
                <span>My Orders</span>
              </Link>
            </>
          ) : (
            <Link 
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[11px] font-semibold tracking-[0.2em] text-black uppercase flex items-center gap-3"
            >
              <span>Login / Signup →</span>
            </Link>
          )}
        </nav>

        {/* Drawer Footer Action Area */}
        <div className="p-5 border-t border-black/[0.05] bg-[#fafafa]">
          {currentUser ? (
            <button 
              onClick={handleSignOut}
              className="w-full h-11 bg-black text-white text-[10px] font-medium tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
            >
              <LogOut size={14} strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link 
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-11 bg-black text-white text-[10px] font-medium tracking-[0.2em] uppercase flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}