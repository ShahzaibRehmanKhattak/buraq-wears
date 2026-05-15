import { ProductCard } from './ProductCard';
export const NewArrivals = () => (
  <section className="py-32 px-6 md:px-20 max-w-[1440px] mx-auto">
    <div className="flex justify-between items-baseline mb-16">
      <h2 className="text-[32px] md:text-[40px] font-bold uppercase tracking-tighter">New Arrivals</h2>
      <a href="#" className="text-[11px] font-bold uppercase tracking-widest border-b border-black/20 pb-1 hover:border-black transition-all">
        View Collection
      </a>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard 
        title="Structured Wool Overcoat" 
        price="$485.00" 
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAvOEfc39i_Ei4Vuvjmnz1BPC58Ft_6cLtRqiYvU6JYe5y30-CxO-Ta2fyVNiJc3oYsmcsrE45yLsPnLquCsGpDj70Ipcg2TXgAYk1Vh3tQ1mx6sqYuCpdjTXp1fsabvLFKOaqCWN5-0lxhqZUo5l_u3CTa9-FRdopBbKs8TbgHZMbFhqLuGd5xfMLyvz3E9thkEN6Wzxe_gLRfBNGLJPLR8igkCwFKcCLW5AAOu9RTUa8LnTwpmW9VF08glqyVI1c-a9e6B2Zp3g" 
      />
      <ProductCard 
        title="Essential Poplin Shirt" 
        price="$165.00" 
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDyeqXCwW2IqpR-OoqnwmBuixJfS2pJoRS0JI3yt_hBnDfDEZ0gqu5Z2H09Bjg_mv4wrjQgb_sJj86BD7ILmjEftvSviT_3g2JBSv9yAo5OhlKN_qJamFeXblr5nN-LS7Nr-Ehi4WEvFwaPENhw2HCHinoAgipXp43MPo60zJyW410_pLiZ4vCDEyE8zSeLm5xPGmfX83DJVXTvMV9bqovYzRTuy6zwYH4B_-jYTGWRfuB2qLxgE51beelXq2uDnR0H9TgR6t0W1g" 
      />
      <ProductCard 
        title="Slim-Fit Slate Trousers" 
        price="$220.00" 
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBf5aQI_LkR_tfjwb9F7Wn2qQjVQPLhFlAkCFaCzMzfjT4wiTrSZpilA7CY-N7ckP0Th5jw47SyQYPl7ETV328uAgo1vynf5360-sleJ2dQ0Kd1BMEDDpZm2V7qQlu99yTcJwC7C90k4F1JF43fZaQaSoseOQbfMfR5Ux05Lbz-iun_g9B5Tchp2fLlDaABcuZAcfdHO6f9s6H7V5bLx6h99qfOVMLBCvcEL9-9BJF245feaswbp3bMGCLTlgWHpRhOrAh7ThKfyg" 
      />
      <ProductCard 
        title="Pebbled Leather Tote" 
        price="$340.00" 
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuBQCdAB3qm4l5rqytSKoTtRZDn8-nWH26gE-zJL2VFm66x3ln_XoZVFKqkFB45yA5RWXdUmD2HJL2O_PUeHlJLUoCVGXQOINX6ugNmVOTazKEGcAfc9g3lFE6tqrXdo5wMaerxYVMKVg2tSjlXuWIyHlFVp2yYRJjQNwfEnHOQBfe49ijL9mGEakCbEosc2oO2VS_1A3bsRXiPBIB6ECY8syUsWqWUzOe28fct-OUagIl8biZ2MESLLxf07gVJ-hz_KoxCqrgM-jA" 
      />
    </div>
  </section>
);