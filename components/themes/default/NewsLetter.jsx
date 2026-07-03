"use client";
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
export const NewsLetter = () => (
  <section className="mt-20 py-24 bg-zinc-100 text-center px-6">
    <div className="max-w-xl mx-auto">
      <h3 className="text-3xl font-bold mb-6 text-black">Join the IBNA Circle</h3>
      <p className="text-zinc-500 mb-12 leading-relaxed">Receive early access to new collections and exclusive editorial content directly to your inbox.</p>
      <form className="flex flex-col md:flex-row gap-0" onSubmit={(e) => e.preventDefault()}>
        <input 
          className="flex-grow bg-white border border-zinc-200 px-6 py-4 text-xs font-medium tracking-widest focus:outline-none focus:border-black transition-colors" 
          placeholder="ENTER YOUR EMAIL" 
          type="email" 
        />
        <button className="bg-black text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-zinc-800 transition-colors mt-4 md:mt-0">
          Subscribe
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="flex flex-col items-center gap-3">
          <Truck size={24} strokeWidth={1} className="text-zinc-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ShieldCheck size={24} strokeWidth={1} className="text-zinc-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <RotateCcw size={24} strokeWidth={1} className="text-zinc-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Easy Returns</span>
        </div>
      </div>
    </div>
  </section>
);
export default NewsLetter;