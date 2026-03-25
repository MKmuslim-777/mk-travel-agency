"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt, FaClock, FaArrowRight, FaStar, FaBolt,
} from "react-icons/fa";
import { MdLandscape, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import toast from "react-hot-toast";

export default function PackageCard({ pkg, wishlisted: initialWishlisted = false }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  async function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error("Wishlist এ যোগ করতে লগইন করুন।");
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setWishlisted(data.added ? true : false);
      toast.success(data.added ? "Wishlist এ যোগ হয়েছে! ❤️" : "Wishlist থেকে সরানো হয়েছে।");
    } catch {
      toast.error("Failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link
      href={`/packages/${pkg._id}`}
      className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 hover:border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500 hover:-translate-y-2 block"
    >
      {/* ── Image ── */}
      <div className="relative h-64 rounded-[2rem] overflow-hidden">
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-200">
            <MdLandscape className="text-8xl opacity-40" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
              {pkg.destination || "Trending"}
            </span>
            {pkg.isFlashDeal && (
              <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 animate-bounce">
                <FaBolt /> Flash Deal
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            disabled={loading}
            className={`w-10 h-10 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 border ${
              wishlisted
                ? "bg-rose-500 text-white border-rose-400"
                : "bg-white/20 text-white hover:bg-rose-500 hover:text-white border-white/30"
            }`}
          >
            {loading
              ? <span className="loading loading-spinner loading-xs" />
              : wishlisted
              ? <MdFavorite size={20} />
              : <MdFavoriteBorder size={20} />
            }
          </button>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10">
          <FaStar className="text-amber-400" />
          <span>{pkg.rating || "4.9"} Rating</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 py-6">
        <div className="mb-4">
          <h2 className="font-black text-slate-900 text-xl leading-tight mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1 uppercase tracking-tight">
            {pkg.title}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[12px]">
              <FaMapMarkerAlt className="text-emerald-500" />
              <span className="truncate max-w-[120px]">{pkg.destination}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[12px]">
              <FaClock className="text-emerald-500" />
              <span>{pkg.duration}</span>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
          {pkg.description || "একটি অসাধারণ ভ্রমণের অভিজ্ঞতা পেতে আমাদের এই এক্সক্লুসিভ প্যাকেজটি বেছে নিন।"}
        </p>

        {/* Price & Arrow */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 group-hover:bg-emerald-50 transition-colors">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price Per Person</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">৳{pkg.price?.toLocaleString()}</span>
              {pkg.oldPrice && (
                <span className="text-xs text-slate-400 line-through font-bold">৳{pkg.oldPrice}</span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white group-hover:bg-emerald-500 transition-all duration-300 shadow-xl shadow-slate-900/10">
            <FaArrowRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}
