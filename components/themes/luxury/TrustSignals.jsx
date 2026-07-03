import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

const TrustSignals = () => (
  <section className="md:hidden mt-10 px-5 mb-12 antialiased">
    {/* Clean White Premium Card Layout matching the main theme block structure */}
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      
      {/* Signal 1 */}
      <div className="flex items-center gap-4">
        {/* Dark Enterprise Icon Badge */}
        <div className="w-11 h-11 rounded-xl bg-[#1b284f] flex items-center justify-center shrink-0 shadow-sm">
          <Truck className="text-[#00b4d8] w-5 h-5 stroke-[2]" />
        </div>
        <div className="flex flex-col">
          <h5 className="text-[13px] font-bold uppercase tracking-wider text-slate-900">
            Premium Logistics
          </h5>
          <p className="text-[12px] text-slate-500 font-normal mt-0.5">
            Complimentary global delivery over $250
          </p>
        </div>
      </div>
      
      {/* Minimal Light Divider */}
      <div className="h-[1px] w-full bg-gray-100" />

      {/* Signal 2 */}
      <div className="flex items-center gap-4">
        {/* Dark Enterprise Icon Badge */}
        <div className="w-11 h-11 rounded-xl bg-[#1b284f] flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="text-[#00b4d8] w-5 h-5 stroke-[2]" />
        </div>
        <div className="flex flex-col">
          <h5 className="text-[13px] font-bold uppercase tracking-wider text-slate-900">
            Lifetime Quality
          </h5>
          <p className="text-[12px] text-slate-500 font-normal mt-0.5">
            Sourced from elite sustainable mills
          </p>
        </div>
      </div>
      
    </div>

    {/* Clean, Muted Brand Label Centered Below */}
    <p className="text-center text-[10px] text-gray-400 mt-8 tracking-[0.25em] uppercase font-semibold">
      © 2026 IBNA ATELIER SUITE
    </p>
  </section>
);

export default TrustSignals;