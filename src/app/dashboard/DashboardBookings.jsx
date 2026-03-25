"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

const statusStyle = {
  pending:   "bg-amber-500/10 border-amber-500/20 text-amber-400",
  confirmed: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  cancelled: "bg-rose-500/10 border-rose-500/20 text-rose-400",
};

export default function DashboardBookings({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [paying, setPaying] = useState(null);

  async function handlePay(bookingId) {
    setPaying(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, paymentStatus: "paid", status: "confirmed" }
            : b
        )
      );
      toast.success("Payment successful! 🎉");
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(null);
    }
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const coverImage =
          booking.package?.images?.[0] || booking.package?.image || null;
        const isPaid = booking.paymentStatus === "paid";

        return (
          <div
            key={booking._id}
            className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-5 hover:border-emerald-500/20 transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Cover image */}
              {coverImage && (
                <div className="w-full sm:w-32 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={coverImage}
                    alt={booking.package?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <h3 className="font-black text-white text-lg tracking-tight truncate">
                    {booking.package?.title || "Package"}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Booking status badge */}
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${statusStyle[booking.status]}`}>
                      {booking.status}
                    </span>

                    {/* Payment: user sees Pay btn or paid badge */}
                    {isPaid ? (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                        paid ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePay(booking._id)}
                        disabled={paying === booking._id}
                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-400 transition-all disabled:opacity-60"
                      >
                        {paying === booking._id ? "Processing..." : "Pay Now"}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 mb-3">
                  <FaMapMarkerAlt className="text-emerald-500 text-xs" />
                  {booking.package?.destination}
                </p>

                <div className="flex flex-wrap gap-5 text-xs text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-emerald-500" />
                    {new Date(booking.travelDate).toLocaleDateString("en-BD", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaUsers className="text-emerald-500" />
                    {booking.travelers} Travelers
                  </span>
                  <span className="font-black text-emerald-400 text-sm">
                    ৳{booking.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
