"use client";

import { ShoppingBag, LogOut, Menu, X, ClipboardList, User, LayoutDashboard, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/hooks/useCart'; 

export default function Navbar() {
  const router = useRouter();
  
  // Extract context parameters explicitly
  const { totalItemCount, refreshCart, clearCart } = useCart();

  // Unified reactive count state tracking
  const [liveCount, setLiveCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Read immediately from LocalStorage to prevent flash or disappearing layout states on small screens
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const isLogged = localStorage.getItem('buraq_user_status') === 'authenticated';
      if (isLogged) return { id: 'hydrated' }; // Temp truthy shell till Supabase syncs

      const keys = Object.keys(localStorage);
      const supabaseKey = keys.find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
      return supabaseKey ? JSON.parse(localStorage.getItem(supabaseKey))?.user : null;
    }
    return null;
  });
  
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('buraq_user_role') || 'customer';
    }
    return 'customer';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(!currentUser);

  // ⚡ Sync the local UI badge state with the global hook state immediately
  useEffect(() => {
    setIsClient(true);
    setLiveCount(totalItemCount || 0);
  }, [totalItemCount]);

  // ⚡ Event-driven backup trigger to intercept cross-layout additions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncBadgeCount = () => {
      if (typeof totalItemCount !== 'undefined') {
        setLiveCount(totalItemCount);
      }
      if (refreshCart) {
        refreshCart();
      }
    };

    window.addEventListener('cart-updated', syncBadgeCount);
    window.addEventListener('focus', syncBadgeCount);

    return () => {
      window.removeEventListener('cart-updated', syncBadgeCount);
      window.removeEventListener('focus', syncBadgeCount);
    };
  }, [totalItemCount, refreshCart]);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (data && !error) {
        setUserRole(data.role);
        localStorage.setItem('buraq_user_role', data.role);
        localStorage.setItem('buraq_user_status', 'authenticated');
      } else {
        setUserRole('customer');
        localStorage.setItem('buraq_user_role', 'customer');
      }
    } catch (err) {
      console.error(err);
      setUserRole('customer');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
      
      if (session?.user) {
        localStorage.setItem('buraq_user_status', 'authenticated');
        await fetchUserRole(session.user.id);
        if (refreshCart) refreshCart(); 
      } else {
        localStorage.removeItem('buraq_user_role');
        localStorage.removeItem('buraq_user_status');
        setIsSyncing(false);
      }
    };
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setCurrentUser(session?.user || null);
      if (session?.user) {
        localStorage.setItem('buraq_user_status', 'authenticated');
        await fetchUserRole(session.user.id);
        if (event === 'SIGNED_IN') {
          if (refreshCart) refreshCart();
          router.refresh();
        }
      } else {
        setUserRole('customer'); 
        localStorage.removeItem('buraq_user_role');
        localStorage.removeItem('buraq_user_status');
        setIsSyncing(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, refreshCart]);

  const handleSignOut = async () => {
    try {
      setIsMobileMenuOpen(false);
      if (clearCart) clearCart();
      
      // Wipe structural state identifiers immediately
      setCurrentUser(null);
      setUserRole('customer');
      
      // Clean up storage completely
      localStorage.removeItem('buraq_user_role'); 
      localStorage.removeItem('buraq_user_status'); 

      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      
      // Hard refresh to clear memory contexts and redirect cleanly to the login page
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
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
          
          <div className="flex-1">
            <Link href="/" className="group inline-block font-sans text-xl font-bold tracking-[0.05em] uppercase text-black">
              Buraq<span className="font-light text-[#777777] group-hover:text-black transition-colors duration-300">Wears</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-10 flex-[2]">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.path} className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#555555] hover:text-black transition-colors duration-300 pb-0.5">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-6 flex-1 text-black/80">
            {currentUser ? (
              <>
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
                  </>
                )}
              </>
            ) : (
              isSyncing ? (
                <div className="w-16 h-4 bg-neutral-100 animate-pulse rounded-sm" />
              ) : (
                <Link href="/login" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#444444] hover:text-black transition-colors pb-0.5 border-b border-transparent hover:border-black/30">
                  Login / Signup
                </Link>
              )
            )}

            {/* Shopping Cart UI Icon */}
            {!isAdmin && (
              <Link href="/my-cart" className="relative hover:text-black transition-colors p-1 group/cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {isClient && liveCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center tracking-tight border border-white scale-100">
                    {liveCount}
                  </span>
                )}
              </Link>
            )}

            {currentUser && (
              <button onClick={handleSignOut} className="flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-red-600 transition-colors cursor-pointer ml-1 border-l border-black/[0.08] pl-5">
                <LogOut size={15} strokeWidth={1.5} />
                <span className="uppercase tracking-[0.15em] text-[9px] font-semibold">Logout</span>
              </button>
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

          <div className="flex items-center gap-4 text-black/80">
            {currentUser ? (
              isAdmin ? (
                /* Secure Mobile Link for Admin Users */
                <Link href="/dashboard" title="Admin Dashboard" className="text-black p-1">
                  <LayoutDashboard size={20} strokeWidth={1.5} />
                </Link>
              ) : (
                /* Uncollapsed Action Row for Authenticated Customers */
                <>
                  <Link href="/my-orders" className="p-1"><ClipboardList size={20} strokeWidth={1.5} /></Link>
                  <Link href="/my-orders" className="p-1"><User size={20} strokeWidth={1.5} /></Link>
                </>
              )
            ) : (
              /* Fallback Immediate Login Link for Mobile Layout Symmetry */
              !isSyncing && (
                <Link href="/login" className="p-1 text-black" title="Login / Signup">
                  <LogIn size={20} strokeWidth={1.5} />
                </Link>
              )
            )}
            
            {!isAdmin && (
              <Link href="/my-cart" className="relative p-1">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {isClient && liveCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[14px] h-[14px] bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                    {liveCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-[270px] bg-white z-50 shadow-xl transition-transform duration-300 ease-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex justify-between items-center border-b border-black/[0.05]">
          <span className="font-semibold tracking-[0.15em] text-xs text-[#666666]">{isAdmin ? 'ADMIN CONSOLE' : 'MENU'}</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-black p-1"><X size={20} strokeWidth={1.5} /></button>
        </div>
        
        <nav className="flex-grow p-6 flex flex-col gap-6">
          {isAdmin && (
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold tracking-[0.2em] text-black uppercase flex items-center gap-2">
              <LayoutDashboard size={14} strokeWidth={1.5} /> Dashboard Control
            </Link>
          )}
          {navLinks.map((item) => (
            <Link key={item.label} href={item.path} onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-medium tracking-[0.2em] text-[#444444] uppercase">{item.label}</Link>
          ))}
        </nav>
        
        <div className="p-5 border-t border-black/[0.05] bg-[#fafafa]">
          {currentUser ? (
            <button onClick={handleSignOut} className="w-full h-11 bg-black text-white text-[10px] font-medium tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-colors cursor-pointer">
              <LogOut size={14} strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full h-11 bg-black text-white text-[10px] font-medium tracking-[0.2em] uppercase flex items-center justify-center">
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}