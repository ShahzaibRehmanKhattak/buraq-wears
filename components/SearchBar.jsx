'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = "SEARCH ARCHIVES...", className = "" }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch(""); // Reset parent filtering immediately
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full md:w-[320px] group ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full h-10 pl-3 pr-10 
          text-[10px] font-bold tracking-widest uppercase 
          bg-white border border-neutral-200 
          focus:border-neutral-900 outline-none 
          transition-all duration-200 placeholder-neutral-400
        "
      />
      
      {/* Dynamic Interaction Action Buttons: Clear vs Submit Search */}
      {query ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 p-1"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      ) : null}

      <button 
        type="submit" 
        className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-neutral-400 hover:text-neutral-900 active:scale-90 transition-all"
      >
        <Search size={14} strokeWidth={2.5} />
      </button>
    </form>
  );
};