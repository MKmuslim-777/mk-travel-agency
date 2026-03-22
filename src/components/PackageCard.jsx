import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaStar,
  FaBolt,
} from "react-icons/fa";
import { MdLandscape, MdFavoriteBorder } from "react-icons/md";

export default function PackageCard({ pkg }) {
  return (
    <div className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 hover:border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500 hover:-translate-y-2">
      {/* ── Image Container ── */}
      <div className="relative h-64 rounded-[2rem] overflow-hidden">
        {pkg.image ? (
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-200">
            <MdLandscape className="text-8xl opacity-40 animate-pulse" />
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm pointer-events-auto">
              {pkg.division || "Trending"}
            </span>
            {pkg.isFlashDeal && (
              <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 animate-bounce pointer-events-auto">
                <FaBolt /> Flash Deal
              </span>
            )}
          </div>
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-all duration-300 pointer-events-auto border border-white/30">
            <MdFavoriteBorder size={20} />
          </button>
        </div>

        {/* Rating Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10">
          <FaStar className="text-amber-400" />
          <span>4.9 (1.2k Reviews)</span>
        </div>
      </div>

      {/* ── Content Body ── */}
      <div className="px-5 py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="font-black text-slate-900 text-xl leading-tight mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1 uppercase tracking-tight">
              {pkg.title}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[12px]">
                <FaMapMarkerAlt className="text-emerald-500" />
                <span className="truncate max-w-[120px]">
                  {pkg.destination}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[12px]">
                <FaClock className="text-emerald-500" />
                <span>{pkg.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
          {pkg.description ||
            "একটি অসাধারণ ভ্রমণের অভিজ্ঞতা পেতে আমাদের এই এক্সক্লুসিভ প্যাকেজটি বেছে নিন।"}
        </p>

        {/* ── Price & Action ── */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 group-hover:bg-emerald-50 transition-colors">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              Price Per Person
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                ৳{pkg.price?.toLocaleString()}
              </span>
              {pkg.oldPrice && (
                <span className="text-xs text-slate-400 line-through font-bold">
                  ৳{pkg.oldPrice}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/packages/${pkg._id}`}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-emerald-500 transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20"
          >
            <FaArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
