"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const categories = [
  { value: "", label: "All" },
  { value: "beach", label: "🏖 Beach" },
  { value: "adventure", label: "🏔 Adventure" },
  { value: "cultural", label: "🏛 Cultural" },
  { value: "honeymoon", label: "💑 Honeymoon" },
  { value: "family", label: "👨‍👩‍👧 Family" },
];

export default function PackageFilters({ active }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      query ? params.set("q", query) : params.delete("q");
      router.push(`/packages?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  function handleFilter(value) {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set("category", value) : params.delete("category");
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      {/* Search box */}
      <div className="relative max-w-xl mx-auto">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="প্যাকেজ খুঁজুন... (কক্সবাজার, সুন্দরবন...)"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 text-white placeholder-slate-500 font-bold text-sm focus:outline-none focus:border-emerald-500/60 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleFilter(cat.value)}
            className={`px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-300 ${
              (active ?? "") === cat.value
                ? "bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] -translate-y-0.5"
                : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-emerald-500/50 hover:text-emerald-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
