"use client";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { FaCalendarAlt, FaUsers, FaPhone, FaSearch } from "react-icons/fa";

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled"];

const statusStyle = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const payStyle = {
  paid:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  unpaid: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function BookingManagement({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading]   = useState(null);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filtered = useMemo(() => bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchQ = !q || b.userName?.toLowerCase().includes(q) || b.package?.title?.toLowerCase().includes(q) || b.userEmail?.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || b.status === statusFilter;
    const matchP = paymentFilter === "all" || (b.paymentStatus || "unpaid") === paymentFilter;
    return matchQ && matchS && matchP;
  }), [bookings, search, statusFilter, paymentFilter]);

  async function updateBooking(id, patch) {
    setLoading(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, ...patch } : b)));
      toast.success("Updated successfully");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or package..."
            className="w-full bg-slate-900/80 border border-slate-800 text-white placeholder-slate-600 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900/80 border border-slate-800 text-white rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors">
          <option value="all" className="bg-slate-900">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-slate-900 capitalize">{s}</option>)}
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-slate-900/80 border border-slate-800 text-white rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors">
          <option value="all"    className="bg-slate-900">All Payment</option>
          <option value="paid"   className="bg-slate-900">Paid</option>
          <option value="unpaid" className="bg-slate-900">Unpaid</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-[2rem]">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-slate-400 font-bold">{bookings.length === 0 ? "No bookings yet" : "No results found"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filtered.length} bookings</p>
          {filtered.map((b) => (
            <div key={b._id} className="bg-slate-900/80 border border-slate-800 rounded-[1.5rem] overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white truncate">{b.package?.title || "Unknown Package"}</p>
                  <p className="text-xs text-slate-500 font-bold">{b.userName} · {b.userEmail}</p>
                </div>
                <select value={b.status} disabled={loading === b._id}
                  onChange={(e) => updateBooking(b._id, { status: e.target.value })}
                  className={`text-xs font-black px-3 py-1.5 rounded-xl border bg-slate-950 cursor-pointer ${statusStyle[b.status]}`}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-slate-950 text-white">{s}</option>)}
                </select>
                <button disabled={loading === b._id}
                  onClick={() => updateBooking(b._id, { paymentStatus: b.paymentStatus === "paid" ? "unpaid" : "paid" })}
                  className={`text-xs font-black px-3 py-1.5 rounded-xl border transition-all ${payStyle[b.paymentStatus || "unpaid"]}`}>
                  {b.paymentStatus === "paid" ? "paid" : "unpaid"}
                </button>
                <span className="font-black text-emerald-400 text-sm">৳{b.totalPrice?.toLocaleString()}</span>
                <button onClick={() => setExpanded(expanded === b._id ? null : b._id)} className="text-slate-500 hover:text-white transition-colors">
                  {expanded === b._id ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                </button>
              </div>
              {expanded === b._id && (
                <div className="border-t border-slate-800 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-emerald-500" />
                    {new Date(b.travelDate).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5"><FaUsers className="text-emerald-500" />{b.travelers} Travelers</span>
                  <span className="flex items-center gap-1.5"><FaPhone className="text-emerald-500" />{b.phone || "N/A"}</span>
                  {b.specialRequests && <span className="col-span-2 md:col-span-4 text-slate-500 italic">"{b.specialRequests}"</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
