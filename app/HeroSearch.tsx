'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/services?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative" aria-label="Search for government services">
      <div className="flex items-center bg-white rounded-2xl overflow-hidden border border-white/20 focus-within:ring-[3px] focus-within:ring-gold/50 focus-within:border-gold/50 transition-all duration-200 shadow-2xl shadow-black/20">
        <Search className="w-4 h-4 text-gray-400 ml-5 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a service... (passport, NBI, LTO...)"
          className="flex-1 px-4 py-[18px] text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none text-base"
        />
        <button
          type="submit"
          className="m-2 bg-gradient-to-r from-navy to-navy-light text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:from-navy-light hover:to-navy active:scale-95 transition-all duration-200 shrink-0 shadow-lg shadow-navy/30"
        >
          Search
        </button>
      </div>
    </form>
  );
}
