"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson, MdFlight, MdVerified, MdBeachAccess, MdForest, MdLandscape } from "react-icons/md";

const DESTINATIONS = [
  { name: "কক্সবাজার", icon: <MdBeachAccess />, color: "from-cyan-600 to-blue-800" },
  { name: "সুন্দরবন",  icon: <MdForest />,      color: "from-emerald-700 to-green-900" },
  { name: "বান্দরবান", icon: <MdFlight className="rotate-45" />, color: "from-violet-700 to-purple-900" },
  { name: "সিলেট",     icon: <MdLandscape />,    color: "from-teal-600 to-emerald-800" },
  { name: "সেন্ট মার্টিন", icon: <MdBeachAccess />, color: "from-sky-600 to-indigo-800" },
  { name: "রাঙামাটি",  icon: <MdLandscape />,    color: "from-rose-700 to-pink-900" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Left Panel — Destinations Mosaic ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        {/* Mosaic grid background */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-3">
          {DESTINATIONS.map((d) => (
            <div key={d.name} className={`relative bg-gradient-to-br ${d.color} overflow-hidden`}>
              <div className="absolute inset-0 bg-slate-950/50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2">
                <span className="text-3xl opacity-60">{d.icon}</span>
                <span className="text-xs font-black tracking-widest opacity-60">{d.name}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/50 to-slate-950/80" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <MdFlight className="text-2xl text-emerald-400 rotate-45" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-black text-white tracking-tighter">MK Travel</p>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400">Agency</p>
            </div>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-xs font-black text-emerald-400 uppercase tracking-widest mb-8 w-fit">
              <MdVerified /> বিনামূল্যে যোগ দিন
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-[1.1] mb-6">
              ৬টি অসাধারণ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                গন্তব্য অপেক্ষা করছে
              </span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              রেজিস্ট্রেশন করুন এবং বাংলাদেশের সেরা ট্যুর প্যাকেজগুলো বুক করুন সহজেই।
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { num: "5,000+", label: "ট্রাভেলার" },
              { num: "50+",    label: "প্যাকেজ" },
              { num: "4.9★",   label: "রেটিং" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-xl font-black text-white">{s.num}</p>
                <p className="text-slate-400 text-xs font-bold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

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
              অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="text-slate-400 font-medium">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                লগইন করুন
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
            Google দিয়ে রেজিস্ট্রেশন
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs font-black uppercase tracking-widest">অথবা</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name",     label: "পূর্ণ নাম",  type: "text",     placeholder: "আপনার নাম",       Icon: MdPerson },
              { name: "email",    label: "ইমেইল",       type: "email",    placeholder: "your@email.com",  Icon: MdEmail  },
              { name: "password", label: "পাসওয়ার্ড",  type: "password", placeholder: "কমপক্ষে ৬ অক্ষর", Icon: MdLock   },
            ].map(({ name, label, type, placeholder, Icon }) => (
              <div key={name}>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                  <input
                    type={type} name={name} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} required
                    minLength={name === "password" ? 6 : undefined}
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>
            ))}

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
                : <> অ্যাকাউন্ট তৈরি করুন <FaArrowRight /> </>
              }
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 font-medium mt-6">
            রেজিস্ট্রেশন করে আপনি আমাদের{" "}
            <span className="text-slate-500">Terms of Service</span> ও{" "}
            <span className="text-slate-500">Privacy Policy</span> মেনে নিচ্ছেন।
          </p>
        </div>
      </div>

    </div>
  );
}
