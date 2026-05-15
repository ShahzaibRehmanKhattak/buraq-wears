export const CuratedCategories = () => (
  <section className="mt-40">
    <div className="flex justify-between items-end mb-12">
      <h3 className="font-headline-lg text-headline-lg">Curated Categories</h3>
      <a className="font-label-lg text-label-lg uppercase border-b border-outline" href="#">View All</a>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      {[
        { title: "Accessories", count: "128 Items", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn_WuGTplxg11BR_V6jhv-adaVfA0MqkkdlHS3M1QcZ2NpW1oDW6FoLQTHirIFwL3klQ5wkPM15Es4uT7tWshvA__ahs8aUijajWIa93_77AIkiBNQ0pa8SGmj8rsZZrMk6aq01A4hXvM3391YtOLHZwJO640bwNFtWkfxlpH8OdzqbkbpdsTuexSLbUpfWVflmb3GqNJvP24PP_F6dxVOu2XbtkX--lejzfVYOf0lSobP1y0B3Qp8YxqhtPaEOERfpUJKMeyCOQ" },
        { title: "New Arrivals", count: "42 Items", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj3S67TWsu4rQHKIGHD-Wxy1JQXnYoIwP9qIZNfGUv_eK_b2pByx6u5unuGM1GpB6GVCzVfszCXFgFmgHlW35pGb9kVbvQxuLRpW9ns4wu6GZOmugzVAz9ImQ8nlkHciGU5DrmvsKD68WEMWp0572ka0QJ24linfVA00M_54QvkgSxDxhAr8_A7ETw0lcj2ha_fN7Jq2PRuJ9wGTKoDk0QVvDz5MluRpAM_y2jd28H-Dft6AF3Wvn_KtOpFjDDYdZeASmKgKbBUQ" },
        { title: "Tailoring", count: "86 Items", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0Nz5ENJAlRBvU0KjnMZ7uQJmi7R29x6-kkK334vKEfj4fOQFRveHF1QIU18EbQJfsM4GK0cVmMqWubqsgEOj4__CxsqO6Ie_423yO6QplIBYxID0fATTDHtdG8O3qMkjbrK81tfloEz-8YPCyrHJ_k_-3b2fHZd6QfuXpuaZt3QsP2cu95IM_gU4ejJTB2dU79Zzzu_Tz3fRsJnETyJa0uk3mCMciJys6-APW9nYTk-a4YuO7oVp_AbSU6SBOl-_hzDfkEIOzAw" }
      ].map((cat, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="aspect-[3/4] bg-surface-container overflow-hidden mb-6">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={cat.img} alt={cat.title} />
          </div>
          <h4 className="font-headline-md text-headline-md mb-2">{cat.title}</h4>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{cat.count}</span>
        </div>
      ))}
    </div>
  </section>
);