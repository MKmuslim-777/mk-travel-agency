"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaArrowRight } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const empty = {
  title: "", description: "", destination: "", price: "",
  duration: "", image: "", category: "beach",
  rating: 4.5, featured: false, includes: "",
};

export default function AddPackageModal() {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Failed"); return; }
    setForm(empty);
    document.getElementById("add-pkg-modal").close();
    router.refresh();
  }

  const inputCls = "w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors";
  const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2";

  return (
    <>
      <button
        onClick={() => document.getElementById("add-pkg-modal").showModal()}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5"
      >
        <FaPlus className="text-xs" /> Add Package
      </button>

      <dialog id="add-pkg-modal" className="modal">
        <div className="modal-box max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-0 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
            <h3 className="text-xl font-black text-white tracking-tighter">Add New Package</h3>
            <button
              type="button"
              onClick={() => document.getElementById("add-pkg-modal").close()}
              className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 transition-colors"
            >
              <MdClose className="text-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Package Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Cox's Bazar Special" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Destination</label>
                <input name="destination" value={form.destination} onChange={handleChange} placeholder="কক্সবাজার" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Price (BDT)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="5000" className={inputCls} min={1} required />
              </div>
              <div>
                <label className={labelCls}>Duration</label>
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="৩ দিন / ২ রাত" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                  {[
                    { value: "beach", label: "Beach" },
                    { value: "adventure", label: "Adventure" },
                    { value: "cultural", label: "Cultural" },
                    { value: "honeymoon", label: "Honeymoon" },
                    { value: "family", label: "Family" },
                  ].map((c) => (
                    <option key={c.value} value={c.value} className="bg-slate-800">{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Rating</label>
                <input type="number" name="rating" value={form.rating} onChange={handleChange} className={inputCls} min={1} max={5} step={0.1} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." className={inputCls} required />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                className={`${inputCls} resize-none`} rows={3} required />
            </div>

            <div>
              <label className={labelCls}>Includes <span className="normal-case text-slate-600 font-bold">(comma separated)</span></label>
              <input name="includes" value={form.includes} onChange={handleChange}
                placeholder="Hotel, Transport, Meals, Guide" className={inputCls} />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="sr-only" />
                <div className={`w-12 h-6 rounded-full transition-colors ${form.featured ? "bg-emerald-500" : "bg-slate-700"}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-6" : ""}`} />
              </div>
              <span className="text-sm font-black text-slate-400 group-hover:text-white transition-colors">Mark as Featured</span>
            </label>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => document.getElementById("add-pkg-modal").close()}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all">
                {loading ? <span className="loading loading-spinner loading-sm" /> : <>Add Package <FaArrowRight className="text-xs" /></>}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop bg-slate-950/60 backdrop-blur-sm"><button>close</button></form>
      </dialog>
    </>
  );
}
