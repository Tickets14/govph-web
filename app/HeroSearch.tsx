"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/services?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-white/20 focus-within:ring-2 focus-within:ring-gold/50 transition-all">
        <Search className="w-5 h-5 text-gray-400 ml-5 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Maghanap ng serbisyo... (passport, NBI, LTO...)"
          className="flex-1 px-4 py-4 text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none text-sm sm:text-base"
        />
        <button
          type="submit"
          className="m-2 bg-navy text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#243561] transition-colors shrink-0"
        >
          Hanapin
        </button>
      </div>
    </form>
  );
}
