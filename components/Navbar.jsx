"use client";

import { ShoppingBag, LogOut, Menu, X, ClipboardList, User, LayoutDashboard, LogIn, Heart } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/hooks/useCart'; 
import { useFavorites } from '@/hooks/FavoritesContext'; // Added favorites context connection

export default function Navbar() {
  const { totalItemCount, refreshCart, clearCart } = useCart();
  const { favoriteItems } = useFavorites(); // Pull active wishlist items state array

  // Core Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dynamic calculations for wishlist quantity badge counter
  const totalWishlistCount = favoriteItems?.length || 0;

  // Sync user profile data role configuration safely
  const syncUserRole = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (data && !error) {
        setUserRole(data.role);
      } else {
        setUserRole('customer');
      }
    } catch (err) {
      console.error("Error fetching role:", err);
      setUserRole('customer');
    }
  }, []);

  // Fetch active session from memory/cookie
  const checkCurrentSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setCurrentUser(session.user);
        await syncUserRole(session.user.id);
        if (refreshCart) refreshCart();
      } else {
        setCurrentUser(null);
        setUserRole('customer');
      }
    } catch (err) {
      console.error("Session lookup failure:", err);
    } finally {
      setIsLoaded(true);
    }
  }, [syncUserRole, refreshCart]);

  useEffect(() => {
    checkCurrentSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        await syncUserRole(session.user.id);
        if (refreshCart) refreshCart();
      } else {
        setCurrentUser(null);
        setUserRole('customer');
      }
      setIsLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, [checkCurrentSession, syncUserRole, refreshCart]);

  const handleSignOut = async () => {
    try {
      setIsMobileMenuOpen(false);
      if (clearCart) clearCart();
      
      setCurrentUser(null);
      setUserRole('customer');

      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      await supabase.auth.signOut();
      
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failure:", error);
      window.location.href = '/login';
    }
  };

  const navLinks = [
    { label: 'Collections', path: '/collections' },
    { label: 'Shirts', path: '/shirts' },
    { label: 'Trousers', path: '/trousers' },
    { label: 'Accessories', path: '/accessories' },
  ];

  const isAdmin = userRole === 'admin';

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full z-50 bg-white border-b border-black/[0.06] py-5">
        <div className="flex justify-between items-center w-full px-16 max-w-[1440px] mx-auto">
          
          {/* Logo Brand */}
          <div className="flex-1">
            <Link href="/" className="group inline-block font-sans text-xl font-bold tracking-[0.05em] uppercase text-black">
              Buraq<span className="font-light text-[#777777] group-hover:text-black transition-colors duration-300">Wears</span>
            </Link>
          </div>

          {/* Core Menu Navigation Links */}
          <div className="flex items-center justify-center gap-10 flex-[2]">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.path} className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#555555] hover:text-black transition-colors duration-300 pb-0.5">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Context Action Elements Icons Panel */}
          <div className="flex items-center justify-end gap-6 flex-1 text-black/80 min-h-[28px]">
            {isLoaded ? (
              <>
                {currentUser ? (
                  <>
                    {/* User Profile Links Condition Split */}
                    {isAdmin ? (
                      <Link href="/dashboard" className="hover:text-black transition-colors flex items-center gap-1.5 text-xs text-black font-semibold">
                        <LayoutDashboard size={18} strokeWidth={1.5} />
                        <span className="uppercase tracking-[0.1em] text-[10px]">Dashboard</span>
                      </Link>
                    ) : (
                      <>
                        <Link href="/my-orders" title="My Orders" className="hover:text-black transition-colors">
                          <ClipboardList size={18} strokeWidth={1.5} />
                        </Link>
                        
                        <Link href="/my-orders" title="My Account" className="hover:text-black transition-colors">
                          <User size={18} strokeWidth={1.5} />
                        </Link>

                        {/* ✨ DESKTOP WISHLIST ICON LINK */}
                        <Link href="/my-wishlist" title="My Wishlist" className="relative hover:text-black transition-colors p-1">
                          <Heart size={18} strokeWidth={1.5} />
                          {totalWishlistCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center tracking-tight border border-white">
                              {totalWishlistCount}
                            </span>
                          )}
                        </Link>
                        
                        <Link href="/my-cart" className="relative hover:text-black transition-colors p-1 group/cart">
                          <ShoppingBag size={18} strokeWidth={1.5} />
                          {totalItemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center tracking-tight border border-white">
                              {totalItemCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}

                    <button onClick={handleSignOut} className="flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-red-600 transition-colors cursor-pointer ml-1 border-l border-black/[0.08] pl-5">
                      <LogOut size={15} strokeWidth={1.5} />
                      <span className="uppercase tracking-[0.15em] text-[9px] font-semibold">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#444444] hover:text-black transition-colors pb-0.5 border-b border-transparent hover:border-black/30">
                    Login / Signup
                  </Link>
                )}
              </>
            ) : (
              <div className="w-16 h-4 bg-neutral-50 animate-pulse rounded-sm" />
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b border-b-black/[0.05] h-16">
        <div className="flex items-center justify-between px-5 h-full">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-black focus:outline-none py-1">
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <Link href="/" className="text-lg font-bold tracking-[0.04em] uppercase text-black">
              Buraq<span className="font-light text-[#777777]">Wears</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-black/80 min-h-[24px]">
            {isLoaded && (
              <>
                {currentUser ? (
                  isAdmin ? (
                    <Link href="/dashboard" title="Admin Dashboard" className="text-black p-1">
                      <LayoutDashboard size={20} strokeWidth={1.5} />
                    </Link>
                  ) : (
                    <>
                      <Link href="/my-orders" className="p-1"><ClipboardList size={20} strokeWidth={1.5} /></Link>
                      <Link href="/my-orders" className="p-1"><User size={20} strokeWidth={1.5} /></Link>
                      
                      {/* ✨ MOBILE ICON BAR WISHLIST BUTTON LINK */}
                      <Link href="/my-wishlist" className="relative p-1">
                        <Heart size={20} strokeWidth={1.5} />
                        {totalWishlistCount > 0 && (
                          <span className="absolute top-0 right-0 min-w-[14px] h-[14px] bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                            {totalWishlistCount}
                          </span>
                        )}
                      </Link>

                      <Link href="/my-cart" className="relative p-1">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {totalItemCount > 0 && (
                          <span className="absolute top-0 right-0 min-w-[14px] h-[14px] bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                            {totalItemCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )
                ) : (
                  <Link href="/login" className="p-1 text-black" title="Login / Signup">
                    <LogIn size={20} strokeWidth={1.5} />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER SIDEBAR ================= */}
      <aside className={`fixed top-0 left-0 h-full w-[270px] bg-white z-50 shadow-xl transition-transform duration-300 ease-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex justify-between items-center border-b border-black/[0.05]">
          <span className="font-semibold tracking-[0.15em] text-xs text-[#666666]">{isLoaded && isAdmin ? 'ADMIN CONSOLE' : 'MENU'}</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-black p-1"><X size={20} strokeWidth={1.5} /></button>
        </div>
        
        <nav className="flex-grow p-6 flex flex-col gap-6">
          {isLoaded && currentUser && (
            isAdmin ? (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold tracking-[0.2em] text-black uppercase flex items-center gap-2 mb-2">
                <LayoutDashboard size={14} strokeWidth={1.5} /> Dashboard Control
              </Link>
            ) : (
              <div className="flex flex-col gap-4 border-b border-black/[0.05] pb-4 mb-2">
                <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-semibold tracking-[0.15em] text-black uppercase flex items-center gap-2">
                  <ClipboardList size={14} strokeWidth={1.5} /> My Orders
                </Link>
                <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-semibold tracking-[0.15em] text-black uppercase flex items-center gap-2">
                  <User size={14} strokeWidth={1.5} /> Profile Account
                </Link>
                
                {/* ✨ MOBILE DRAWER SIDEBAR ROW LINK */}
                <Link href="/my-wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-semibold tracking-[0.15em] text-black uppercase flex items-center gap-2">
                  <Heart size={14} strokeWidth={1.5} /> Wishlist Selection ({totalWishlistCount})
                </Link>

                <Link href="/my-cart" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-semibold tracking-[0.15em] text-black uppercase flex items-center gap-2">
                  <ShoppingBag size={14} strokeWidth={1.5} /> Shopping Cart ({totalItemCount})
                </Link>
              </div>
            )
          )}

          {/* Core Categories Navigation Link Array */}
          {navLinks.map((item) => (
            <Link key={item.label} href={item.path} onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-medium tracking-[0.2em] text-[#444444] uppercase">{item.label}</Link>
          ))}
        </nav>
        
        <div className="p-5 border-t border-black/[0.05] bg-[#fafafa]">
          {isLoaded && (
            currentUser ? (
              <button onClick={handleSignOut} className="w-full h-11 bg-black text-white text-[10px] font-medium tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-colors cursor-pointer">
                <LogOut size={14} strokeWidth={1.5} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full h-11 bg-black text-white text-[10px] font-medium tracking-[0.2em] uppercase flex items-center justify-center">
                <span>Sign In / Sign Up</span>
              </Link>
            )
          )}
        </div>
      </aside>
    </>
  );
}