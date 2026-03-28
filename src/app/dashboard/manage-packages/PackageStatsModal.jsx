"use client";
import { useState, useEffect } from "react";
import { MdClose, MdBookmark } from "react-icons/md";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

const PERIODS = [
  { label: "Today",  value: "1d"  },
  { label: "7 Days", value: "7d"  },
  { label: "28 Days",value: "28d" },
  { label: "1 Year", value: "1yr" },
];

function buildChartData(bookings, period) {
  const now = new Date();
  let slots = [];

  if (period === "1d") {
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

export default function PackageStatsModal({ pkg, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [period, setPeriod]     = useState("7d");

  useEffect(() => {
    fetch(`/api/bookings?packageId=${pkg._id}`)
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pkg._id]);

  const data = buildChartData(bookings, period);
  const totalRevenue = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const confirmed    = bookings.filter((b) => b.status === "confirmed").length;
  const pending      = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] z-10 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-white truncate">{pkg.title}</h3>
              <p className="text-xs text-slate-500 font-bold">{pkg.destination}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 transition-colors shrink-0 ml-3">
            <MdClose size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="loading loading-spinner loading-lg text-emerald-400" />
            </div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Bookings", value: bookings.length,          color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
                  { label: "Confirmed",      value: confirmed,                color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                  { label: "Pending",        value: pending,                  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
                  { label: "Revenue",        value: `৳${totalRevenue.toLocaleString()}`, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
                ].map((s) => (
                  <div key={s.label} className={`border rounded-2xl p-4 ${s.bg}`}>
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Period selector */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-400">Booking Trend</p>
                <div className="flex gap-1.5 bg-slate-800/60 border border-slate-700 rounded-2xl p-1">
                  {PERIODS.map((p) => (
                    <button key={p.value} onClick={() => setPeriod(p.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        period === p.value ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"
                      }`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings chart */}
              <div className="bg-slate-800/40 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Bookings</p>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} fill="url(#bGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue chart */}
              <div className="bg-slate-800/40 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Revenue (৳)</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
