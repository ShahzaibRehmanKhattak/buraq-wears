"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const CountDown = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Set a dynamic target date so your countdown stays alive and ticking
  const deadline = "December, 31, 2026";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    // If the deadline is passed, keep it locked at zero
    if (time <= 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } else {
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  useEffect(() => {
    // Run initially to clear out layout shifts immediately
    getTime();
    
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="overflow-hidden py-16 bg-white font-poppins antialiased">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 xl:px-0">
        <div className="relative overflow-hidden rounded-2xl bg-[#D0E9F3]/60 border border-neutral-200/20 p-6 sm:p-10 lg:p-12 xl:p-16 flex items-center">
          
          {/* ================= LEFT CONTENT WORKSPACE PANEL ================= */}
          <div className="max-w-[460px] w-full z-10">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#3B51E3] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B51E3] animate-pulse" />
              Don’t Miss!!
            </span>

            <h2 className="font-extrabold text-2xl lg:text-3xl text-neutral-900 tracking-tight mb-3">
              Enhance Your Music Experience
            </h2>

            <p className="text-neutral-600 text-sm font-normal leading-relaxed mb-8">
              The Havit H206d is a wired PC headphone designed for seamless listening performance.
            </p>

            {/* ================= CORE TIMER CONTROLLER BLOCKS ================= */}
            <div className="flex flex-wrap gap-4 sm:gap-5 mt-6">
              
              {/* Timer Block: Days */}
              <div className="flex flex-col items-center">
                <span className="min-w-[68px] h-14 font-extrabold text-xl lg:text-2xl text-neutral-900 rounded-xl flex items-center justify-center bg-white border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-4 mb-2">
                  {days < 10 ? "0" + days : days}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Days
                </span>
              </div>

              {/* Timer Block: Hours */}
              <div className="flex flex-col items-center">
                <span className="min-w-[68px] h-14 font-extrabold text-xl lg:text-2xl text-neutral-900 rounded-xl flex items-center justify-center bg-white border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-4 mb-2">
                  {hours < 10 ? "0" + hours : hours}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Hours
                </span>
              </div>

              {/* Timer Block: Minutes */}
              <div className="flex flex-col items-center">
                <span className="min-w-[68px] h-14 font-extrabold text-xl lg:text-2xl text-neutral-900 rounded-xl flex items-center justify-center bg-white border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-4 mb-2">
                  {minutes < 10 ? "0" + minutes : minutes}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Mins
                </span>
              </div>

              {/* Timer Block: Seconds */}
              <div className="flex flex-col items-center">
                <span className="min-w-[68px] h-14 font-extrabold text-xl lg:text-2xl text-[#3B51E3] rounded-xl flex items-center justify-center bg-white border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-4 mb-2 tabular-nums">
                  {seconds < 10 ? "0" + seconds : seconds}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Secs
                </span>
              </div>
              
            </div>

            {/* CTA Anchor Action Button */}
            <a
              href="#"
              className="inline-flex items-center justify-center h-11 px-8 rounded-xl bg-[#1b284f] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#3B51E3] transition-all duration-200 shadow-md active:scale-[0.98] mt-8 cursor-pointer"
            >
              Check it Out!
            </a>
          </div>

          {/* ================= RIGHT DECORATIVE BACKGROUND ASSETS ================= */}
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="bg shapes"
            className="hidden sm:block absolute right-0 bottom-0 pointer-events-none select-none z-0"
            width={737}
            height={482}
            priority
          />
          <Image
            src="/images/countdown/countdown-01.png"
            alt="product"
            className="hidden lg:block absolute right-4 xl:right-24 bottom-4 xl:bottom-8 z-10 object-contain max-h-[85%] transition-transform duration-500 hover:scale-[1.02]"
            width={411}
            height={376}
          />
        </div>
      </div>
    </section>
  );
};

export default CountDown;