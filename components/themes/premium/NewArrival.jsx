"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// 1. Completely internal dummy data array
const DUMMY_PRODUCTS = [
  {
    id: 1,
    title: "Premium Kids Cotton Sweatshirt",
    price: 45,
    oldPrice: 60,
    rating: 5,
    img: "/images/products/product-01.png", 
    badge: "New",
  },
  {
    id: 2,
    title: "Classic Minimalist Crewneck Set",
    price: 35,
    rating: 4,
    img: "/images/products/product-02.png",
    badge: "Sale",
  },
  {
    id: 3,
    title: "Cozy Fleece Hooded Jacket",
    price: 55,
    oldPrice: 70,
    rating: 5,
    img: "/images/products/product-03.png",
  },
  {
    id: 4,
    title: "Urban Everyday Knit Joggers",
    price: 40,
    rating: 4,
    img: "/images/products/product-04.png",
  },
];

export default function NewArrival() {
  return (
    <section className="overflow-hidden pt-15 pb-12 bg-white font-sans antialiased">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        
        {/* <!-- section title --> */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              This Week’s
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>

        {/* Your exact layout grid setup with responsive steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {DUMMY_PRODUCTS.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Product Thumbnail Shell Frame */}
              <div className="relative w-full aspect-square bg-[#F5F6FA] rounded-lg flex items-center justify-center p-6 mb-4 overflow-hidden">
                {item.badge && (
                  <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white select-none shadow-sm ${
                    item.badge === 'Sale' ? 'bg-[#EF4444]' : 'bg-[#3C50E0]'
                  }`}>
                    {item.badge}
                  </span>
                )}
                
                <Image
                  src={item.img}
                  alt={item.title}
                  width={150}
                  height={150}
                  className="object-contain max-w-[85%] max-h-[85%] transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
                />
              </div>

              {/* Product Info Description Block */}
              <div className="flex flex-col flex-grow text-left">
                <h3 className="font-semibold text-sm tracking-normal text-[#1D2746] mb-2 min-h-[40px] line-clamp-2 leading-snug">
                  <span className="hover:text-[#3C50E0] transition-colors duration-150 cursor-pointer">
                    {item.title}
                  </span>
                </h3>

                {/* Rating Matrix Layer */}
                <div className="flex items-center gap-1 mb-3 select-none">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < item.rating ? "text-amber-400 fill-current" : "text-gray-200 fill-current"
                      }`}
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Pricing Labels alignment row */}
                <div className="flex items-baseline gap-2.5 mt-auto pt-1">
                  <span className="font-bold text-lg text-[#111827]">
                    ${item.price}
                  </span>
                  {item.oldPrice && (
                    <span className="font-medium text-xs text-gray-400 line-through">
                      ${item.oldPrice}
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}