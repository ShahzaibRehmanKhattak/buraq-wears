'use client';

import { useCallback, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Updated Testimonials Data with your local user image paths
const testimonialsData = [
  {
    id: 1,
    authorName: "Sarah Jenkins",
    authorRole: "Founder, Minimal Studio",
    authorImg: "/images/users/user-01.jpg",
    review: "The minimalist ready-to-wear essentials completely elevated our curated workspace wardrobe. Exceptional texture and timeless silhouettes."
  },
  {
    id: 2,
    authorName: "Haris Ahmed",
    authorRole: "Creative Director",
    authorImg: "/images/users/user-02.jpg",
    review: "Incredible attention to branding, tag design details, and manufacturing layouts. Clean aesthetics that look flawless on modern screens."
  },
  {
    id: 3,
    authorName: "Elena Rostova",
    authorRole: "E-commerce Lead",
    authorImg: "/images/users/user-03.jpg",
    review: "Fast loading elements and perfectly responsive component flows. A premium UI user feedback system layout that works beautifully."
  },
  {
    id: 4,
    authorName: "Zain Malik",
    authorRole: "Senior Developer",
    authorImg: "/images/users/user-04.jpg",
    review: "The dynamic search functionality and flawless layout persistence make this app incredibly user-friendly. Absolutely top-tier execution."
  }
];

// Inner Single Item Card Component
const SingleItem = ({ testimonial }) => {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-6 sm:p-7 m-1 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between min-h-[270px]">
      <div>
        {/* Star Ratings Row */}
        <div className="flex items-center gap-1 mb-4 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ))}
        </div>

        {/* Feedback Quote Text */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-6 font-normal">
          "{testimonial.review}"
        </p>
      </div>

      {/* Author Details Block Footer */}
      <div className="flex items-center gap-3 border-t border-neutral-50/80 pt-4 mt-auto">
        <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-neutral-100 relative bg-neutral-50">
          <Image
            src={testimonial.authorImg}
            alt={testimonial.authorName}
            className="object-cover"
            fill
            sizes="44px"
          />
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-sm text-neutral-900 tracking-tight">
            {testimonial.authorName}
          </h3>
          <p className="text-xs font-medium text-neutral-400 tracking-wide mt-0.5">
            {testimonial.authorRole}
          </p>
        </div>
      </div>
    </div>
  );
};

// Core Section Component Export
const Testimonials = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pb-16 bg-white font-poppins antialiased">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-6 xl:px-0">
        <div className="w-full">
          <div className="p-1">
            
            {/* Header / Title Row */}
            <div className="mb-10 flex items-end justify-between border-b border-neutral-100 pb-6">
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#3B51E3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B51E3] animate-pulse" />
                  Testimonials
                </span>
                <h2 className="font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                  User Feedbacks
                </h2>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev} 
                  className="w-10 h-10 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:text-white hover:bg-[#3B51E3] hover:border-[#3B51E3] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                  aria-label="Previous slide"
                >
                  <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z" />
                  </svg>
                </button>

                <button 
                  onClick={handleNext} 
                  className="w-10 h-10 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:text-white hover:bg-[#3B51E3] hover:border-[#3B51E3] flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                  aria-label="Next slide"
                >
                  <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ================= CAROUSEL VIEWPORT WITH 4-ITEM OPTIMIZATION ================= */}
            <Swiper
              ref={sliderRef}
              slidesPerView={3}
              spaceBetween={24}
              className="w-full !overflow-visible"
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 16,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 4, // Shows all 4 cleanly side-by-side on extra-large screens!
                  spaceBetween: 24,
                }
              }}
            >
              {testimonialsData.map((item, key) => (
                <SwiperSlide key={item.id || key} className="h-full">
                  <SingleItem testimonial={item} />
                </SwiperSlide>
              ))}
            </Swiper>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;