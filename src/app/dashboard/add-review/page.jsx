"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

export default function AddReviewPage() {
  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState("");
  const [rating, setRating]       = useState(5);
  const [comment, setComment]     = useState("");
  const [hover, setHover]         = useState(0);
  const [loading, setLoading]     = useState(false);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    // Load user's booked packages for the dropdown
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // deduplicate by packageId
          const seen = new Set();
          const unique = data.filter((b) => {
            if (seen.has(b.packageId)) return false;
            seen.add(b.packageId);
            return true;
          });
          setPackages(unique);
        }
      })
      .catch(() => {});

    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => setMyReviews(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!packageId) { toast.error("একটি প্যাকেজ বেছে নিন।"); return; }
    if (!comment.trim()) { toast.error("রিভিউ লিখুন।"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      toast.success("রিভিউ জমা হয়েছে! Moderator অনুমোদনের পর প্রকাশিত হবে।");
      setComment(""); setRating(5); setPackageId("");
      setMyReviews((prev) => [{ ...data, _id: data._id }, ...prev]);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors";
  const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2";

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Review</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">Add Review</h1>
        <p className="text-slate-500 font-bold mt-1 text-sm">আপনার ভ্রমণ অভিজ্ঞতা শেয়ার করুন।</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5 mb-8">
        <div>
          <label className={labelCls}>Package</label>
          <select value={packageId} onChange={(e) => setPackageId(e.target.value)} className={inputCls} required>
            <option value="" className="bg-slate-800">-- প্যাকেজ বেছে নিন --</option>
            {packages.map((b) => (
              <option key={b.packageId} value={b.packageId} className="bg-slate-800">
                {b.package?.title || b.packageId}
              </option>
            ))}
          </select>
        </div>

        {/* Star rating */}
        <div>
          <label className={labelCls}>Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star} type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="text-3xl transition-transform hover:scale-110"
              >
                <FaStar className={star <= (hover || rating) ? "text-amber-400" : "text-slate-700"} />
              </button>
            ))}
            <span className="text-slate-400 font-bold text-sm ml-2">{rating}/5</span>
          </div>
        </div>

        <div>
          <label className={labelCls}>Your Review</label>
          <textarea
            value={comment} onChange={(e) => setComment(e.target.value)}
            className={`${inputCls} resize-none`} rows={4}
            placeholder="আপনার অভিজ্ঞতা লিখুন..." required
          />
        </div>

        <button type="submit" disabled={loading}
          className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black rounded-2xl transition-all">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Submit Review"}
        </button>
      </form>

      {/* My past reviews */}
      {myReviews.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter mb-4">My Reviews</h2>
          <div className="space-y-3">
            {myReviews.map((r) => (
              <div key={r._id} className="bg-slate-900/80 border border-slate-800 rounded-[1.5rem] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <FaStar key={i} className="text-amber-400 text-xs" />
                    ))}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    r.published
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {r.published ? "published" : "pending approval"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
