import { ArrowRight } from 'lucide-react';
export const Hero = () => (
  <section className="mt-4 md:mt-12 mb-20 md:mb-32 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
    {/* Text Content */}
    <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1 px-2 md:px-0">
      <span className="text-[10px] md:text-[12px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-4">Spring / Summer 2024</span>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 leading-[1.1] text-black">
        The <br className="hidden md:block" /> Architectural <br className="hidden md:block" /> Perspective.
      </h1>
      <p className="text-base md:text-lg text-zinc-600 mb-8 md:mb-10 max-w-sm leading-relaxed">
        Exploring the intersection of structural form and textile fluidity. Our new season defines the silhouette through calculated minimalism.
      </p>
      <div>
        <button className="w-full md:w-auto bg-black text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
          View Lookbook <ArrowRight size={14} />
        </button>
      </div>
    </div>
    
    {/* Responsive Image Container */}
    <div className="md:col-span-7 order-1 md:order-2">
      <div className="aspect-[3/4] sm:aspect-[4/3] md:aspect-[4/5] bg-zinc-100 overflow-hidden w-full relative">
        <img 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBfZauzD3ioaPM70oY4Bjab4wesAaT2hjb6Kv7KtBxcXV2cUY_Lggkv3zdvX7ZIdxCguEPg8i4eETGawIfPdc62a6AR7q2y9Hu7wtVgK_HZv_dX5g_Q5FXhogERuwZ-rdL4UkqCfevcfkmFoZpc30HFht9Hy7n8b_6_XP-evw72M3D7BoWQ8gB3QvHvKR1vw3bWlEAOs-sk6P29azL_wpULd0Fsm0CHQ_fmx_S8jc4dNuYvUQrCRmA3amCjrsu-Jyq3uqUQxvtcA" 
          alt="Architectural Coat" 
          loading="eager"
        />
      </div>
    </div>
  </section>
);
