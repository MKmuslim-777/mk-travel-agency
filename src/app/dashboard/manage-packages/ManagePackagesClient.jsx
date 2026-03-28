"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaStar, FaSearch, FaInfoCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import EditPackageModal from "@/app/admin/EditPackageModal";
import PackageStatsModal from "./PackageStatsModal";
import Link from "next/link";

const CATEGORIES = ["all", "beach", "adventure", "cultural", "honeymoon", "family"];

export default function ManagePackagesClient({ packages: initial }) {
  const router = useRouter();
  const [pkgs, setPkgs]         = useState(initial);
  const [editPkg, setEditPkg]     = useState(null);
  const [statsPkg, setStatsPkg]   = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => pkgs.filter((p) => {
    const q = search.toLowerCase();
    const matchQ = !q || p.title?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q);
    const matchC = category === "all" || p.category === category;
    return matchQ && matchC;
  }), [pkgs, search, category]);

  function handleDelete(pkg) {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-sm"><span className="font-black">"{pkg.title}"</span> মুছে ফেলবেন?</p>
        <p className="text-xs text-gray-500">এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>
        <div className="flex gap-2">
          <button onClick={async () => {
            toast.dismiss(t.id);
            setDeleting(pkg._id);
            const res = await fetch(`/api/packages/${pkg._id}`, { method: "DELETE" });
            setDeleting(null);
            if (res.ok) { setPkgs((p) => p.filter((x) => x._id !== pkg._id)); toast.success("মুছে ফেলা হয়েছে।"); }
            else toast.error("মুছতে ব্যর্থ।");
          }} className="flex-1 py-2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-black rounded-xl">হ্যাঁ, মুছুন</button>
          <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-slate-200 text-slate-700 text-xs font-black rounded-xl">বাতিল</button>
        </div>
      </div>
    ), { duration: 10000 });
  }

  return (
    <>
      {editPkg && <EditPackageModal pkg={editPkg} onClose={() => { setEditPkg(null); router.refresh(); }} />}
      {statsPkg && <PackageStatsModal pkg={statsPkg} onClose={() => setStatsPkg(null)} />}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or destination..."
            className="w-full bg-slate-900/80 border border-slate-800 text-white placeholder-slate-600 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900/80 border border-slate-800 text-white rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors capitalize">
          {CATEGORIES.map((c) => <option key={c} value={c} className="bg-slate-900 capitalize">{c === "all" ? "All Categories" : c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-700 rounded-[2rem]">
          <p className="text-slate-500 font-black text-sm uppercase tracking-widest">
            {pkgs.length === 0 ? "No packages yet" : "No results found"}
          </p>
          {pkgs.length === 0 && (
            <Link href="/dashboard/add-package" className="inline-block mt-4 px-6 py-3 bg-emerald-500 text-white font-black rounded-2xl text-sm">Add First Package</Link>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filtered.length} packages</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Package", "Destination", "Category", "Price", "Rating", "Featured", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((pkg) => (
                  <tr key={pkg._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black text-white text-sm max-w-[140px] truncate">{pkg.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-bold text-sm">{pkg.destination}</td>
                    <td className="px-5 py-4">
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full capitalize">{pkg.category}</span>
                    </td>
                    <td className="px-5 py-4 font-black text-emerald-400">৳{pkg.price?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-amber-400 font-black text-sm"><FaStar className="text-xs" /> {pkg.rating}</span>
                    </td>
                    <td className="px-5 py-4">
                      {pkg.featured
                        ? <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-full">Yes</span>
                        : <span className="bg-slate-800 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full">No</span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setStatsPkg(pkg)} className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center transition-all" title="Stats"><FaInfoCircle className="text-xs" /></button>
                        <button onClick={() => setEditPkg(pkg)} className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center transition-all"><FaEdit className="text-xs" /></button>
                        <button onClick={() => handleDelete(pkg)} disabled={deleting === pkg._id} className="w-9 h-9 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center transition-all">
                          {deleting === pkg._id ? <span className="loading loading-spinner loading-xs" /> : <FaTrash className="text-xs" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
