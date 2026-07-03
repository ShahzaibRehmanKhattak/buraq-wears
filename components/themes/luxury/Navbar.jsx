"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, LogOut, Menu, X, ClipboardList, User, LayoutDashboard, Search, Heart, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/hooks/useCart'; 
import { useFavorites } from '@/hooks/FavoritesContext'; 

export default function Navbar() {
  const { totalItemCount, refreshCart, clearCart } = useCart();
  const { favoriteItems } = useFavorites(); 

  // Core Authentication & Profile State Hub
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const [profileData, setProfileData] = useState({ name: '', avatarUrl: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state tracking reference to eliminate memory racing loops
  const syncInProgressRef = useRef(null);
  const totalWishlistCount = favoriteItems?.length || 0;

  // Safe remote database profile synchronization matrix
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
        console.error("Profile cache hydration warning:", err);
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
        if (isMounted) await processSessionUpdate(session);
      } catch (err) {
        console.error("Auth layer startup fail:", err);
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
      console.error("Logout process exception:", error);
      window.location.href = '/login';
    }
  };

  const getUserInitials = () => {
    if (!profileData.name) return 'U';
    return profileData.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navLinks = [
    { label: 'Popular', path: '/popular' },
    { label: 'Shop', path: '/shop' },
  ];

  const isAdmin = userRole === 'admin';

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white border-b border-neutral-200/50 antialiased font-sans">
      
      {/* ================= 1. UTILITY TOP BANNER LAYER ================= */}
      <div className="w-full bg-[#1b284f] text-white py-2 px-6 md:px-12 transition-all duration-200">
        <div className="max-w-[1340px] mx-auto flex justify-between items-center text-[12px] font-normal tracking-wide">
          <div>
            Get free delivery on orders over <span className="font-semibold">$80</span>
          </div>
          <div className="flex items-center gap-4 text-white/80">
            {isLoaded ? (
              currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-white/60 font-medium">Hi, {profileData.name || 'User'}</span>
                  <span className="w-[1px] h-3 bg-white/20" aria-hidden="true" />
                  <button onClick={handleSignOut} className="hover:text-red-400 font-semibold uppercase text-[10px] tracking-wider transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="hover:text-white transition-colors">Create an account</Link>
                  <span className="w-[1px] h-3 bg-white/20" aria-hidden="true" />
                  <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
                </>
              )
            ) : (
              <div className="w-20 h-3 bg-white/10 animate-pulse rounded-sm" />
            )}
          </div>
        </div>
      </div>

      {/* ================= 2. PRINCIPAL ENTERPRISE NAVIGATION CORE ================= */}
      <div className="w-full px-6 md:px-12 py-3.5 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1340px] mx-auto flex justify-between items-center">
          
          {/* Brand Identity Module */}
          <div className="flex items-center gap-3.5">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-[#1e293b] hover:text-[#4f46e5] focus:outline-none p-1 transition-colors">
              <Menu size={22} strokeWidth={1.8} />
            </button>
            
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-[#4f46e5] rounded-[8px] flex items-center justify-center text-white shadow-sm shadow-[#4f46e5]/20 group-hover:bg-[#4338ca] transition-colors">
                <ShoppingBag size={18} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-bold text-[#111111] tracking-tight flex items-center gap-1.5">
                  Cozy
                  <span className="bg-[#00b4d8] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-[3px] tracking-widest scale-90 origin-left">
                    Demo
                  </span>
                </span>
                <span className="text-[12px] text-neutral-400 tracking-[0.08em] font-semibold uppercase mt-0.5">
                  commerce
                </span>
              </div>
            </Link>
          </div>

          {/* Centered Structured Links Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#334155]">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.path} className="hover:text-[#4f46e5] transition-colors py-1.5">
                {item.label}
              </Link>
            ))}
            
            {/* Nav Interactive Dropdowns */}
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#4f46e5] py-1.5 transition-colors">
              <span>Pages</span>
              <ChevronDown size={13} className="text-neutral-400 mt-[1px] group-hover:text-[#4f46e5] transition-colors" />
            </div>

            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#4f46e5] py-1.5 transition-colors">
              <span>Blog</span>
              <ChevronDown size={13} className="text-neutral-400 mt-[1px] group-hover:text-[#4f46e5] transition-colors" />
            </div>

            <Link href="/contact" className="hover:text-[#4f46e5] transition-colors py-1.5">
              Contact
            </Link>
          </nav>

          {/* System Control Panel Console */}
          <div className="flex items-center gap-4 text-[#334155]">
            <button aria-label="Search Catalog" className="hover:text-[#4f46e5] p-1.5 transition-colors">
              <Search size={20} strokeWidth={1.8} />
            </button>
            
            {isLoaded && currentUser && (
              <Link href={isAdmin ? "/dashboard" : "/my-orders"} title={isAdmin ? "Admin Console" : "My Orders"} className="hover:text-[#4f46e5] p-1.5 transition-colors hidden md:block">
                {isAdmin ? <LayoutDashboard size={20} strokeWidth={1.8} /> : <ClipboardList size={20} strokeWidth={1.8} />}
              </Link>
            )}

            {/* Profile Interface Route Anchor */}
            <Link href={currentUser ? "/profile" : "/login"} aria-label="Profile Account" className="hover:text-[#4f46e5] p-1.5 transition-colors flex items-center">
              {isLoaded && currentUser && profileData.avatarUrl ? (
                <img src={profileData.avatarUrl} alt={profileData.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-neutral-200" />
              ) : (
                <User size={20} strokeWidth={1.8} />
              )}
            </Link>
            
            {/* Dynamic System Badge Containers */}
            <Link href="/my-wishlist" aria-label="Wishlist" className="relative hover:text-[#4f46e5] p-1.5 transition-colors">
              <Heart size={20} strokeWidth={1.8} />
              {totalWishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#e63946] text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalWishlistCount}
                </span>
              )}
            </Link>
            
            <Link href="/my-cart" aria-label="Cart" className="relative hover:text-[#4f46e5] p-1.5 transition-colors">
              <ShoppingBag size={20} strokeWidth={1.8} />
              {totalItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#e63946] text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItemCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* ================= 3. MOBILE MENUDRAWER TRANSITION MODAL ================= */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-[20px_0_40px_rgba(0,0,0,0.03)] border-r border-neutral-100 transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
          <span className="font-bold tracking-[0.12em] text-[10px] text-neutral-400 uppercase">
            {isLoaded && isAdmin ? 'Admin Terminal' : 'Navigation'}
          </span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-500 hover:text-black p-1 transition-colors">
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        
        <nav className="flex-grow p-6 flex flex-col gap-5">
          {isLoaded && currentUser && (
            <div className="flex flex-col gap-3.5 border-b border-neutral-100 pb-5 mb-1">
              <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/40">
                <div className="w-8 h-8 rounded-full ring-1 ring-neutral-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                  {profileData.avatarUrl ? (
                    <img src={profileData.avatarUrl} alt={profileData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-neutral-600">{getUserInitials()}</span>
                  )}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Account Session</span>
                  <span className="text-[13px] font-medium text-neutral-800 truncate max-w-[170px]">{profileData.name}</span>
                </div>
              </div>

              <Link href={isAdmin ? "/dashboard" : "/my-orders"} onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-neutral-700 hover:text-[#4f46e5] flex items-center gap-2.5 transition-colors">
                {isAdmin ? <LayoutDashboard size={15} strokeWidth={1.8} /> : <ClipboardList size={15} strokeWidth={1.8} />}
                {isAdmin ? 'Dashboard Administration' : 'Track Active Orders'}
              </Link>
              
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-[12px] font-semibold tracking-wide text-neutral-700 hover:text-[#4f46e5] flex items-center gap-2.5 transition-colors">
                <User size={15} strokeWidth={1.8} /> Profile parameters
              </Link>
            </div>
          )}

          {navLinks.map((item) => (
            <Link key={item.label} href={item.path} onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] font-semibold tracking-wide text-neutral-800 hover:text-[#4f46e5] transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-[14px] font-semibold tracking-wide text-neutral-800 hover:text-[#4f46e5] transition-colors">
            Contact Hub
          </Link>
        </nav>
        
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
          {isLoaded && (
            currentUser ? (
              <button onClick={handleSignOut} className="w-full h-10 bg-[#1b284f] hover:bg-red-700 text-white text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded-md shadow-sm transition-all">
                <LogOut size={13} strokeWidth={2} />
                <span>Sign Out Terminal</span>
              </button>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full h-10 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[10px] font-bold tracking-widest uppercase flex items-center justify-center rounded-md shadow-sm transition-all">
                <span>Account Access</span>
              </Link>
            )
          )}
        </div>
      </aside>
    </header>
  );
}