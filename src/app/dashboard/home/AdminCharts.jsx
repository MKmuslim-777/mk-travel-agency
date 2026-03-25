"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const PERIODS = [
  { label: "24h",  value: "24h" },
  { label: "7d",   value: "7d" },
  { label: "28d",  value: "28d" },
  { label: "1yr",  value: "1yr" },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-slate-400 text-xs font-bold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-white font-black text-sm">
          {p.name === "revenue" ? `৳${p.value?.toLocaleString()}` : p.value}
          <span className="text-slate-500 font-bold text-xs ml-1">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

export default function AdminCharts({ bookings, userName, userImage, role }) {
  const [period, setPeriod] = useState("7d");
  const router = useRouter();

  // Build chart data from bookings based on selected period
  function buildData() {
    const now = new Date();
    let slots = [];

    if (period === "24h") {
      slots = Array.from({ length: 24 }, (_, i) => {
        const h = new Date(now);
        h.setHours(now.getHours() - 23 + i, 0, 0, 0);
        return { label: `${h.getHours()}:00`, from: h, to: new Date(h.getTime() + 3600000) };
      });
    } else if (period === "7d") {
      slots = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - 6 + i);
        d.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        return { label: d.toLocaleDateString("en-BD", { weekday: "short" }), from: d, to: end };
      });
    } else if (period === "28d") {
      slots = Array.from({ length: 4 }, (_, i) => {
        const from = new Date(now);
        from.setDate(now.getDate() - 27 + i * 7);
        from.setHours(0, 0, 0, 0);
        const to = new Date(from); to.setDate(from.getDate() + 6); to.setHours(23, 59, 59, 999);
        return { label: `W${i + 1}`, from, to };
      });
    } else {
      slots = Array.from({ length: 12 }, (_, i) => {
        const from = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const to   = new Date(now.getFullYear(), now.getMonth() - 11 + i + 1, 0, 23, 59, 59);
        return { label: from.toLocaleDateString("en-BD", { month: "short" }), from, to };
      });
    }

    return slots.map(({ label, from, to }) => {
      const inRange = bookings.filter((b) => {
        const d = new Date(b.createdAt);
        return d >= from && d <= to;
      });
      return {
        label,
        bookings: inRange.length,
        revenue:  inRange.reduce((s, b) => s + (b.totalPrice || 0), 0),
      };
    });
  }

  const data = buildData();

  return (
    <div className="space-y-6">
      {/* User card + period selector row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Clickable user card */}
        <button
          onClick={() => router.push("/dashboard/profile")}
          className="flex items-center gap-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-base overflow-hidden shrink-0">
            {userImage
              ? <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              : userName?.charAt(0)?.toUpperCase()
            }
          </div>
          <div className="text-left">
            <p className="text-white font-black text-sm leading-tight group-hover:text-emerald-400 transition-colors">{userName}</p>
            <p className="text-slate-500 text-xs font-bold capitalize">{role}</p>
          </div>
        </button>

        {/* Period tabs */}
        <div className="flex gap-1.5 bg-slate-800/60 border border-slate-700 rounded-2xl p-1">
          {PERIODS.map((p) => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                period === p.value ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bookings chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Bookings</p>
          <p className="text-2xl font-black text-white mb-4">
            {data.reduce((s, d) => s + d.bookings, 0)}
            <span className="text-slate-500 text-sm font-bold ml-2">total</span>
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} fill="url(#bookGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Revenue</p>
          <p className="text-2xl font-black text-white mb-4">
            ৳{data.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
