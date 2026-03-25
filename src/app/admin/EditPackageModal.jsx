"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { MdClose, MdCloudUpload } from "react-icons/md";
import toast from "react-hot-toast";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
const MIN_IMAGES = 3;
const MAX_IMAGES = 7;

async function uploadToImgbb(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
  const data = await res.json();
  if (!data.success) throw new Error("Upload failed");
  return data.data.url;
}

export default function EditPackageModal({ pkg, onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: pkg.title || "",
    description: pkg.description || "",
    destination: pkg.destination || "",
    price: pkg.price || "",
    duration: pkg.duration || "",
    category: pkg.category || "beach",
    rating: pkg.rating || 4.5,
    featured: pkg.featured || false,
    includes: (pkg.includes || []).join(", "),
  });
  const [images, setImages] = useState(pkg.gallery?.length ? pkg.gallery : pkg.image ? [pkg.image] : []);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleImagePick(e) {
    const files = Array.from(e.target.files || []);
    const input = e.target; // reference আগেই নাও — async context-এ e.target stale হয়
    if (!files.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { toast.error(`সর্বোচ্চ ${MAX_IMAGES}টি ছবি।`); return; }
    const toUpload = files.slice(0, remaining);
    setUploading(true);
    const toastId = toast.loading(`${toUpload.length}টি ছবি আপলোড হচ্ছে...`);
    try {
      const urls = await Promise.all(toUpload.map(uploadToImgbb));
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length}টি ছবি আপলোড হয়েছে!`, { id: toastId });
    } catch {
      toast.error("আপলোড ব্যর্থ।", { id: toastId });
    } finally {
      setUploading(false);
      input.value = ""; // stale e.target এর বদলে saved reference ব্যবহার
    }
  }

  function removeImage(e, idx) {
    e.preventDefault();
    e.stopPropagation(); // form scroll বা submit prevent করো
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length < MIN_IMAGES) { toast.error(`কমপক্ষে ${MIN_IMAGES}টি ছবি দরকার।`); return; }
    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
      image: images[0],
      gallery: images,
    };
    const res = await fetch(`/api/packages/${pkg._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { toast.error(data.error || "Failed"); return; }
    toast.success("প্যাকেজ আপডেট হয়েছে!");
    onClose();
    router.refresh();
  }

  const inputCls = "w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors";
  const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2";
  const imgOk = images.length >= MIN_IMAGES && images.length <= MAX_IMAGES;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] z-10">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
          <h3 className="text-xl font-black text-white tracking-tighter">Edit Package</h3>
          <button type="button" onClick={onClose}
            className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 transition-colors">
            <MdClose className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Package Title</label>
              <input name="title" value={form.title} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Destination</label>
              <input name="destination" value={form.destination} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Price (BDT)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className={inputCls} min={1} required />
            </div>
            <div>
              <label className={labelCls}>Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                {["beach","adventure","cultural","honeymoon","family"].map((c) => (
                  <option key={c} value={c} className="bg-slate-800 capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Rating</label>
              <input type="number" name="rating" value={form.rating} onChange={handleChange} className={inputCls} min={1} max={5} step={0.1} />
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + " mb-0"}>Images <span className="normal-case text-slate-600 font-bold">(min {MIN_IMAGES}, max {MAX_IMAGES})</span></label>
              <span className={`text-xs font-black ${imgOk ? "text-emerald-400" : "text-amber-400"}`}>{images.length}/{MAX_IMAGES}</span>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < images.length ? (imgOk ? "bg-emerald-500" : "bg-amber-500") : "bg-slate-800"}`} />
              ))}
            </div>
            {images.length < MAX_IMAGES && (
              <label className={`flex items-center gap-3 cursor-pointer ${inputCls} ${uploading ? "opacity-60 cursor-not-allowed" : "hover:border-emerald-500"}`}>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImagePick} disabled={uploading} />
                {uploading
                  ? <><span className="loading loading-spinner loading-xs text-emerald-400" /> আপলোড হচ্ছে...</>
                  : <><MdCloudUpload className="text-xl text-slate-400" /> ছবি যোগ করুন</>
                }
              </label>
            )}
            {images.length > 0 && images.length < MIN_IMAGES && (
              <p className="text-amber-400 text-xs font-bold mt-2">আরও {MIN_IMAGES - images.length}টি ছবি যোগ করুন</p>
            )}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {images.map((url, i) => (
                  <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700">
                    <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">Cover</span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => removeImage(e, i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-rose-500/90 hover:bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className={`${inputCls} resize-none`} rows={3} required />
          </div>

          <div>
            <label className={labelCls}>Includes <span className="normal-case text-slate-600 font-bold">(comma separated)</span></label>
            <input name="includes" value={form.includes} onChange={handleChange} className={inputCls} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="sr-only" />
              <div className={`w-12 h-6 rounded-full transition-colors ${form.featured ? "bg-emerald-500" : "bg-slate-700"}`} />
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-6" : ""}`} />
            </div>
            <span className="text-sm font-black text-slate-400 group-hover:text-white transition-colors">Mark as Featured</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploading || !imgOk}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all">
              {loading ? <span className="loading loading-spinner loading-sm" /> : <>Save Changes <FaArrowRight className="text-xs" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
