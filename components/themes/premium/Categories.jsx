"use client";

import React, { useCallback, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper Core Styles
import "swiper/css";

// Category Data Array mapped from your assets configuration
const CATEGORY_DATA = [
  { id: 1, title: "Televisions", img: "/images/categories/categories-01.png", href: "#" },
  { id: 2, title: "Laptop & PC", img: "/images/categories/categories-02.png", href: "#" },
  { id: 3, title: "Mobile & Tablets", img: "/images/categories/categories-03.png", href: "#" },
  { id: 4, title: "Games & Videos", img: "/images/categories/categories-04.png", href: "#" },
  { id: 5, title: "Home Appliances", img: "/images/categories/categories-05.png", href: "#" },
  { id: 6, title: "Health & Sports", img: "/images/categories/categories-06.png", href: "#" },
];

export default function BrowseCategories() {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (sliderRef.current && sliderRef.current.swiper) {
      sliderRef.current.swiper.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (sliderRef.current && sliderRef.current.swiper) {
      sliderRef.current.swiper.slideNext();
    }
  }, []);

  return (
    <section className="overflow-hidden pt-12 pb-8 bg-white font-sans antialiased">
      {/* Outer wrapper setup using your low-whitespace max-width configuration */}
      <div className="max-w-[1280px] w-full mx-auto px-2 sm:px-4 pb-10 border-b border-gray-100">
        
        {/* ================= HEADER CONTROLS AREA ================= */}
        <div className="mb-10 flex items-end justify-between">
          <div className="flex flex-col">
            {/* Top Badge Icon Tag */}
            <span className="flex items-center gap-2.5 font-semibold text-xs tracking-wider uppercase text-[#3C50E0] mb-2 select-none">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="stroke-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.94024 13.4474C2.6523 12.1595 2.00832 11.5155 1.7687 10.68C1.52908 9.84449 1.73387 8.9571 2.14343 7.18231L2.37962 6.15883C2.72419 4.66569 2.89648 3.91912 3.40771 3.40789C3.91894 2.89666 4.66551 2.72437 6.15865 2.3798L7.18213 2.14361C8.95692 1.73405 9.84431 1.52927 10.6798 1.76889C11.5153 2.00851 12.1593 2.65248 13.4472 3.94042L14.9719 5.46512C17.2128 7.70594 18.3332 8.82635 18.3332 10.2186C18.3332 11.6109 17.2128 12.7313 14.9719 14.9721C12.7311 17.2129 11.6107 18.3334 10.2184 18.3334C8.82617 18.3334 7.70576 17.2129 5.46494 14.9721L3.94024 13.4474Z"
                  strokeWidth="1.5"
                />
                <circle
                  cx="7.17245"
                  cy="7.39917"
                  r="1.66667"
                  transform="rotate(-45 7.17245 7.39917)"
                  strokeWidth="1.5"
                />
                <path
                  d="M9.61837 15.4164L15.4342 9.6004"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Categories
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight text-[#111827]">
              Browse by Category
            </h2>
          </div>

          {/* Navigation Slider Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous Category"
              className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm text-gray-600 hover:text-black"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Category"
              className="w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm text-gray-600 hover:text-black"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ================= CAROUSEL SWIPER TRACK SECTION ================= */}
        <Swiper
          ref={sliderRef}
          spaceBetween={20}
          slidesPerView={6}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1200: { slidesPerView: 6, spaceBetween: 24 },
          }}
          className="w-full"
        >
          {CATEGORY_DATA.map((item) => (
            <SwiperSlide key={item.id}>
              <a href={item.href} className="group flex flex-col items-center w-full text-center">
                
                {/* Circular Category Frame Layout Block */}
                <div className="w-[130px] h-[130px] bg-[#F2F3F8] rounded-full flex items-center justify-center mb-4 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-inner relative overflow-hidden">
                  <Image
                    src={item.img}
                    alt={`${item.title} Category Asset`}
                    width={82}
                    height={62}
                    className="object-contain max-w-[80%] max-h-[70%] drop-shadow-sm filter"
                  />
                </div>

                {/* Typography Heading Text Element */}
                <div className="flex justify-center w-full px-2">
                  <h3 className="inline-block font-semibold text-sm tracking-wide text-[#1d2746] bg-gradient-to-r from-[#3C50E0] to-[#3C50E0] bg-[length:0px_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px] group-hover:text-[#3C50E0]">
                    {item.title}
                  </h3>
                </div>

              </a>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}