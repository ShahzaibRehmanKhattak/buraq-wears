import Link from "next/link";
import React from "react";

const Breadcrumb = ({ title, pages }) => {
  return (
    <div className="w-full bg-white font-poppins">
      <div className="border-b border-neutral-200">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-bold text-neutral-950 text-xl sm:text-2xl xl:text-[28px] tracking-tight">
              {title}
            </h1>

            <ul className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <li className="hover:text-neutral-900 transition-colors">
                <Link href="/">Home</Link>
              </li>
              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li className="flex items-center gap-1.5 capitalize" key={key}>
                    <span className="text-neutral-300">/</span>
                    <span className={key === pages.length - 1 ? "text-[#3B51E3] font-semibold" : "hover:text-neutral-900 transition-colors"}>
                      {page.replace("/", "").trim()}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;