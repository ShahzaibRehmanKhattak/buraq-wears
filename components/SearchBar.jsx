// components/SearchBar.js
'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, className }) => {
  const [query, setQuery] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }} className={`relative ${className}`}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="SEARCH..."
        className="w-full h-10 pl-3 pr-10 text-[10px] font-bold uppercase border border-neutral-200 outline-none"
      />
      <button type="submit" className="absolute right-3 top-2.5"><Search size={14} /></button>
    </form>
  );
};