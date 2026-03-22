"use client";
// error.js must be a Client Component
import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

export default function Error({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] mb-8">
          <MdErrorOutline className="text-5xl text-rose-400" />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
          কিছু একটা ভুল হয়েছে
        </h1>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
          একটি অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করুন অথবা হোমে ফিরে যান।
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => unstable_retry()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            আবার চেষ্টা করুন
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-white font-black rounded-2xl transition-all duration-300"
          >
            হোমে ফিরুন
          </a>
        </div>
      </div>
    </div>
  );
}
