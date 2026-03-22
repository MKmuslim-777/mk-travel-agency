"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { MdPeople, MdCalendarToday, MdPhone, MdNotes } from "react-icons/md";

export default function BookingForm({ packageId, pricePerPerson }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ travelers: 1, travelDate: "", phone: "", specialRequests: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const total = pricePerPerson * Number(form.travelers);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId, ...form, travelers: Number(form.travelers) }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "বুকিং ব্যর্থ হয়েছে"); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <FaCheckCircle className="text-4xl text-emerald-400" />
        </div>
        <p className="text-2xl font-black text-white tracking-tighter">Booking Confirmed!</p>
        <p className="text-slate-400 font-bold text-sm mt-2">আমরা শীঘ্রই যোগাযোগ করব।</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl transition-all"
        >
          View Bookings
        </button>
      </div>
    );
  }

  const fields = [
    { name: "travelers", label: "যাত্রী সংখ্যা", type: "number", placeholder: "1", Icon: MdPeople, extra: { min: 1, max: 20 } },
    { name: "travelDate", label: "ভ্রমণের তারিখ", type: "date", placeholder: "", Icon: MdCalendarToday, extra: { min: new Date().toISOString().split("T")[0] } },
    { name: "phone", label: "মোবাইল নম্বর", type: "tel", placeholder: "০১৭০০-০০০০০০", Icon: MdPhone, extra: {} },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(({ name, label, type, placeholder, Icon, extra }) => (
        <div key={name}>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
          <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
            <input
              type={type} name={name} value={form[name]} onChange={handleChange}
              placeholder={placeholder} {...extra}
              className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors"
              required={name !== "phone"}
            />
          </div>
        </div>
      ))}

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">বিশেষ অনুরোধ</label>
        <div className="relative">
          <MdNotes className="absolute left-4 top-4 text-slate-500 text-xl" />
          <textarea
            name="specialRequests" value={form.specialRequests} onChange={handleChange}
            placeholder="কোনো বিশেষ চাহিদা..."
            className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Total */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">মোট মূল্য</p>
          <p className="text-3xl font-black text-emerald-400">৳{total.toLocaleString()}</p>
        </div>
        <p className="text-xs text-slate-500 font-bold">৳{pricePerPerson.toLocaleString()} × {form.travelers}</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-2xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-0.5"
      >
        {loading ? <span className="loading loading-spinner loading-sm" /> : <>{session ? "Book Now" : "Login to Book"} <FaArrowRight /></>}
      </button>
    </form>
  );
}
