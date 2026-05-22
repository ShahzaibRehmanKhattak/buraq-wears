"use client";
import React from 'react';
import { Search, ShoppingBag, Heart, Truck, ShieldCheck, Share2, Globe } from 'lucide-react';
const GlobalStyles = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      
      :root {
        --primary: #000000;
        --on-surface-variant: #4c4546;
        --surface-container-low: #f3f3f4;
        --outline-variant: rgba(0,0,0,0.1);
        --error: #ba1a1a;
      }

      body {
        font-family: 'Inter', sans-serif;
        background-color: #f9f9f9;
        color: var(--primary);
        -webkit-font-smoothing: antialiased;
      }

      .font-display {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        letter-spacing: -0.04em;
      }

      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      
      .tap-scale { transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      .tap-scale:active { transform: scale(0.96); }
    `}</style>
  </>
);

export default function ProductPage() {
  return (

    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased selection:bg-[#1b1b1b] selection:text-[#848484]">
          <GlobalStyles />

      <main className="max-w-[1440px] mx-auto px-16 py-12 md:py-20">
         <br></br>
        {/* Breadcrumbs */}
        <nav className="mb-12 flex items-center gap-2 font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546]">
          <a className="hover:text-[#000000] transition-colors" href="#">Home</a>
          <span>/</span>
          <a className="hover:text-[#000000] transition-colors" href="#">Accessories</a>
          <span>/</span>
          <span class="text-[#000000] font-semibold">Signature Leather Tote</span>
        </nav>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Product Gallery */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
            <div className="aspect-[3/4] bg-[#eeeeee] overflow-hidden">
              <img 
                alt="Signature Leather Tote" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJVeycoCSixpxcLXYDB_FG7pBD_L0mDWAcuVVae02aV_Btq3r08ubO1BcDRJgXfaywatQzr-3c7UC0Qk3ybi_n2lPTL68IVCeJU9nJzN_TnqpSShY6bk9qRJ4MUeN2-8bXyfINESCKeLaEetlUmHH0BqKESHIL_tB5FkbODm-4ojSqhCSbW7sXcJTXUq-KQn0WPZTkOeZrVA2C1xplGZ1NaIiv_Hx_RzcpJlDWlzClFJjcPSBmSuuJy_D5qv971d415MJDuAMFSA"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-[3/4] bg-[#eeeeee] cursor-pointer overflow-hidden border border-[#000000]">
                <img alt="Detail 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-QB1zrFhWRl3qFX14uNCaftI3ATbiGL5xJ9DrTRJ2fRUCNcyi2bfhCdEYRlCENu-IhkxtdyQa9woa7qwjJ3D-WK26IdTaiF-UOfc-DWMMvjtuH0nQ4Ql7-ZgdUFcYM0zFU-fxeFDZ2IaKE0_7kqsJPig7VaCPVlAsiXe4exzz4B774Mcb12okk_A7reOuJymiQ7YWqtZbqMw9HI7KMi_T_2lrEKUC8fedkg5eyUSDxhoX9JPJ3sFlt0sSI5FQiGQQ-YCy5bcODQ" />
              </div>
              <div className="aspect-[3/4] bg-[#eeeeee] cursor-pointer overflow-hidden hover:opacity-80 transition-opacity">
                <img alt="Detail 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwmo7thHAqoXLKydAFY-QHX2qGkLaEodeeD0-cldTWszrpLbzpwCYVHxVbDBaohL4Q-wbaDzHLgh16vNkL_9UHBg6W7bbK2OQpeWv8TwqZ-MNIo0nKBv0dhUe3kbDO-FvEAgzQh1bWOybVmgXGfNaqBKkBRdwS0gWPuEjmc2yEiPIQGMhlEZg92rpWcM-6xh2lGjbuYkwKPLLzKq2aBUO5M6YNm4-x5DNu4gFk67YFy7wj-YAJh633Ftxxa8f8MTQ0w8Prt2ZVQg" />
              </div>
              <div className="aspect-[3/4] bg-[#eeeeee] cursor-pointer overflow-hidden hover:opacity-80 transition-opacity">
                <img alt="Detail 3" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUtYBCPyb3Uz7kK7EvJJRxLJfXqBKMxzQjCOZzDUYN-A3PtVmKV7iuK2j9DYHwY15TP__FrDZnLTWO8uQRQuFV9F8QxinFE_qDL0aLJcJ39qdYD-b_-vCYGsXT-f-T2NsEsSR8N_ka0sJEfxT5VF8F2W11tTj5nLNA_IllUyBDszNcIMpfXinPBnwqTt3dm17de-Un9RMn0BP77gMIFoWd74q-ZkSko1OUEs9z24gSj7zcLSy5IzVjL0aayDqwtz9bkoX6wBUOlw" />
              </div>
              <div className="aspect-[3/4] bg-[#eeeeee] cursor-pointer overflow-hidden hover:opacity-80 transition-opacity">
                <img alt="Detail 4" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrXX5CNGPvOAvANic-aFSHylh9rG8r_OX_YVSgxJ1dkDgstuHTTr9CaMV5II3C3xmSSyb1MgyzaaBm-lTtQYzaRkitNJgmA94yl_qxqccfeTk0P95ybpnweAG-1xeyKeXAYXZZDHjAx3ohALwqRsQ6xdF9dBwKu1PUwMW62syXMb7yPhZqQR0jW7pY9pwZs9lZP9POyWQyo5ZjLgJhHcsmlOWF6oDapf89o22oEUCZN0-Ss_BDAteXZfqGuL92g1KkgRvCSbCk4w" />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-8">
            <div>
              <h1 className="font-['Inter'] text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#000000] mb-2">Signature Leather Tote</h1>
              <p className="font-['Inter'] text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#000000]">$2,450.00</p>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000]">COLOR: NOIR</span>
              </div>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-black ring-1 ring-offset-2 ring-[#000000]"></button>
                <button className="w-10 h-10 bg-[#4D3A2F] ring-1 ring-[#cfc4c5] hover:ring-[#000000] transition-all"></button>
                <button className="w-10 h-10 bg-[#D9C4B1] ring-1 ring-[#cfc4c5] hover:ring-[#000000] transition-all"></button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000]">SIZE</span>
                <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] underline hover:text-[#000000]" href="#">Size Guide</a>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 border border-[#cfc4c5] font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold hover:border-[#000000] transition-colors">MEDIUM</button>
                <button className="flex-1 py-3 border border-[#000000] bg-[#000000] text-[#ffffff] font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold">LARGE</button>
                <button className="flex-1 py-3 border border-[#cfc4c5] font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold hover:border-[#000000] transition-colors">OVERSIZED</button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 pt-4">
              <button className="flex-grow bg-[#000000] text-[#ffffff] py-5 font-['Inter'] text-[14px] leading-none tracking-widest font-semibold uppercase hover:opacity-90 active:opacity-70 transition-all">
                ADD TO BAG
              </button>
              <button className="w-16 flex items-center justify-center border border-[#cfc4c5] hover:border-[#000000] transition-colors">
                <Heart className="w-5 h-5 text-[#000000] stroke-[1.5]" />
              </button>
            </div>

            {/* Atelier Notes */}
            <div className="space-y-6 pt-6">
              <div className="border-t border-[#cfc4c5] pt-6">
                <h3 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] uppercase mb-4">Atelier Notes</h3>
                <p className="font-['Inter'] text-[16px] leading-[1.5] font-normal text-[#4c4546]">
                  A cornerstone of the IBNA collection, the Signature Leather Tote is crafted from premium Italian calfskin. Featuring hand-painted edges and structural reinforcement, it represents the pinnacle of master craftsmanship and silent luxury.
                </p>
              </div>
              <div>
                <h3 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] uppercase mb-4">Technical Specs</h3>
                <ul className="font-['Inter'] text-[16px] leading-[1.5] font-normal text-[#4c4546] space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-[#000000] rounded-full"></span>
                    Microfiber suede lining
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-[#000000] rounded-full"></span>
                    Discrete gold-foil branding
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-[#000000] rounded-full"></span>
                    Interior leather-trimmed zip pocket
                  </li>
                </ul>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-[#cfc4c5]">
              <div className="flex items-center gap-3">
                <Truck className="text-[#000000] w-[20px] h-[20px] stroke-[1.5]" />
                <span className="font-['Inter'] text-[12px] leading-tight font-medium text-[#000000] uppercase">Complimentary <br/>Express Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#000000] w-[20px] h-[20px] stroke-[1.5]" />
                <span className="font-['Inter'] text-[12px] leading-tight font-medium text-[#000000] uppercase">Authenticity <br/>Guaranteed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Complete the Look */}
        <section className="mt-32">
          <h2 className="font-['Inter'] text-[24px] font-semibold leading-[1.3] tracking-widest text-[#000000] mb-12 uppercase text-center">Complete the Look</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Item 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#eeeeee] overflow-hidden mb-4 relative">
                <img alt="Monogram Slim Belt" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUV7CJDoQuQMnyaiyTZ935PL8x2la1GLiGu6SzPFC6q8Xhw18quexmbZKZW2YFkxOMIeAwsIJezd23LppRD4cKV-1OIKaiM5VbqSCaGIhtVIOp50GBsdawvAUKh4ot-kQWymqdoISPahg-O6RIONqQftq2EkAIG6B4BbIJbRbaeXHxBN002orIHA46XCexI1aygLOEn5TVym9uEEWBmo2P70qc0jhSK9nW-GGs_SEC-J1qWRbnVn-TzAZLuP9pcM1waDsKRyOdfA" />
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-[#000000] text-[#ffffff] py-3 font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold">QUICK ADD</button>
                </div>
              </div>
              <h3 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] mb-1">Monogram Slim Belt</h3>
              <p className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546]">$450.00</p>
            </div>

            {/* Item 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#eeeeee] overflow-hidden mb-4 relative">
                <img alt="Essential Card Holder" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUtbtzpfmk3u2Zbb-sSnCN7qKKwPy5n4P89HNfaAw59Ha9hr22Rz0rXiRui23DyWgV5buelYv4RmZ5eK4FBnmw-ySXtk0C8LH4nfpGLCCVCqHL3krYIzGzTML6s7iU3URGx67h7bBtCBQ6pVg6Kac92GfKJrtbnwlOFPjQgD4-tNVO9f71dewu7_UudKWygEbNxBrawW7XRKcaEkxzZXK3ZPiaNeqWJdrDKDjdwLss_8_mlShGhXYU_Wr9MaaNdqxULjqJ5oNZeQ" />
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-[#000000] text-[#ffffff] py-3 font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold">QUICK ADD</button>
                </div>
              </div>
              <h3 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] mb-1">Essential Card Holder</h3>
              <p className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546]">$295.00</p>
            </div>

            {/* Item 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#eeeeee] overflow-hidden mb-4 relative">
                <img alt="Pebbled Leather Wallet" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5wUXF0AX8dSfvIMOIgWpTbyUQK_mEwUlaZcBGqJmIX1obBZtE1BaEe-IYF5aHiWaVCZzqRiGIBAgr7NF2qXwefPSQYGjaJ0-Y6mefA3zhKdJPfgd90m9Xo_koypKecsUfvJleWNW8WwxbETW3wboltzfR3ZBew1fQVBG9WhGmyT-L9q33EdQRtlT9nu0xUk2GCuVkJKpd32Il_5pDvh90denT2s85cXPvrzP2vwSUDpfc1b0ecr4zxlPGRxuJdZ-_SmGEnkeNYg" />
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-[#000000] text-[#ffffff] py-3 font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold">QUICK ADD</button>
                </div>
              </div>
              <h3 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] mb-1">Pebbled Leather Wallet</h3>
              <p className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546]">$620.00</p>
            </div>

            {/* Item 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-[#eeeeee] overflow-hidden mb-4 relative">
                <img alt="Silk Twilly Scarf" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmf3FtfKkoSyIxDZ2EcrH_WvnVfhIAg3p4eJhTr7laYhLXMYzub1U6p36Zj6VIDjidso7eKukuT-KvAxqngzt04wsxOxv4FbxBrzn7R_n5lyjQZHrze5XgPriQEpOQUeAxjX1zgxRBgaOwlapByP8X9m3yd1RIKE_88gMv8n0uFx97xZSHmGrMPhilZyMmgs0peVMFdNYfHEdCGM3WrHrjM3MUKcURSoYByeUml_-pTVYECGc0Rtvu-BiopJEjfdj5EOTGrXtbaw" />
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-[#000000] text-[#ffffff] py-3 font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold">QUICK ADD</button>
                </div>
              </div>
              <h3 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] mb-1">Silk Twilly Scarf</h3>
              <p className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546]">$225.00</p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f3f3f4] border-t border-[#cfc4c5]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-16 py-20 w-full max-w-[1440px] mx-auto">
          <div className="md:col-span-4 space-y-6">
            <div className="font-['Inter'] text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] font-bold text-[#000000]">IBNA</div>
            <p className="font-['Inter'] text-[16px] leading-[1.5] font-normal text-[#4c4546] max-w-xs">
              Quiet authority in luxury design. Established to provide a flawless stage for individual style through architectural precision.
            </p>
          </div>
          
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] uppercase">Information</h4>
            <nav className="flex flex-col gap-2">
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">Privacy Policy</a>
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">Terms of Service</a>
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">Shipping &amp; Returns</a>
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">Store Locator</a>
            </nav>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] uppercase">Company</h4>
            <nav className="flex flex-col gap-2">
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">About Us</a>
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">Sustainability</a>
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">Atelier</a>
              <a className="font-['Inter'] text-[12px] leading-none font-medium text-[#4c4546] hover:underline" href="#">Contact Us</a>
            </nav>
          </div>

          <div className="md:col-span-4 space-y-6">
            <h4 className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] uppercase">Newsletter</h4>
            <div className="flex border-b border-[#000000] py-2">
              <input className="bg-transparent border-none focus:ring-0 w-full font-['Inter'] text-[12px] leading-none font-medium" placeholder="ENTER YOUR EMAIL" type="email" />
              <button className="font-['Inter'] text-[14px] leading-none tracking-[0.05em] font-semibold text-[#000000] hover:opacity-70 transition-opacity">JOIN</button>
            </div>
          </div>

          <div className="md:col-span-12 pt-12 flex justify-between items-center border-t border-[#cfc4c5] mt-12 opacity-50">
            <span className="font-['Inter'] text-[12px] leading-none font-medium">© 2024 IBNA LUXURY. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-6">
              <Share2 className="w-[18px] h-[18px] stroke-[1.5]" />
              <Globe className="w-[18px] h-[18px] stroke-[1.5]" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}