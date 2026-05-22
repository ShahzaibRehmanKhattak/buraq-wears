"use client";
import React from 'react';

export default function ShoppingBag() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-sans antialiased selection:bg-black selection:text-white pb-16 md:pb-0">
      {/* Dynamic Inject Google Fonts and Material Symbols for Preview Stability */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Global Style Override for Context-Aware Smooth Scrollbar */}
      <style>{`
        input:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        @media (max-width: 768px) {
          body {
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* Premium Minimalist Scrollbar — Hidden until explicitly interacted with */
        .premium-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .premium-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scroll::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 20px;
          transition: background 0.3s ease;
        }
        /* Fade thumb in elegantly ONLY when moving inside or hovering the area */
        .premium-scroll:hover::-webkit-scrollbar-thumb,
        .premium-scroll:active::-webkit-scrollbar-thumb,
        .premium-scroll:focus::-webkit-scrollbar-thumb {
          background: rgba(17, 17, 17, 0.15);
        }
        .premium-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(17, 17, 17, 0.35) !important;
        }
      `}</style>

      {/* Desktop Header & Mobile Minimal Header */}
      <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-black/[0.04]">
        <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 md:py-6 max-w-[1440px] mx-auto">
          <div className="flex-1">
            <a className="font-bold text-[20px] md:text-[24px] tracking-[-0.06em] text-black inline-block" href="#">
              IBNA
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-10 flex-[2]">
            {['Collections', 'Shirts', 'Trousers', 'Accessories', 'Atelier'].map((item) => (
              <a 
                key={item} 
                className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#666666] hover:text-black pb-0.5 border-b border-transparent hover:border-black/40 transition-all duration-300" 
                href="#"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center justify-end gap-6 flex-1">
            <button className="material-symbols-outlined text-[20px] text-black hover:text-[#666666] transition-colors">search</button>
            <button className="material-symbols-outlined text-[20px] text-black hover:text-[#666666] transition-colors">person</button>
            <button className="material-symbols-outlined text-[20px] text-black hover:text-[#666666] transition-colors">shopping_bag</button>
          </div>

          {/* Mobile Right Action Indicator */}
          <div className="flex md:hidden items-center justify-end gap-4">
            <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">3 ITEMS</span>
          </div>
        </div>
      </nav>

      {/* Native App-style Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-lg border-t border-black/[0.06] z-50 flex justify-around items-center py-2 px-2 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <button className="flex flex-col items-center gap-0.5 text-black flex-1">
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[8px] font-medium tracking-wider uppercase">Shop</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-[#888888] flex-1">
          <span className="material-symbols-outlined text-[22px]">search</span>
          <span className="text-[8px] font-medium tracking-wider uppercase">Search</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-black flex-1 relative">
          <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          <span className="text-[8px] font-semibold tracking-wider uppercase">Bag</span>
          <span className="absolute top-0 right-6 w-1.5 h-1.5 bg-[#ba1a1a] rounded-full"></span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-[#888888] flex-1">
          <span className="material-symbols-outlined text-[22px]">person</span>
          <span className="text-[8px] font-medium tracking-wider uppercase">Profile</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="pt-8 md:pt-20 pb-24 md:pb-32 px-4 md:px-16 max-w-[1440px] mx-auto">
        {/* Compact Header */}
        <div className="mb-8 md:mb-16 border-b border-black/[0.06] pb-4 md:pb-8">
          <h1 className="font-semibold text-[28px] md:text-[38px] uppercase tracking-[-0.02em] md:tracking-[-0.03em] leading-none mb-2 text-black">Shopping Bag</h1>
          <p className="text-[10px] md:text-[11px] font-medium tracking-[0.15em] md:tracking-[0.2em] uppercase text-[#777777]">3 Items in your selection</p>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          
          {/* Scrollable Product List Container with Extra Air and Dynamic Visibility */}
          <div className="col-span-12 lg:col-span-7 flex flex-col max-h-[520px] md:max-h-[640px] overflow-y-auto pr-4 md:pr-6 premium-scroll transition-all duration-300">
            
            {/* Item 1 */}
            <div className="flex gap-4 md:gap-8 group items-start pb-6 mb-6 border-b border-black/[0.05]">
              <div className="w-[100px] md:w-[140px] aspect-[3/4] overflow-hidden bg-[#f5f5f5] shrink-0 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaFIkA_Nm4gtUbIGdlkpjyh8M7iKyvjaCwdf5sTRQCvZ7Rbtp2CMzDSB7hFuZx30xm4UGzbHOWiEEf-TK6u9LHyei6V3V1UMlUC-YGJiquj0Z5uRp06FamEmWwxejAHBnhaaXaPlrNaAlrEdPA2fAtBozNlVR_AjrpsvwoXYBBbN-BqtbNjsT2vo-en7NvzkReFUTCAhGN5iiTte_eUa_HDpcnesRXkQajLOQOYMNM7y7bFVw9tWC93C1ASlDowBFR4JUM9Xx74w" 
                  alt="Tailored Wool Blazer"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-[133px] md:min-h-[185px] py-0.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h2 className="text-[12px] md:text-[13px] font-semibold tracking-[0.08em] md:tracking-[0.12em] uppercase text-black mb-1">Tailored Wool Blazer</h2>
                    <p className="text-[9px] md:text-[10px] tracking-widest uppercase text-[#777777] font-medium leading-tight">Charcoal Grey / Virgin Wool</p>
                  </div>
                  <p className="text-[13px] md:text-[14px] text-black font-semibold tracking-tight whitespace-nowrap">€850.00</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 md:gap-8 my-1">
                  <div>
                    <div className="flex gap-1">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button key={size} className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[10px] md:text-[11px] font-medium transition-all duration-200 rounded-sm border ${size === 'M' ? 'bg-black text-white border-black' : 'border-black/[0.08] text-black hover:border-black'}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center border border-black/[0.08] h-7 md:h-8 px-2 gap-3 rounded-sm bg-white w-max">
                      <button className="material-symbols-outlined text-[13px] md:text-[15px] text-[#666666]">remove</button>
                      <span className="text-[11px] md:text-[12px] font-semibold text-black min-w-[10px] text-center">1</span>
                      <button className="material-symbols-outlined text-[13px] md:text-[15px] text-[#666666]">add</button>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-[#888888] hover:text-[#ba1a1a] transition-colors group/remove w-fit mt-1">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase border-b border-transparent group-hover/remove:border-[#ba1a1a]/40">Remove</span>
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-4 md:gap-8 group items-start pb-6 mb-6 border-b border-black/[0.05]">
              <div className="w-[100px] md:w-[140px] aspect-[3/4] overflow-hidden bg-[#f5f5f5] shrink-0 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGKaVQlqQy6SVfsIb0UF2e2Rh75wOpfZTfjYWOGPz4rQJ0ZfXpX6kDQNQ1LnK1IFSRFVXqiMpHVHF41cXhIcJqYuIkQnuFcqS_OLk0kYvKeysabYKlPi4x5gX3ZwoPvQaszIE_E0LCrDy0GHVTwouJxNBJe0qOKi8fJ5usYBMFkMRCNWn18SoMiUvI_RVw2AAAH2g3FH49tAL6TgAc937BxeJVQZAJRDeMfJllXkoxcDL8Gqp1NlQoNrojQyx0y3Ivspx8HBImJA" 
                  alt="Silk Slip Dress"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-[133px] md:min-h-[185px] py-0.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h2 className="text-[12px] md:text-[13px] font-semibold tracking-[0.08em] md:tracking-[0.12em] uppercase text-black mb-1">Silk Slip Dress</h2>
                    <p className="text-[9px] md:text-[10px] tracking-widest uppercase text-[#777777] font-medium leading-tight">Midnight Black / 100% Silk</p>
                  </div>
                  <p className="text-[13px] md:text-[14px] text-black font-semibold tracking-tight whitespace-nowrap">€420.00</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 md:gap-8 my-1">
                  <div>
                    <div className="flex gap-1">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button key={size} className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[10px] md:text-[11px] font-medium transition-all duration-200 rounded-sm border ${size === 'S' ? 'bg-black text-white border-black' : 'border-black/[0.08] text-black hover:border-black'}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center border border-black/[0.08] h-7 md:h-8 px-2 gap-3 rounded-sm bg-white w-max">
                      <button className="material-symbols-outlined text-[13px] md:text-[15px] text-[#666666]">remove</button>
                      <span className="text-[11px] md:text-[12px] font-semibold text-black min-w-[10px] text-center">1</span>
                      <button className="material-symbols-outlined text-[13px] md:text-[15px] text-[#666666]">add</button>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-[#888888] hover:text-[#ba1a1a] transition-colors group/remove w-fit mt-1">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase border-b border-transparent group-hover/remove:border-[#ba1a1a]/40">Remove</span>
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-4 md:gap-8 group items-start pb-6 mb-2 border-b border-transparent">
              <div className="w-[100px] md:w-[140px] aspect-[3/4] overflow-hidden bg-[#f5f5f5] shrink-0 rounded-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7KIbihrWTN8Kd4cd8IMZUrBL82d7IdPCJe31MrgEq2kqCDqi23xApN7F96c6qI093ZQJ15LGuP1hnfBDkb1VMtl7I7cfC8Mymt654FG6_pAX-rkwkh9aWaYVNsIfAz38_Hk0GWoXDrgP0M0JazdV7hsmgOXfuMrsEeI0h0a_78msOcmzqPBIffPHCEKqXpbIbIVkMcubFHXqLGn9HGbShqZBH-IkAjsrQiiRvn84vr1-LMmR__kb7omO2_-TugJ6KZ5u5w-oAw" 
                  alt="Bone Trousers"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-[133px] md:min-h-[185px] py-0.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h2 className="text-[12px] md:text-[13px] font-semibold tracking-[0.08em] md:tracking-[0.12em] uppercase text-black mb-1">Bone Trousers</h2>
                    <p className="text-[9px] md:text-[10px] tracking-widest uppercase text-[#777777] font-medium leading-tight">Off-White / Heavy Gabardine</p>
                  </div>
                  <p className="text-[13px] md:text-[14px] text-black font-semibold tracking-tight whitespace-nowrap">€320.00</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 md:gap-8 my-1">
                  <div>
                    <div className="flex gap-1">
                      {['30', '32', '34'].map((size) => (
                        <button key={size} className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[10px] md:text-[11px] font-medium transition-all duration-200 rounded-sm border ${size === '32' ? 'bg-black text-white border-black' : 'border-black/[0.08] text-black hover:border-black'}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center border border-black/[0.08] h-7 md:h-8 px-2 gap-3 rounded-sm bg-white w-max">
                      <button className="material-symbols-outlined text-[13px] md:text-[15px] text-[#666666]">remove</button>
                      <span className="text-[11px] md:text-[12px] font-semibold text-black min-w-[10px] text-center">1</span>
                      <button className="material-symbols-outlined text-[13px] md:text-[15px] text-[#666666]">add</button>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-[#888888] hover:text-[#ba1a1a] transition-colors group/remove w-fit mt-1">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase border-b border-transparent group-hover/remove:border-[#ba1a1a]/40">Remove</span>
                </button>
              </div>
            </div>

          </div>

          {/* Checkout Process Block */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-24 mt-4 lg:mt-0">
            <div className="bg-white p-5 md:p-10 border border-black/[0.05] rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.01)]">
              <form className="space-y-8 md:space-y-10" onSubmit={(e) => e.preventDefault()}>
                {/* Step 1: Shipping */}
                <section>
                  <h3 className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2.5 text-black">
                    <span className="w-4 h-4 md:w-[18px] md:h-[18px] bg-black text-white text-[8px] md:text-[9px] font-bold flex items-center justify-center rounded-sm">1</span>
                    Shipping Information
                  </h3>
                  <div className="space-y-3">
                    <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Full Name" type="text" />
                    <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Shipping Address" type="text" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="City" type="text" />
                      <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Postal Code" type="text" />
                    </div>
                    <input className="w-full bg-[#fafafa] border border-black/[0.06] focus:border-black px-3.5 py-2.5 text-[11px] font-medium tracking-wide placeholder:text-black/30 transition-colors rounded-sm" placeholder="Phone Number" type="tel" />
                  </div>
                </section>

                {/* Step 2: Payment */}
                <section>
                  <h3 className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2.5 text-black">
                    <span className="w-4 h-4 md:w-[18px] md:h-[18px] bg-black text-white text-[8px] md:text-[9px] font-bold flex items-center justify-center rounded-sm">2</span>
                    Payment Method
                  </h3>
                  <div className="p-4 border border-black bg-[#fafafa] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <div className="w-3.5 h-3.5 rounded-full border-[3.5px] border-black bg-white"></div>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-0.5 text-black">Cash on Delivery (COD)</p>
                        <p className="text-[10px] font-medium text-[#777777] uppercase tracking-widest leading-relaxed">Pay in cash upon arrival.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Step 3: Final Summary */}
                <section className="pt-5 border-t border-black/[0.06]">
                  <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between text-[10px] md:text-[11px] font-medium text-[#777777] uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-black font-semibold">€1,590.00</span>
                    </div>
                    <div className="flex justify-between text-[10px] md:text-[11px] font-medium text-[#777777] uppercase tracking-widest">
                      <span>Shipping</span>
                      <span className="text-black font-medium italic text-[#222222] normal-case">Complimentary</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-black/[0.04] mt-2">
                      <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-black">Total</span>
                      <span className="font-bold text-[22px] md:text-[26px] tracking-[-0.03em] text-black">€1,590.00</span>
                    </div>
                  </div>
                  <button className="w-full bg-black text-white py-3.5 md:py-4 text-[11px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-[#222222] transition-all duration-300 flex items-center justify-center gap-2 rounded-sm shadow-sm" type="submit">
                    <span className="material-symbols-outlined text-[16px] md:text-[18px]">lock</span> Place Order
                  </button>
                </section>
              </form>
            </div>
          </div>
        </div>

        {/* Recommended Grid Section */}
        <section className="mt-24 md:mt-40">
          <div className="flex justify-between items-baseline mb-6 md:mb-10 border-b border-black/[0.06] pb-3">
            <h2 className="text-[20px] md:text-[26px] font-medium uppercase tracking-[-0.02em] text-black">Recommended</h2>
            <a className="text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase text-[#666666] border-b border-transparent hover:border-black transition-all" href="#">Explore All</a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "Bone Trousers", price: "€320.00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7KIbihrWTN8Kd4cd8IMZUrBL82d7IdPCJe31MrgEq2kqCDqi23xApN7F96c6qI093ZQJ15LGuP1hnfBDkb1VMtl7I7cfC8Mymt654FG6_pAX-rkwkh9aWaYVNsIfAz38_Hk0GWoXDrgP0M0JazdV7hsmgOXfuMrsEeI0h0a_78msOcmzqPBIffPHCEKqXpbIbIVkMcubFHXqLGn9HGbShqZBH-IkAjsrQiiRvn84vr1-LMmR__kb7omO2_-TugJ6KZ5u5w-oAw" },
              { title: "Classic Shirt", price: "€210.00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNc-eo5XqE7y_70mwImpmuueCZ9vXMZbMznBQ_FJr9rjx1KlY6_5Qyb_TaYzQkASCZg70-9JOF9DYCg3tvQ_zuUXa-oUa5MXjOhHzSzmq4tZqKGNzMakYUHXdl67PujRvhfLU_bvdFfQoRyI7vMdyDjlf80HbgjriSNawKU-z8nC19P7u_yebg7e7Rqm01XifqOArpXoQZseGY5ewkTC3IXzSDYw9j7wJhR1LLzQHykZJTX4YpvuTkpiEU-Gv2LmWcviKLBnPmTg" },
              { title: "Structured Vest", price: "€390.00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8eE31vER9BI0mUOkXCKvA-UBVdCghZ6lAsNJdmho1JO7D6r2Pm8axuYs4SycdsGWthRx0aSKd05bYPRhhboALGzMbowU39BWXI7a0YVDXW4sNJbRWxyr3PR93ScsJCYs3M7zzcR0iCOC56P8IVAlpuTlwZo1P4RTG1kZHVfw2G3fLt0mOCP30IoY9lPN-IIDl2-b9moXig6x3v0sCh9bzrIiWkMTPp3NDWPi26esywxY5LFyhcKA4o2MQz-ZSi2_bIatr-qReLg" },
              { title: "Form Belt", price: "€180.00", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDODiyCfT9MO8R86xU5_pru3BkpPSR0ps-kDQxwjV5oryGUrlOMAGL8udClXJNfXYbwD1yUoj6vQJ97oRDsujSbWau1suTcb15fre8g3DnUxWacjtIpFZ8RfxYSi30qBovBRqR_yqp9VrxeP1nQBjqRERw7RXIzouKJERf0dBwU2X4nfsOkCVM0IFoTvtDxfLl3PAcO7u_ARLGa35KgGzU8BzxbRLaDnY_JIG9eOaHN5no63TWZdk9RpzkG1c2676_Hj1NXb1BC0A" }
            ].map((item, index) => (
              <div key={index} className="group relative cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] mb-2 md:mb-4 rounded-sm">
                  <img alt={item.title} className="w-full h-full object-cover transition-transform duration-[1s] ease-out group-hover:scale-[1.02]" src={item.img}/>
                </div>
                <h3 className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.05em] text-black truncate">{item.title}</h3>
                <p className="text-[12px] md:text-[13px] text-[#666666] font-medium">{item.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

 
    </div>
  );
}