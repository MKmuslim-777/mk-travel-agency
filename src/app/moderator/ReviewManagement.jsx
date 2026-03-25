"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { FaStar } from "react-icons/fa";

export default function ReviewManagement({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(null);

  async function togglePublish(id, published) {
    setLoading(id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published }),
      });
      if (!res.ok) throw new Error();
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, published } : r))
      );
      toast.success(published ? "Review published" : "Review unpublished");
    } catch {
      toast.error("Failed to update review");
    } finally {
      setLoading(null);
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-[2rem]">
        <p className="text-4xl mb-4">💬</p>
        <p className="text-slate-400 font-bold">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r._id} className="bg-slate-900/80 border border-slate-800 rounded-[1.5rem] p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-black text-white text-sm">{r.userName}</p>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: r.rating || 5 }).map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-xs" />
                ))}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                r.published
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`}>
                {r.published ? "published" : "pending"}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{r.comment}</p>
            <p className="text-xs text-slate-600 mt-1">
              {new Date(r.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {r.published ? (
              <button
                disabled={loading === r._id}
                onClick={() => togglePublish(r._id, false)}
                className="flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all disabled:opacity-50"
              >
                <MdCancel size={16} /> Unpublish
              </button>
            ) : (
              <button
                disabled={loading === r._id}
                onClick={() => togglePublish(r._id, true)}
                className="flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
              >
                <MdCheckCircle size={16} /> Publish
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
