"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaStar } from "react-icons/fa";

export default function AdminPackageTable({ packages }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    if (!confirm("এই প্যাকেজটি মুছে ফেলবেন?")) return;
    setDeleting(id);
    await fetch(`/api/packages/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-700 rounded-[2rem]">
        <p className="text-slate-500 font-black text-sm uppercase tracking-widest">No packages yet</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {["Package", "Destination", "Category", "Price", "Rating", "Featured", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                      <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-black text-white text-sm max-w-36 truncate">{pkg.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-bold text-sm">{pkg.destination}</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full capitalize">
                    {pkg.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-black text-emerald-400">৳{pkg.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-amber-400 font-black text-sm">
                    <FaStar className="text-xs" /> {pkg.rating}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {pkg.featured
                    ? <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black px-3 py-1 rounded-full">Yes</span>
                    : <span className="bg-slate-800 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full">No</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(pkg._id)} disabled={deleting === pkg._id}
                    className="w-9 h-9 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center transition-all"
                  >
                    {deleting === pkg._id
                      ? <span className="loading loading-spinner loading-xs" />
                      : <FaTrash className="text-xs" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
