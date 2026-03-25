"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaClock, FaHeart, FaTrash } from "react-icons/fa";

export default function MyWishlistPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load wishlist"))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(packageId) {
    setRemoving(packageId);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.packageId !== packageId));
      toast.success("Wishlist থেকে সরানো হয়েছে।");
    } catch {
      toast.error("Failed to remove.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <span className="text-pink-400 font-black text-xs uppercase tracking-[0.3em]">Saved</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">My Wishlist</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="loading loading-spinner loading-lg text-emerald-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/50 border border-slate-800 rounded-[2.5rem]">
          <FaHeart className="text-5xl text-slate-700 mx-auto mb-4" />
          <p className="text-2xl font-black text-slate-400 tracking-tighter">Wishlist Empty</p>
          <p className="text-slate-600 font-bold mt-2 text-sm">পছন্দের প্যাকেজ সেভ করুন।</p>
          <Link href="/packages"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl transition-all">
            Browse Packages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const pkg = item.package;
            const cover = pkg?.images?.[0] || null;
            return (
              <div key={item._id} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden group hover:border-emerald-500/20 transition-all">
                <div className="relative h-44 overflow-hidden">
                  {cover
                    ? <img src={cover} alt={pkg?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600 text-4xl">🏖️</div>
                  }
                  <button
                    onClick={() => handleRemove(item.packageId)}
                    disabled={removing === item.packageId}
                    className="absolute top-3 right-3 w-9 h-9 bg-rose-500/90 hover:bg-rose-500 text-white rounded-xl flex items-center justify-center transition-all"
                  >
                    {removing === item.packageId
                      ? <span className="loading loading-spinner loading-xs" />
                      : <FaTrash className="text-xs" />
                    }
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white truncate mb-2">{pkg?.title || "Package"}</h3>
                  <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 mb-1">
                    <FaMapMarkerAlt className="text-emerald-500 text-xs" /> {pkg?.destination}
                  </p>
                  <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5 mb-4">
                    <FaClock className="text-emerald-500" /> {pkg?.duration}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-400">৳{pkg?.price?.toLocaleString()}</span>
                    <Link href={`/packages/${item.packageId}`}
                      className="text-xs font-black px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
