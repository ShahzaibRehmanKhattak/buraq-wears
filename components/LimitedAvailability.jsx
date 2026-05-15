import { Plus } from 'lucide-react';
import React from 'react';

export const LimitedAvailability = () => (
  <section className="py-32 bg-[#1a1c1c] text-white">
    <div className="max-w-[1440px] mx-auto px-6 md:px-20">
      <div className="flex justify-between items-baseline mb-20">
        <div>
          <span className="text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Final Inventory</span>
          <h2 className="font-display text-[40px] md:text-[48px] uppercase leading-none">Limited Availability</h2>
        </div>
        <a href="#" className="text-[11px] font-bold uppercase tracking-widest border-b border-white/20 pb-1 hover:border-white transition-all">
          Shop Archive Sale
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 group cursor-pointer overflow-hidden relative">
          <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
            <img 
              alt="Sale" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgi_J_OMCvmUTTEMILxNQYzFMqLm2UdsDOs2AQQjzbVAw-UVQ6L9wQE2fv2MhgjQ8_Ew2Z9cwY8Cn_TnmGdLMCPfB7h9hBEgxW3pyWgxpV6AYqakDhsr5XSRVIeqq2iBn96hY00pK79wCZp-AZQux7_chNqUn9WhC4aP6wByq4n-tMOK-pvOFZ7Xt4WyBdUjv1AXd7XYKJi5X-BobvWNXw0Fpx7vZcmhpFpwuMF0bhdqYQwJWtohNRyEfN-QN_b_cXsJVwNIOAqA" 
            />
          </div>
          <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest">
            Hot Discount / 40% OFF
          </div>
          <div className="mt-8 flex justify-between items-end">
            <div>
              <h3 className="font-display text-[24px] uppercase mb-2">Cashmere Knitwear Series</h3>
              <div className="flex items-center gap-4">
                <span className="text-red-500 font-semibold text-xl">$195.00</span>
                <span className="text-white/40 line-through text-sm">$320.00</span>
              </div>
            </div>
            <button className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white text-black font-bold text-[10px] px-8 py-3 uppercase">
              Quick Add
            </button>
          </div>
        </div>

        <div className="md:col-span-5 space-y-16">
          {[
            { tag: '-30% Season End', title: 'Signature Chinos', price: '$145.00', oldPrice: '$210.00' },
            { tag: '-30% High Demand', title: 'Evening Blazer', price: '$380.00', oldPrice: '$550.00' }
          ].map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="flex gap-8">
                <div className="w-2/5 aspect-[3/4] overflow-hidden bg-zinc-900 relative">
                  <img 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={idx === 0 ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBf5aQI_LkR_tfjwb9F7Wn2qQjVQPLhFlAkCFaCzMzfjT4wiTrSZpilA7CY-N7ckP0Th5jw47SyQYPl7ETV328uAgo1vynf5360-sleJ2dQ0Kd1BMEDDpZm2V7qQlu99yTcJwC7C90k4F1JF43fZaQaSoseOQbfMfR5Ux05Lbz-iun_g9B5Tchp2fLlDaABcuZAcfdHO6f9s6H7V5bLx6h99qfOVMLBCvcEL9-9BJF245feaswbp3bMGCLTlgWHpRhOrAh7ThKfyg" : "https://lh3.googleusercontent.com/aida-public/AB6AXuAvOEfc39i_Ei4Vuvjmnz1BPC58Ft_6cLtRqiYvU6JYe5y30-CxO-Ta2fyVNiJc3oYsmcsrE45yLsPnLquCsGpDj70Ipcg2TXgAYk1Vh3tQ1mx6sqYuCpdjTXp1fsabvLFKOaqCWN5-0lxhqZUo5l_u3CTa9-FRdopBbKs8TbgHZMbFhqLuGd5xfMLyvz3E9thkEN6Wzxe_gLRfBNGLJPLR8igkCwFKcCLW5AAOu9RTUa8LnTwpmW9VF08glqyVI1c-a9e6B2Zp3g"} 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Plus className="text-white" />
                  </div>
                </div>
                <div className="w-3/5 py-4">
                  <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-2 block">{item.tag}</span>
                  <h4 className="text-[12px] font-bold uppercase mb-2 text-white/90">{item.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{item.price}</span>
                    <span className="text-white/30 text-xs line-through">{item.oldPrice}</span>
                  </div>
                  <button className="mt-6 text-[10px] font-bold uppercase text-white/50 border-b border-white/20 pb-1 group-hover:text-white group-hover:border-white transition-all">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
