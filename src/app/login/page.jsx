"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaArrowRight, FaStar } from "react-icons/fa";
import { MdEmail, MdLock, MdFlight, MdVerified } from "react-icons/md";

const REVIEWS = [
  { name: "রাহেলা বেগম", text: "কক্সবাজার ট্যুরটা অসাধারণ ছিল। সব কিছু পারফেক্ট!", avatar: "1" },
  { name: "তানভীর আহমেদ", text: "সুন্দরবন ট্যুরে গিয়ে বাঘ দেখলাম! স্বপ্নের মতো।", avatar: "2" },
  { name: "নাফিসা ইসলাম", text: "বান্দরবানের নীলগিরিতে মেঘের মধ্যে ঘুম — অবিশ্বাস্য।", avatar: "3" },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Left Panel — Travel Visual ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        <img
          src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80"
          alt="Bangladesh Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/60 to-emerald-950/80" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <MdFlight className="text-2xl text-emerald-400 rotate-45" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-black text-white tracking-tighter">MK Travel</p>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400">Agency</p>
            </div>
          </Link>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-xs font-black text-emerald-400 uppercase tracking-widest mb-8 w-fit">
              <MdVerified /> বাংলাদেশের #1 ট্রাভেল পার্টনার
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-[1.1] mb-6">
              প্রতিটি যাত্রা <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                একটি গল্প
              </span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              লগইন করুন এবং আপনার স্বপ্নের বাংলাদেশ ভ্রমণ পরিকল্পনা শুরু করুন।
            </p>
          </div>

          {/* Reviews */}
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="flex items-start gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <img
                  src={`https://i.pravatar.cc/80?u=${r.avatar}`}
                  alt={r.name}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-black text-sm">{r.name}</p>
                    <div className="flex text-amber-400 text-[10px]">
                      {[1,2,3,4,5].map(i => <FaStar key={i} />)}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <MdFlight className="text-xl text-emerald-400 rotate-45" />
            </div>
            <span className="text-lg font-black text-white tracking-tighter">MK Travel</span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              স্বাগতম ফিরে
            </h1>
            <p className="text-slate-400 font-medium">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/register" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                রেজিস্ট্রেশন করুন
              </Link>
            </p>
          </div>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-slate-600 rounded-2xl text-white font-bold text-sm transition-all duration-300 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google দিয়ে লগইন করুন
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs font-black uppercase tracking-widest">অথবা</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                ইমেইল
              </label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="your@email.com" required
                  className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
                  className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 mt-2"
            >
              {loading
                ? <span className="loading loading-spinner loading-sm" />
                : <> লগইন করুন <FaArrowRight /> </>
              }
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
