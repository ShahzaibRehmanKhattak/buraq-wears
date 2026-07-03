"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  Search, 
  Phone, 
  User, 
  ShoppingCart, 
  RotateCcw, 
  Heart, 
  LogOut, 
  Menu, 
  X, 
  ClipboardList, 
  LayoutDashboard 
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/hooks/useCart'; 
import { useFavorites } from '@/hooks/FavoritesContext'; 

export default function Navbar() {
  const { totalItemCount, refreshCart, clearCart } = useCart();
  const { favoriteItems } = useFavorites(); 

  // Core Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const [profileData, setProfileData] = useState({ name: '', avatarUrl: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync prevention trace reference
  const syncInProgressRef = useRef(null);

  // Dynamic badge metrics
  const totalWishlistCount = favoriteItems?.length || 0;
  const isAdmin = userRole === 'admin';

  // Sync user profile data configuration safely
  const syncUserProfile = useCallback(async (userId, fallbackEmail) => {
    if (syncInProgressRef.current?.userId === userId) {
      return syncInProgressRef.current.promise;
    }

    const syncPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name, avatar_url')
          .eq('id', userId)
          .single();
          
        if (data && !error) {
          return {
            role: data.role || 'customer',
            name: data.full_name || fallbackEmail.split('@')[0],
            avatarUrl: data.avatar_url || ''
          };
        }
      } catch (err) {
        console.error("Error fetching profile row sync details:", err);
      }
      return {
        role: 'customer',
        name: fallbackEmail.split('@')[0],
        avatarUrl: ''
      };
    })();

    syncInProgressRef.current = { userId, promise: syncPromise };
    const result = await syncPromise;
    
    setUserRole(result.role);
    setProfileData({ name: result.name, avatarUrl: result.avatarUrl });
    
    return result;
  }, []);

  // Centralized single session processor
  const processSessionUpdate = useCallback(async (session) => {
    if (session?.user) {
      setCurrentUser(session.user);
      await syncUserProfile(session.user.id, session.user.email);
      if (refreshCart) refreshCart();
    } else {
      setCurrentUser(null);
      setUserRole('customer');
      setProfileData({ name: '', avatarUrl: '' });
    }
    setIsLoaded(true);
  }, [syncUserProfile, refreshCart]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuthenticationState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          await processSessionUpdate(session);
        }
      } catch (err) {
        console.error("Critical verification error:", err);
        if (isMounted) setIsLoaded(true);
      }
    };

    initializeAuthenticationState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUserRole('customer');
        setProfileData({ name: '', avatarUrl: '' });
        setIsLoaded(true);
      } else {
        await processSessionUpdate(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [processSessionUpdate]);

  const handleSignOut = async () => {
    try {
      setIsMobileMenuOpen(false);
      setIsLoaded(false); 
      if (clearCart) clearCart();
      
      setCurrentUser(null);
      setUserRole('customer');
      setProfileData({ name: '', avatarUrl: '' });

      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      await supabase.auth.signOut();
      
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failure:", error);
      window.location.href = '/login';
    }
  };

  const getUserInitials = () => {
    if (!profileData.name) return 'U';
    return profileData.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navLinks = [
    { label: 'Popular', path: '#popular' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-zinc-100 font-sans tracking-tight antialiased fixed top-0 left-0 w-full z-50">
        {/* Top Row: Logo, Search, Action Metrics */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden text-slate-700 hover:text-black focus:outline-none p-1"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 select-none group">
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors">
                T
              </div>
              <span className="text-[20px] md:text-[22px] font-bold text-slate-900 tracking-tight">JashTreads</span>
            </Link>
          </div>

          {/* Unified Search Input Bar (Hidden on ultra-small mobile screens) */}
          <div className="hidden sm:flex flex-1 max-w-md lg:max-w-xl items-center h-11 border border-zinc-200/80 rounded-md bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <button className="h-full px-4 text-[13px] text-slate-600 font-medium border-r border-zinc-100 flex items-center gap-1.5 shrink-0 hover:bg-zinc-50/80 transition-colors rounded-l-md">
              All Categories
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
            </button>
            <div className="relative flex-1 h-full flex items-center">
              <input 
                type="text" 
                placeholder="I am shopping for..." 
                className="w-full h-full px-4 bg-transparent text-[13.5px] text-slate-700 outline-none placeholder:text-zinc-400"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute right-4 pointer-events-none stroke-[1.8]" />
            </div>
          </div>

          {/* Global Functional Control Panel */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            
            {/* 24/7 Phone Support - Hidden on compact mobile dimensions */}
            <div className="hidden lg:flex items-center gap-3 select-none">
              <div className="w-9 h-9 border border-zinc-200/60 rounded-full flex items-center justify-center text-indigo-600 bg-indigo-50/30">
                <Phone className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600 stroke-[1.5]" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">24/7 Support</p>
                <p className="text-[13px] font-bold text-slate-800">(+965) 7492-3477</p>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-zinc-200 hidden lg:block"></div>

            {/* Dynamic Verification Gate Layout Frame */}
            {isLoaded ? (
              <>
                {currentUser ? (
                  <>
                    {isAdmin ? (
                      <Link href="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                        <LayoutDashboard className="w-4.5 h-4.5 text-indigo-600 stroke-[1.8]" />
                        <span className="hidden sm:inline uppercase text-[10px] tracking-wider text-zinc-400">Dashboard</span>
                      </Link>
                    ) : (
                      <>
                        {/* Profile Account Endpoint Wrapper */}
                        <Link href="/profile" className="flex items-center gap-3 group select-none">
                          {profileData.avatarUrl ? (
                            <img src={profileData.avatarUrl} alt={profileData.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-[11px] font-bold">
                              {getUserInitials()}
                            </div>
                          )}
                          <div className="leading-tight hidden md:block">
                            <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Account</p>
                            <p className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[80px]">{profileData.name}</p>
                          </div>
                        </Link>

                        {/* Wishlist Icon Counter */}
                        <Link href="/my-wishlist" className="relative p-1.5 text-indigo-600 hover:text-indigo-700 transition-colors select-none">
                          <Heart className="w-4.5 h-4.5 stroke-[1.8]" />
                          {totalWishlistCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                              {totalWishlistCount}
                            </span>
                          )}
                        </Link>

                        {/* Cart Summary Icon */}
                        <Link href="/my-cart" className="flex items-center gap-3 group select-none">
                          <div className="relative p-1.5">
                            <ShoppingCart className="w-4.5 h-4.5 text-indigo-600 group-hover:text-indigo-700 stroke-[1.8]" />
                            {totalItemCount > 0 && (
                              <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                                {totalItemCount}
                              </span>
                            )}
                          </div>
                          <div className="leading-tight hidden sm:block">
                            <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Cart</p>
                            <p className="text-[13px] font-bold text-slate-800">$0</p>
                          </div>
                        </Link>
                      </>
                    )}

                    {/* Integrated System Logout Feature */}
                    <button 
                      onClick={handleSignOut} 
                      className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-slate-800 hover:text-red-600 transition-colors border-l border-zinc-200 pl-4 h-6 ml-2"
                    >
                      <LogOut className="w-4 h-4 stroke-[1.8]" />
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 text-[13px] font-bold text-slate-800 hover:text-indigo-600 transition-colors group">
                    <User className="w-4.5 h-4.5 text-indigo-600 stroke-[1.8]" />
                    <span className="hidden sm:inline text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Sign In</span>
                  </Link>
                )}
              </>
            ) : (
              <div className="w-20 h-5 bg-zinc-100 animate-pulse rounded-md" />
            )}

          </div>
        </div>

        {/* Bottom Navigation Sub-Row Menu Items */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 border-t border-zinc-100">
          <div className="flex items-center justify-between h-12 overflow-x-auto gap-8 scrollbar-none">
            
            {/* Primary Link Directives */}
            <nav className="flex items-center gap-7 text-[13.5px] font-medium text-slate-600 whitespace-nowrap">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.path} className="hover:text-indigo-600 transition-colors py-1">
                  {link.label}
                </Link>
              ))}
              <span className="hover:text-indigo-600 transition-colors flex items-center gap-1 py-1 cursor-pointer">
                Pages <ChevronDown className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
              </span>
              <span className="hover:text-indigo-600 transition-colors flex items-center gap-1 py-1 cursor-pointer">
                Blogs <ChevronDown className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
              </span>
            </nav>

            {/* Context History & Wishes Panel Links */}
            <div className="flex items-center gap-6 text-[13.5px] font-medium text-slate-600 whitespace-nowrap">
              <Link href="/recently-viewed" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors py-1">
                <RotateCcw className="w-4 h-4 text-zinc-400 stroke-[1.5]" />
                Recently Viewed
              </Link>
              <Link href="/my-wishlist" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors py-1">
                <Heart className="w-4 h-4 text-zinc-400 stroke-[1.5]" />
                Wishlist
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Adjust Main Layout Offset Layer to avoid layout content masking beneath fixed headers */}
      <div className="h-32 w-full" />

      {/* ================= MOBILE NAVIGATION DRAWER SIDEBAR ================= */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex justify-between items-center border-b border-zinc-100">
          <span className="font-bold tracking-wider text-[11px] text-zinc-400 uppercase">
            {isLoaded && isAdmin ? 'Admin Management' : 'Navigation Menu'}
          </span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 p-1 hover:text-black">
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
        
        <nav className="flex-grow p-6 flex flex-col gap-5 overflow-y-auto">
          {isLoaded && currentUser && (
            isAdmin ? (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[13px] font-bold text-slate-800 uppercase flex items-center gap-2 mb-2 bg-zinc-50 p-3 rounded-md">
                <LayoutDashboard className="w-4.5 h-4.5 text-indigo-600" /> Dashboard Control
              </Link>
            ) : (
              <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 mb-2">
                <div className="flex items-center gap-3 bg-zinc-50/80 p-3 rounded-md border border-zinc-100">
                  <div className="w-9 h-9 rounded-full border border-zinc-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                    {profileData.avatarUrl ? (
                      <img src={profileData.avatarUrl} alt={profileData.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] font-bold text-indigo-600">{getUserInitials()}</span>
                    )}
                  </div>
                  <div className="flex flex-col truncate leading-tight">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">Signed In As</span>
                    <span className="text-[13px] font-bold text-slate-800 truncate max-w-[150px]">{profileData.name}</span>
                  </div>
                </div>

                <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="text-[13.5px] font-semibold text-slate-700 flex items-center gap-2.5 hover:text-indigo-600">
                  <ClipboardList className="w-4 h-4 text-zinc-400" /> My Orders
                </Link>
                
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-[13.5px] font-semibold text-slate-700 flex items-center gap-2.5 hover:text-indigo-600">
                  <User className="w-4 h-4 text-zinc-400" /> Profile Details
                </Link>
                
                <Link href="/my-wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-[13.5px] font-semibold text-slate-700 flex items-center gap-2.5 hover:text-indigo-600">
                  <Heart className="w-4 h-4 text-zinc-400" /> Wishlist Selection ({totalWishlistCount})
                </Link>

                <Link href="/my-cart" onClick={() => setIsMobileMenuOpen(false)} className="text-[13.5px] font-semibold text-slate-700 flex items-center gap-2.5 hover:text-indigo-600">
                  <ShoppingCart className="w-4 h-4 text-zinc-400" /> Shopping Cart ({totalItemCount})
                </Link>
              </div>
            )
          )}

          {/* Categories Mapping Pipeline */}
          {navLinks.map((item) => (
            <Link key={item.label} href={item.path} onClick={() => setIsMobileMenuOpen(false)} className="text-[13.5px] font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
          {isLoaded && (
            currentUser ? (
              <button onClick={handleSignOut} className="w-full h-11 bg-slate-900 text-white text-[12px] font-bold tracking-wide rounded-md flex items-center justify-center gap-2 hover:bg-red-600 transition-colors cursor-pointer shadow-sm">
                <LogOut className="w-4 h-4" />
                <span>Sign Out Account</span>
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full h-11 bg-indigo-600 text-white text-[12px] font-bold tracking-wide rounded-md flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm">
                <span>Sign In / Sign Up</span>
              </Link>
            )
          )}
        </div>
      </aside>
    </>
  );
}