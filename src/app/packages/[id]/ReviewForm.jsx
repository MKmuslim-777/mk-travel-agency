"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ReviewForm({ packageId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating]   = useState(5);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!session) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 text-center">
        <p className="text-slate-400 font-bold mb-3">রিভিউ দিতে লগইন করুন।</p>
        <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl text-sm transition-all">
          Login করুন
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-slate-900/80 border border-emerald-500/20 rounded-[2rem] p-6 text-center">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-emerald-400 font-black">রিভিউ জমা হয়েছে!</p>
        <p className="text-slate-500 text-sm font-bold mt-1">Moderator অনুমোদনের পর প্রকাশিত হবে।</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
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
      toast.success("রিভিউ জমা হয়েছে!");
      setSubmitted(true);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-4">
      <h3 className="text-lg font-black text-white">আপনার রিভিউ দিন</h3>

      {/* Star rating */}
      <div className="flex items-center gap-2">
        {[1,2,3,4,5].map((star) => (
          <button key={star} type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-transform hover:scale-110">
            <FaStar className={star <= (hover || rating) ? "text-amber-400" : "text-slate-700"} />
          </button>
        ))}
        <span className="text-slate-400 font-bold text-sm ml-1">{rating}/5</span>
      </div>

      <textarea value={comment} onChange={(e) => setComment(e.target.value)}
        placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
        rows={3}
        className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        required />

      <button type="submit" disabled={loading}
        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black rounded-2xl transition-all text-sm">
        {loading ? <span className="loading loading-spinner loading-sm" /> : "Submit Review"}
      </button>
    </form>
  );
}
