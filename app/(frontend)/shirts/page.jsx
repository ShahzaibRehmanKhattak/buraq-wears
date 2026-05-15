"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  SlidersHorizontal, 
  ChevronDown, 
  ArrowRight, 
  Globe, 
  Camera, 
  Mail, 
  Wallet, 
  CreditCard, 
  Heart 
} from 'lucide-react';
import {ProductCard} from '@/components/ProductCard';
const INITIAL_PRODUCTS = [
  { id: 1, title: "Fluid Silk Blouse", price: 340.00, category: "Silk", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHIGSTalyZ7nn3bZexI5iFYiaSjKCltiWNmLu19AgHIMB4-0EVZToAQgbWvfcK8gGHGQbE70ab8g4LtKHsXgniM6vgvRv3pNGPMMPsR06MbH5Rez23jXCFMgC1qh0Hy3eyQXwwOHfFKPxG8n116kVtgnpuygaGGVTPaoiGtgu-tDQQn7Bgg8wm7FF3KyFqK1frVheNj5ImJJw-2M5Y7jYFJzu7zpqt8PZK4LPCP_513BKbXxTp7rLSwY7ZV79mgeiEJJ9uwgwqUQ" },
  { id: 2, title: "Structured Cotton Poplin", price: 280.00, category: "Poplin", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuYeV9OS_PbCZIkoIFoCp2wUBCYJLfplHdVaUPRghTJ5pI5VZChtqNkjtWXo_4Fd1oZFldE3KvGDzxtV6NbMsySra7wQIeP0vNpBrfbzdFvPLTl4eko3AP_LBFBQ8FzUedqA2NuNobFJ_uryB-wne68S7CJpQiK-W0sdQUeVfplSdRPYjJO8ZDw1h8wBH5P_bon9IlA0qR1IfwnIKy37eS9Teo-ubb6LbVujZyC9I-lwECgqRQCK6G_Ztv3CatUEjg9cAxG7ggVg" },
  { id: 3, title: "Relaxed Linen Shirt", price: 220.00, category: "Linen", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMfLClkT7T1hcS-L3lE7KF3d5d22wSygDtw3Xmz3rYWud2CXSjk4jHukd6liAgbfzWR3T5rgKnXOzsRYdVPu9nmOMydS2bfCwiM-n9nBBwAwKWRY3ipQptQD4grQFMKtUTk3ZQvQ9uri80hGrt9HitQkMdOErau6v6eVej7yssG20Y1vU7u9uGPfznBKkt_VQ7LbnbyEPgJibvWnbJAhFLY45f1IWeNgH8ecHWxTL_tNehLtyIFITjzKF4zONTJBXq5Wfw2hShsw" },
  { id: 4, title: "Tailored Evening Shirt", price: 450.00, category: "Poplin", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnfXXJPHPbES_0IS86toBceaYe2AR0GPcjgHseBSNSuMyId-9-5jyAlfFzHZ4uhDoOmpO2pwft0QaGrJ8e0KdBRPZTHT_g9nT_oFSOURezjcz7M2N6Ai482ZPxhycL3Ug2zPigNDAQjFlkCWPNOz8VrNJDEjUpv8DPaA37b7YlM-r7rdRgjoHzuurAXUkWO5KoJyt5nIHwZf9AgfS9vK5YmdbXcBQ4HfcfT17IajqyGYab0puICMFiclfqwmNNlMjHYQy43fy50A" },
  { id: 5, title: "Pinstripe Executive", price: 295.00, category: "Poplin", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk_u0JjWWufXzjlAUirYSmm-EoiHBlP4WVrdjz-oG12dZ9il6rgaY75zqsgLQunqmcU86Uw_L-DKhLBc2U__V_UgwuwXrJxOOKOp2jIeSFoj61T1JZ8jUmP6iWU57Ss7y1sZ7jLmObzI-pSRqwh9NseCGdsbR3G4fOkAB4lo5q4skDvThmr3MPUeAhVSV6wlMXEiRnjp6t_oMW50CIDyeBf6xNi1yBFN7JWpbx7DCYbJAjVdrAsuu1JLEKpb5Py25-tHCk9KEb7w" },
  { id: 6, title: "Midnight Silk Wrap", price: 380.00, category: "Silk", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUtQl8-R9dyqbpBJGARC8e3lj0_KyviVXRZUARWqvFy90-k_cj2OGVyn8TV4nJRdHK-xSph2NnRFxEfjtGseTEMiKiWpYhswWAAlt8ceWoPq3NQJZqyWJQsPoTOSni6qw8Qgwwvr6-xnvsowo4fxd0XinE6k3lOXucopBWBR1Ey6BRM2Vkoawq5RfeUuC5nMLb5b4OznYg4he-S0m0p3Qb78ni_JYyXZde8ez9GDOEv5Syrv7nJ_D3AhBubkz1rft9mzrGJ5xtaw" },
  { id: 7, title: "Textured Cotton Shirt", price: 260.00, category: "Poplin", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkTIauALfIvxdmKWcqgBlGsolLD_ZN32XQUeeS7TIvz7dsJVNMAYRRGqiJMMKm6dBUv3uhmFCCUuxGfHKAB1mIA1-RLISdLpSbfUbbWZvza9KShBwKHMr_v8kE3KdR5PtvEAjuTHpRYCxcfakFuKqLjLQt3oSzjWAPSpImMEFkU8ZpsxX5--h_ltc7TDCv3-3QCqXLmq_frO4vqNxS2Hmmgd7J0DHnX0biEcNlSDLlps0W_f0ok6FCUEFXKHN-Pllw64gCKPUlug" },
  { id: 8, title: "Modern Oversized Poplin", price: 310.00, category: "Poplin", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcJH7KsAksIl1Ahk03YKa9tmOPOcnvwXKiwDwgQiMJ_H7nfn7sJw7TLknpH-Yo7v4-3Fzktflc6BPn0MPWdJrMI_KkXM7wAwUJcmtgsmYTmgmggrLw1ljGiTn4SgDhcYXvpdy1msrSFwOi9ml5QEuPT_ByU0LhXqtayLeqCKNG-rXt4EK5_tH_d_7AMKkP-MujM6Z9N2OSswIJ3sV7Tpa1O_T7lPeUpROkuzGsVWkMoW1GbU376KuGlGQXa_3hnnjgQQGdFSLCQg" },
];


const Hero = () => (
  <header className="relative w-full h-[400px] md:h-[600px] overflow-hidden flex items-center justify-center">
    <img 
      className="absolute inset-0 w-full h-full object-cover scale-105" 
      alt="Editorial fashion" 
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpvvmlQ3GUCvBmHlg8eNWPcbWpe5TKpXh6DEJ_4-p5kP4WhcxXrryXu_J1OEZWrehkZ_Fo7B9hD0Ko-IK5LUiChOqx6l8_EfgtMgmVqXPb41cOxe3NAxa5A7o_D-hDHr45-Zjs7dA0uaSmgdB3cSEtkqfUmtNogKErl_1FRqIVL7IdVWky1zFJbpqSQ9tfeSf4z1DtFhU9OJ0AD7FXaVuJeL936u8CfTuV0L4Iv3lc1f1eae2EEIUq9sagDm1D0rZcG5u6OuhxlQ"
    />
    <div className="relative z-10 text-center text-white px-6">
      <h1 className="text-3xl md:text-[48px] font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] mb-4 drop-shadow-md animate-fadeIn">The Shirt Collection</h1>
      <p className="text-sm md:text-[18px] max-w-xl mx-auto opacity-90 font-light leading-relaxed">Essential silhouettes crafted from the world's finest linen, silk, and cotton poplin.</p>
    </div>
    <div className="absolute inset-0 bg-black/15"></div>
  </header>
);

const FilterBar = ({ activeFilter, setActiveFilter, productCount, sortBy, setSortBy }) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'low-high' },
    { label: 'Price: High to Low', value: 'high-low' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white/95 border-b border-[#cfc4c5]/20 mt-6 md:mt-12 relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[64px] h-14 md:h-[72px] flex justify-between items-center">
        <div className="flex gap-8 md:gap-12 items-center">
          <button className="flex items-center gap-2 text-[12px] md:text-[14px] font-semibold uppercase tracking-[0.15em] hover:text-[#5e5e5e] transition-colors group">
            <SlidersHorizontal size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Filter
          </button>
          <div className="hidden lg:flex gap-10 items-center text-[#4c4546]">
            {['All Shirts', 'Silk', 'Linen', 'Poplin'].map((category) => (
              <span 
                key={category} 
                onClick={() => setActiveFilter(category)}
                className={`text-[12px] md:text-[14px] font-semibold uppercase tracking-[0.15em] cursor-pointer transition-all relative pb-1
                  ${activeFilter === category ? 'text-black border-b border-black' : 'hover:text-black opacity-70'}
                `}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <span className="hidden sm:inline text-[10px] md:text-[12px] font-medium text-[#4c4546] uppercase tracking-[0.15em] opacity-40">{productCount} Products</span>
          
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1 text-[11px] md:text-[14px] font-semibold uppercase tracking-[0.1em] md:tracking-[0.15em] hover:text-[#5e5e5e] transition-colors outline-none"
            >
              <span className="hidden sm:inline opacity-60">Sort By:</span> <span className="text-black ml-1">{sortOptions.find(o => o.value === sortBy)?.label}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#cfc4c5]/20 shadow-xl z-50 animate-fadeIn">
                {sortOptions.map((option) => (
                  <div 
                    key={option.value}
                    onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                    className={`px-6 py-4 text-[12px] font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#f3f3f4] transition-colors ${sortBy === option.value ? 'bg-[#f3f3f4] text-black' : 'text-[#4c4546]'}`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
    }
    .product-card-shadow:hover {
      box-shadow: 0 20px 40px -20px rgba(0,0,0,0.08);
    }
    body {
      background-color: #f9f9f9;
    }
  `}</style>
);

export default function App() {
  const [activeFilter, setActiveFilter] = useState('All Shirts');
  const [sortBy, setSortBy] = useState('featured');

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...INITIAL_PRODUCTS];
    
    // Filtering
    if (activeFilter !== 'All Shirts') {
      result = result.filter(p => p.category === activeFilter);
    }

    // Sorting
    if (sortBy === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [activeFilter, sortBy]);

  return (
    <div className="antialiased bg-white text-[#1a1c1c] font-sans selection:bg-black selection:text-white">
      <GlobalStyles />
      
      <Hero />

      <FilterBar 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
        productCount={filteredAndSortedProducts.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <section className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[64px] pt-12 md:pt-[80px] pb-8 md:pb-[40px]">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 md:mb-12 border-b border-[#cfc4c5]/10 pb-6">
          <h2 className="text-xl md:text-[32px] font-semibold uppercase tracking-wider mb-2 md:mb-0">Limited Availability</h2>
          <a className="text-[12px] md:text-[14px] font-semibold uppercase tracking-widest text-[#4c4546] hover:text-[#000000] transition-colors flex items-center gap-2" href="#">
            View Boutique <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[24px]">
          <div className="group relative overflow-hidden h-[300px] md:h-[450px] flex items-center justify-center bg-[#f3f3f4] product-card-shadow">
            <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnfXXJPHPbES_0IS86toBceaYe2AR0GPcjgHseBSNSuMyId-9-5jyAlfFzHZ4uhDoOmpO2pwft0QaGrJ8e0KdBRPZTHT_g9nT_oFSOURezjcz7M2N6Ai482ZPxhycL3Ug2zPigNDAQjFlkCWPNOz8VrNJDEjUpv8DPaA37b7YlM-r7rdRgjoHzuurAXUkWO5KoJyt5nIHwZf9AgfS9vK5YmdbXcBQ4HfcfT17IajqyGYab0puICMFiclfqwmNNlMjHYQy43fy50A" alt="Edition" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
            <div className="relative z-10 text-center text-white px-6 md:px-8">
              <span className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.3em] mb-2 md:mb-4 block opacity-80">Last 5 Pieces</span>
              <h3 className="text-lg md:text-[24px] font-semibold uppercase tracking-wide mb-4 md:mb-6">Tailored Evening Shirt</h3>
              <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-[#000000] text-[12px] md:text-[14px] font-semibold uppercase tracking-widest hover:bg-[#000000] hover:text-white transition-all duration-500">Shop Edition</button>
            </div>
          </div>
          <div className="group relative overflow-hidden h-[300px] md:h-[450px] flex items-center justify-center bg-[#f3f3f4] product-card-shadow">
            <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUtQl8-R9dyqbpBJGARC8e3lj0_KyviVXRZUARWqvFy90-k_cj2OGVyn8TV4nJRdHK-xSph2NnRFxEfjtGseTEMiKiWpYhswWAAlt8ceWoPq3NQJZqyWJQsPoTOSni6qw8Qgwwvr6-xnvsowo4fxd0XinE6k3lOXucopBWBR1Ey6BRM2Vkoawq5RfeUuC5nMLb5b4OznYg4he-S0m0p3Qb78ni_JYyXZde8ez9GDOEv5Syrv7nJ_D3AhBubkz1rft9mzrGJ5xtaw" alt="Edition" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
            <div className="relative z-10 text-center text-white px-6 md:px-8">
              <span className="text-[10px] md:text-[12px] font-medium uppercase tracking-[0.3em] mb-2 md:mb-4 block opacity-80">Limited Edition</span>
              <h3 className="text-lg md:text-[24px] font-semibold uppercase tracking-wide mb-4 md:mb-6">Midnight Silk Wrap</h3>
              <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-[#000000] text-[12px] md:text-[14px] font-semibold uppercase tracking-widest hover:bg-[#000000] hover:text-white transition-all duration-500">Shop Edition</button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[64px] py-12 md:py-[80px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-[24px] gap-y-10 md:gap-y-[72px]">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className="mt-16 md:mt-[100px] flex justify-center">
          <button className="w-full md:w-auto border border-[#000000]/20 px-8 md:px-[80px] py-3.5 md:py-4 text-[12px] md:text-[14px] font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#000000] hover:text-white hover:border-[#000000] transition-all duration-700 ease-out">Load More</button>
        </div>
      </main>

 
    </div>
  );
}