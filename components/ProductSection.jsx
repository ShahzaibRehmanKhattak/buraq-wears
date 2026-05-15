import { Heart, Plus } from 'lucide-react';
export const ProductSection = ({ title, subtitle, items, layout = "grid" }) => {
  return (
    <section className="py-16 md:py-32 px-5 md:px-20 max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex justify-between items-baseline mb-8 md:mb-16">
        <div>
          <h2 className="text-[28px] md:text-[40px] font-bold uppercase tracking-tighter leading-none">{title}</h2>
          <p className="md:hidden text-[13px] text-gray-500 mt-1">{subtitle}</p>
        </div>
        <a href="#" className="text-[11px] font-bold uppercase tracking-widest border-b border-black/20 pb-1 hover:border-black transition-all">View All</a>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f4] mb-6">
              <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" src={item.image} />
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
                <button className="bg-white text-black text-[10px] font-bold px-4 py-2 uppercase hover:bg-black hover:text-white transition-colors">Add to Bag</button>
                <Heart size={18} className="text-white hover:text-red-500 transition-colors" />
              </div>
            </div>
            <h3 className="text-[12px] font-bold uppercase mb-2 tracking-wider">{item.title}</h3>
            <p className="text-[14px] text-gray-500">{item.price}</p>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Layout */}
      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 -mx-2 px-2">
        {items.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-[180px] snap-start tap-scale">
            <div className="relative aspect-[3/4] bg-[#f3f3f4] rounded-lg overflow-hidden mb-3">
              <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
              <button className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-black p-2 rounded-full shadow-sm">
                <Plus size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-medium truncate uppercase tracking-tight">{item.title}</h4>
              <button className="shrink-0"><Heart size={16} className="text-gray-300" /></button>
            </div>
            <span className="text-[13px] text-gray-500 mt-0.5 block">{item.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
};