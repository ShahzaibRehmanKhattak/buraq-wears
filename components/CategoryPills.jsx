
export const CategoryPills = () => (
  <section className="md:hidden mt-4 px-5 overflow-x-auto hide-scrollbar flex gap-2 animate-fade-in">
    <button className="px-6 py-2.5 bg-black text-white rounded-full text-[13px] whitespace-nowrap tap-scale font-medium flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">grid_view</span>
      <span>All Styles</span>
    </button>
    {['Tees', 'Shirts', 'Pants', 'Knitwear'].map((cat) => (
      <button key={cat} className="px-6 py-2.5 bg-[#e8e8e8] text-black rounded-full text-[13px] whitespace-nowrap tap-scale font-medium flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">
          {cat === 'Tees' ? 'apparel' : cat === 'Shirts' ? 'checkroom' : cat === 'Pants' ? 'straighten' : 'layers'}
        </span>
        <span>{cat}</span>
      </button>
    ))}
  </section>
);