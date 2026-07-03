import React from "react";
import Image from "next/image";
import Link from "next/link";
import {getTheme} from "@/components/themes";
const BANNER_DATA = {
  featured: {
    tag: "Apple iPhone 14 Plus",
    title: "UP TO 30% OFF",
    description: "iPhone 14 has the same superspeedy chip that’s in iPhone 13 Pro, A15 Bionic, with a 5‑core GPU, powers all the latest features.",
    link: "#",
    btnText: "Buy Now",
    bgClass: "bg-[#F5F5F7]",
    btnClass: "bg-[#3B57DE] hover:bg-[#2A44B8]",
    titleClass: "text-[#0F2942]",
    imgSrc: "/images/promo/promo-01.png",
    imgWidth: 274,
    imgHeight: 350,
  },
  cards: [
    {
      id: 1,
      tag: "Foldable Motorised Treadmill",
      title: "Workout At Home",
      subText: "Flat 20% off",
      subTextClass: "font-semibold text-[15px] text-[#00A896] mt-1",
      link: "#",
      btnText: "Grab Now",
      bgClass: "bg-[#E0F2F1]",
      btnClass: "bg-[#00A896] hover:bg-[#008F80]",
      titleClass: "text-[#0F2942]",
      imgSrc: "/images/promo/promo-02.png",
      imgWidth: 241,
      imgHeight: 241,
      layoutRight: true,
    },
    {
      id: 2,
      tag: "Apple Watch Ultra",
      title: (
        <>
          Up to <span className="text-[#F27A35]">40%</span> off
        </>
      ),
      description: "The aerospace-grade titanium case strikes the perfect balance of everything.",
      link: "#",
      btnText: "Buy Now",
      bgClass: "bg-[#FDF0E6]",
      btnClass: "bg-[#F27A35] hover:bg-[#D96521]",
      titleClass: "text-[#0F2942]",
      imgSrc: "/images/promo/promo-03.png",
      imgWidth: 200,
      imgHeight: 200,
      layoutRight: false,
    },
  ],
};

const PromoBanner = () => {
  const { featured, cards } = BANNER_DATA;
  const Theme = getTheme("premium"); // Dynamically switch between "default" and "luxury" themes based on user preference or context
  return (
    <section className="font-poppins overflow-hidden py-16 bg-white">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ==========================================================================
            1. HERO FEATURED BANNER (BIG)
            ========================================================================== */}
        <div className={`relative z-1 overflow-hidden rounded-xl ${featured.bgClass} min-h-[350px] flex items-center justify-between px-6 sm:px-12 lg:px-16 py-10 mb-6`}>
          <div className="max-w-[480px] w-full z-10 py-4">
            <span className="block font-medium text-[15px] sm:text-base text-gray-500 mb-2">
              {featured.tag}
            </span>
            <h2 className={`font-bold text-2xl sm:text-3xl lg:text-4xl ${featured.titleClass} tracking-tight mb-4`}>
              {featured.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {featured.description}
            </p>
            <a
              href={featured.link}
              className={`inline-flex items-center justify-center font-medium text-sm text-white ${featured.btnClass} py-2.5 px-8 rounded-md transition-colors duration-200`}
            >
              {featured.btnText}
            </a>
          </div>

          {/* Absolute layout with structural parameters to prevent squeezing */}
          <div className="absolute bottom-0 right-4 lg:right-16 top-0 w-[45%] hidden md:flex items-end justify-end pointer-events-none">
            <div className="relative w-[274px] h-[350px]">
              <Image
                src={featured.imgSrc}
                alt="Featured promo asset"
                className="object-contain object-bottom select-none"
                fill
                sizes="274px"
                priority
              />
            </div>
          </div>
        </div>

        {/* ==========================================================================
            2. TWO-COLUMN SPLIT GRID (SMALL)
            ========================================================================== */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative z-1 overflow-hidden rounded-xl ${card.bgClass} min-h-[250px] flex items-center px-6 sm:px-10 py-8`}
            >
              {/* Dynamic image container configured to prevent shrinking/distortion */}
              <div 
                className={`absolute bottom-0 top-0 hidden sm:flex items-center justify-center pointer-events-none ${
                  card.layoutRight ? "left-6 lg:left-10" : "right-6 lg:right-10"
                }`}
                style={{ width: `${card.imgWidth}   px` }}
              >
                <div className="relative" style={{ width: `${card.imgWidth}px`, height: `${card.imgHeight}px` }}>
                  <Image
                    src={card.imgSrc}
                    alt="Promo item"
                    className="object-contain select-none"
                    fill
                    sizes={`${card.imgWidth}px`}
                  />
                </div>
              </div>

              {/* Text content layout block */}
              <div className={`w-full flex flex-col z-10 ${
                card.layoutRight 
                  ? "items-end text-right ml-auto sm:max-w-[240px] md:max-w-[220px] lg:max-w-[260px]" 
                  : "items-start text-left mr-auto sm:max-w-[240px] md:max-w-[220px] lg:max-w-[260px]"
              }`}>
                <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  {card.tag}
                </span>
                <h2 className={`font-bold text-xl lg:text-2xl ${card.titleClass} tracking-tight mb-1`}>
                  {card.title}
                </h2>
                
                {card.subText && (
                  <p className={card.subTextClass}>{card.subText}</p>
                )}
                {card.description && (
                  <p className="text-gray-500 text-xs leading-relaxed mt-2">
                    {card.description}
                  </p>
                )}

                <a
                  href={card.link}
                  className={`inline-flex items-center justify-center font-medium text-xs sm:text-sm text-white ${card.btnClass} py-2.5 px-6 rounded-md transition-colors duration-200 mt-5`}
                >
                  {card.btnText}
                </a>
              </div>
            </div>
          ))}
        </div>
   
      </div>
      <Theme.BestSeller />
    </section>
  );
};

export default PromoBanner;