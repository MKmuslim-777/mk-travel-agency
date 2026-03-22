import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { MdFlight } from "react-icons/md";

export const metadata = {
  title: "404 — পেজ পাওয়া যায়নি",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] mb-8 shadow-2xl">
          <MdFlight className="text-5xl text-emerald-400 rotate-45" />
        </div>

        {/* 404 */}
        <div className="text-[8rem] md:text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-700 to-slate-900 select-none mb-4">
          404
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
          পেজটি পাওয়া যায়নি
        </h1>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
          আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন হয়েছে, অথবা কখনো ছিলই না।
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            হোমে ফিরুন
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/packages"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-white font-black rounded-2xl transition-all duration-300"
          >
            প্যাকেজ দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}
