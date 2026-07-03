import React from 'react';
const TrustSignals = () => (
  <section className="md:hidden mt-16 px-5 mb-10">
    <div className="bg-black text-white rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-[28px]">local_shipping</span>
        <div>
          <h5 className="text-[13px] font-bold uppercase tracking-wider">Premium Logistics</h5>
          <p className="text-[12px] opacity-70">Complimentary global delivery over $250</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-[28px]">verified</span>
        <div>
          <h5 className="text-[13px] font-bold uppercase tracking-wider">Lifetime Quality</h5>
          <p className="text-[12px] opacity-70">Sourced from elite sustainable mills</p>
        </div>
      </div>
    </div>
    <p className="text-center text-[10px] text-gray-400 mt-8 tracking-[0.2em] uppercase">© 2024 IBNA RETAIL GROUP</p>
  </section>
);

export default TrustSignals;