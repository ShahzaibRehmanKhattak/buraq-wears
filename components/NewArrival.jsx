'use client';

export const NewArrivals = () => {
  // Static mock array to perfectly fill a standard 4-column storefront grid line
  const staticProducts = [
    { id: 1, name: "Studio Tailored Blazer", price: 240.00, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Minimalist Leather Tote", price: 185.00, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Classic Cotton Poplin Shirt", price: 95.00, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Raw Denim Relaxed Trouser", price: 145.00, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop" },
    { id: 5, name: "Ribbed Knit Crew Sweater", price: 120.00, image: "https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=600&auto=format&fit=crop" },
    { id: 6, name: "Suede Chelsea Boots", price: 310.00, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop" },
    { id: 7, name: "Architectural Silver Ring", price: 85.00, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop" },
    { id: 8, name: "Oversized Wool Trench Coat", price: 380.00, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop" }
  ];

  return (
    <section className="py-16 md:py-32 px-5 md:px-20 max-w-[1440px] mx-auto overflow-visible relative block clear-both bg-white">
      
      {/* Header Layout Area */}
      <div className="flex justify-between items-baseline mb-8 md:mb-16">
        <div>
          <h2 className="text-[28px] md:text-[40px] font-bold uppercase tracking-tighter leading-none">New Arrivals</h2>
          <p className="md:hidden text-[13px] text-gray-500 mt-1">Just landed in the studio</p>
        </div>
        <a href="/products" className="text-[11px] font-bold uppercase tracking-widest border-b border-black/20 pb-1 hover:border-black transition-all">
          View All
        </a>
      </div>

      <div className="w-full flex flex-col items-center overflow-visible">
        
        {/* 🖥️ DESKTOP GRID VIEWPORT */}
        <div className="hidden md:grid grid-cols-4 gap-6 w-full mb-16 overflow-visible">
          {staticProducts.map((product) => (
            <div key={`desktop-${product.id}`} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f4] mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
                  <button className="bg-white text-black text-[10px] font-bold px-4 py-2 uppercase hover:bg-black hover:text-white transition-colors">
                    Add to Bag
                  </button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart text-white hover:text-red-500 transition-colors">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-[12px] font-bold uppercase mb-2 tracking-wider truncate">{product.name}</h3>
              <p className="text-[14px] text-gray-500">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* 📱 MOBILE CAROUSEL HORIZONTAL STREAM */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 -mx-2 px-2 w-full mb-12">
          {staticProducts.map((product) => (
            <div key={`mobile-${product.id}`} className="flex-shrink-0 w-[180px] snap-start tap-scale">
              <div className="relative aspect-[3/4] bg-[#f3f3f4] rounded-lg overflow-hidden mb-3">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover" 
                  alt={product.name} 
                />
                <button className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-black p-2 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-[14px] font-medium truncate uppercase tracking-tight w-[85%]">{product.name}</h4>
                <button className="shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart text-gray-300">
                    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                  </svg>
                </button>
              </div>
              <span className="text-[13px] text-gray-500 mt-0.5 block">${product.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* 🎯 STATIC LOOKS-ONLY HARDCODED BUTTON */}
        <div className="w-full flex justify-center px-4 mt-4 relative z-50 overflow-visible block clear-both">
          <button
            type="button"
            className="
              h-12 w-full sm:w-auto sm:min-w-[240px] px-8
              text-xs font-bold tracking-widest uppercase text-black
              bg-white border-2 border-black rounded-sm
              transition-all duration-200 ease-in-out
              hover:bg-black hover:text-white
              active:bg-black active:text-white
            "
          >
            Load More
          </button>
        </div>

      </div>
    </section>
  );
};