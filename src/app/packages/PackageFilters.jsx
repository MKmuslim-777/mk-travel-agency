"use client";

import { useRouter, useSearchParams } from "next/navigation";

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

  function handleFilter(value) {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set("category", value) : params.delete("category");
    router.push(`/packages?${params.toString()}`);
  }

  return (
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
  );
}
