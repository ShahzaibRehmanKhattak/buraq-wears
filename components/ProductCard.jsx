import { Heart } from 'lucide-react';
export const ProductCard = ({ image, title, price }) => (
  <div className="group relative cursor-pointer">
    <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f4] mb-6">
      <img 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" 
        src={image} 
      />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
        <button className="bg-white text-black text-[10px] font-bold px-4 py-2 uppercase hover:bg-black hover:text-white transition-colors">
          Add to Bag
        </button>
        <Heart size={18} className="text-white hover:text-red-500 transition-colors" />
      </div>
    </div>
    <h3 className="text-[12px] font-bold uppercase mb-2 tracking-wider">{title}</h3>
    <p className="text-[14px] text-gray-500">{price}</p>
  </div>
);