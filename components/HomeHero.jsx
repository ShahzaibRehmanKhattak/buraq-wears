export const Hero = () => {
  const images = [
    {
      title: "The Architecture of Silence",
      subtitle: "Autumn / Winter 2024",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB9Lj9cKmbD--vZPlthPtmeKnJ3qJKGstb7qVkBja9LokynQ34CFKF2tFIlh_msZeygqnACM1-cL4ZfcgiABmKIaHmI4Pv_e_1R0FjmABquJkt9fGHqwRDcJSZF1LtPoVChAL2qI_ahR5hE-ZexxdgSRhwP6sah0dDCA6t64nEZhlMR1_dsoHA8lrgwhwoHRZAwFrI9bCLgJFYoMer_uEQ1zIMs0oihQO-pBCk9dlLD27O6VZXzkbUkUkiEkW41Pn7Js7Nd21EEw"
    },
    {
      title: "The Monolith Collection",
      subtitle: "NEW SEASON",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATh97VKPY7vJrxOEBS2nWYlb5UX3ttntTGLLX8Jg4K0zl-TzFXMesX1VNBlUs0yygSOEi1EpRMiKomj_DyW0rxvLOP0C7tdm4IWWiWaIfGxluF6jUUPgWX1pC8lNuT83HoD4xRjL46VvHS1B3dsgcxCYHjbY7ww5VanGxdaCjm7y4zpHjZUoCRSTtipui_xo2n-Taq6-CpgJLwKKG4ZFHRYYEGr0n6yHSIn7EoT2TFsznNFfZ7vffXv8UuKIPSpVWe7GAGpB7ZBA"
    }
  ];

  return (
    <>
      {/* Desktop Hero */}
      <section className="hidden md:block relative h-[95vh] min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${images[0].img}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        <div className="relative h-full flex flex-col justify-center items-center px-6 text-center text-white">
          <p className="text-[12px] font-semibold uppercase mb-6 tracking-[0.3em]">{images[0].subtitle}</p>
          <h1 className="font-display text-[88px] mb-12 max-w-4xl leading-none uppercase">The Architecture <br/> of Silence</h1>
          <div className="flex gap-6">
            <button className="bg-white text-black font-bold text-[12px] px-14 py-5 uppercase hover:bg-black hover:text-white transition-all">Shop Collection</button>
            <button className="bg-transparent border border-white/40 text-white font-bold text-[12px] px-14 py-5 uppercase backdrop-blur-sm hover:bg-white/10 transition-all">Read Narrative</button>
          </div>
        </div>
      </section>

      {/* Mobile Hero Carousel */}
      <section className="md:hidden mt-4 animate-fade-in">
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-3 px-5">
          {images.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-[90%] snap-center relative aspect-[1.2/1] rounded-xl overflow-hidden bg-gray-200 tap-scale">
              <img className="absolute inset-0 w-full h-full object-cover grayscale brightness-90" src={item.img} alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-white/80 text-[11px] font-bold tracking-[0.2em] mb-1 uppercase">{item.subtitle}</span>
                <h2 className="text-white font-bold text-[24px] leading-tight mb-4 uppercase tracking-tight">{item.title}</h2>
                <button className="bg-white text-black text-[13px] py-2.5 px-6 w-max rounded-full font-semibold uppercase">Discover</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};