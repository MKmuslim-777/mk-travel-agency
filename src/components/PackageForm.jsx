"use client";
import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { MdCloudUpload, MdAdd, MdDelete } from "react-icons/md";
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

export const EMPTY_FORM = {
  title: "", description: "", destination: "", price: "", oldPrice: "",
  duration: "", category: "beach", rating: 4.5, featured: false, isFlashDeal: false,
  includes: "", excludes: "", maxGroupSize: 15,
  highlights: [],   // string[]
  itinerary: [],    // {day, title, description}[]
};

export function formFromPkg(pkg) {
  return {
    title:        pkg.title        || "",
    description:  pkg.description  || "",
    destination:  pkg.destination  || "",
    price:        pkg.price        || "",
    oldPrice:     pkg.oldPrice     || "",
    duration:     pkg.duration     || "",
    category:     pkg.category     || "beach",
    rating:       pkg.rating       || 4.5,
    featured:     pkg.featured     || false,
    isFlashDeal:  pkg.isFlashDeal  || false,
    includes:     (pkg.includes    || []).join(", "),
    excludes:     (pkg.excludes    || []).join(", "),
    maxGroupSize: pkg.maxGroupSize || 15,
    highlights:   pkg.highlights   || [],
    itinerary:    pkg.itinerary    || [],
  };
}

export function buildPayload(form, images) {
  return {
    ...form,
    price:        Number(form.price),
    oldPrice:     form.oldPrice ? Number(form.oldPrice) : null,
    rating:       Number(form.rating),
    maxGroupSize: Number(form.maxGroupSize),
    includes:     form.includes.split(",").map((s) => s.trim()).filter(Boolean),
    excludes:     form.excludes.split(",").map((s) => s.trim()).filter(Boolean),
    image:        images[0],
    gallery:      images,
  };
}

const inp = "w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors";
const lbl = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

export default function PackageForm({ form, setForm, images, setImages, loading, uploading, setUploading, onSubmit, submitLabel = "Save" }) {
  const imgOk = images.length >= MIN_IMAGES && images.length <= MAX_IMAGES;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleImagePick(e) {
    const files = Array.from(e.target.files || []);
    const input = e.target;
    if (!files.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { toast.error(`সর্বোচ্চ ${MAX_IMAGES}টি ছবি।`); return; }
    const toUpload = files.slice(0, remaining);
    setUploading(true);
    const tid = toast.loading(`${toUpload.length}টি ছবি আপলোড হচ্ছে...`);
    try {
      const urls = await Promise.all(toUpload.map(uploadToImgbb));
      setImages((p) => [...p, ...urls]);
      toast.success(`${urls.length}টি ছবি আপলোড হয়েছে!`, { id: tid });
    } catch {
      toast.error("আপলোড ব্যর্থ।", { id: tid });
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  // Highlights helpers
  function addHighlight() { setForm((p) => ({ ...p, highlights: [...p.highlights, ""] })); }
  function updateHighlight(i, v) { setForm((p) => { const h = [...p.highlights]; h[i] = v; return { ...p, highlights: h }; }); }
  function removeHighlight(i) { setForm((p) => ({ ...p, highlights: p.highlights.filter((_, j) => j !== i) })); }

  // Itinerary helpers
  function addDay() { setForm((p) => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: "", description: "" }] })); }
  function updateDay(i, field, v) { setForm((p) => { const it = [...p.itinerary]; it[i] = { ...it[i], [field]: v }; return { ...p, itinerary: it }; }); }
  function removeDay(i) { setForm((p) => ({ ...p, itinerary: p.itinerary.filter((_, j) => j !== i).map((d, j) => ({ ...d, day: j + 1 })) })); }

  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* ── Basic Info ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-4">
        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Basic Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={lbl}>Package Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Cox's Bazar Special" className={inp} required />
          </div>
          <div>
            <label className={lbl}>Destination *</label>
            <input name="destination" value={form.destination} onChange={handleChange} placeholder="কক্সবাজার" className={inp} required />
          </div>
          <div>
            <label className={lbl}>Duration *</label>
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="৩ দিন / ২ রাত" className={inp} required />
          </div>
          <div>
            <label className={lbl}>Price (BDT) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="5000" className={inp} min={1} required />
          </div>
          <div>
            <label className={lbl}>Old Price (BDT) <span className="normal-case text-slate-600 font-bold">optional</span></label>
            <input type="number" name="oldPrice" value={form.oldPrice} onChange={handleChange} placeholder="6000" className={inp} min={0} />
          </div>
          <div>
            <label className={lbl}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inp}>
              {["beach","adventure","cultural","honeymoon","family"].map((c) => (
                <option key={c} value={c} className="bg-slate-800 capitalize">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl}>Rating (1–5)</label>
            <input type="number" name="rating" value={form.rating} onChange={handleChange} className={inp} min={1} max={5} step={0.1} />
          </div>
          <div>
            <label className={lbl}>Max Group Size</label>
            <input type="number" name="maxGroupSize" value={form.maxGroupSize} onChange={handleChange} className={inp} min={1} />
          </div>
        </div>
        <div>
          <label className={lbl}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            className={`${inp} resize-none`} rows={3} required />
        </div>
        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          {[
            { name: "featured",    label: "Mark as Featured" },
            { name: "isFlashDeal", label: "Flash Deal" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="sr-only" />
                <div className={`w-11 h-6 rounded-full transition-colors ${form[name] ? "bg-emerald-500" : "bg-slate-700"}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[name] ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm font-black text-slate-400">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Images ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Images</h3>
          <span className={`text-xs font-black ${imgOk ? "text-emerald-400" : images.length > 0 ? "text-amber-400" : "text-slate-600"}`}>
            {images.length}/{MAX_IMAGES} (min {MIN_IMAGES})
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: MAX_IMAGES }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < images.length ? (imgOk ? "bg-emerald-500" : "bg-amber-500") : "bg-slate-800"}`} />
          ))}
        </div>
        {images.length < MAX_IMAGES && (
          <label className={`flex items-center gap-3 cursor-pointer ${inp} ${uploading ? "opacity-60 cursor-not-allowed" : "hover:border-emerald-500"}`}>
            <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImagePick} disabled={uploading} />
            {uploading ? <><span className="loading loading-spinner loading-xs text-emerald-400" /> আপলোড হচ্ছে...</> : <><MdCloudUpload className="text-xl text-slate-400" /> ছবি বেছে নিন</>}
          </label>
        )}
        {images.length > 0 && images.length < MIN_IMAGES && (
          <p className="text-amber-400 text-xs font-bold">আরও {MIN_IMAGES - images.length}টি ছবি যোগ করুন</p>
        )}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 0 && <span className="absolute top-1 left-1 text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">Cover</span>}
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImages((p) => p.filter((_, j) => j !== i)); }}
                  className="absolute top-1 right-1 w-6 h-6 bg-rose-500/90 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaTimes className="text-[10px]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Includes / Excludes ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-4">
        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Includes & Excludes</h3>
        <div>
          <label className={lbl}>Includes <span className="normal-case text-slate-600 font-bold">(comma separated)</span></label>
          <input name="includes" value={form.includes} onChange={handleChange} placeholder="Hotel, Transport, Meals, Guide" className={inp} />
        </div>
        <div>
          <label className={lbl}>Excludes <span className="normal-case text-slate-600 font-bold">(comma separated)</span></label>
          <input name="excludes" value={form.excludes} onChange={handleChange} placeholder="Airfare, Personal expenses" className={inp} />
        </div>
      </div>

      {/* ── Highlights ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Highlights</h3>
          <button type="button" onClick={addHighlight}
            className="flex items-center gap-1.5 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors">
            <MdAdd size={16} /> Add
          </button>
        </div>
        {form.highlights.length === 0 && (
          <p className="text-slate-600 text-xs font-bold">No highlights yet. Click Add to add one.</p>
        )}
        {form.highlights.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input value={h} onChange={(e) => updateHighlight(i, e.target.value)}
              placeholder={`Highlight ${i + 1}`} className={`${inp} flex-1`} />
            <button type="button" onClick={() => removeHighlight(i)}
              className="w-10 h-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center shrink-0 transition-all">
              <MdDelete size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Itinerary ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Itinerary (Day-by-Day)</h3>
          <button type="button" onClick={addDay}
            className="flex items-center gap-1.5 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors">
            <MdAdd size={16} /> Add Day
          </button>
        </div>
        {form.itinerary.length === 0 && (
          <p className="text-slate-600 text-xs font-bold">No itinerary yet. Click Add Day to add one.</p>
        )}
        {form.itinerary.map((day, i) => (
          <div key={i} className="bg-slate-800/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Day {day.day}</span>
              <button type="button" onClick={() => removeDay(i)}
                className="text-rose-400 hover:text-rose-300 transition-colors"><MdDelete size={16} /></button>
            </div>
            <div>
              <label className={lbl}>Title</label>
              <input value={day.title} onChange={(e) => updateDay(i, "title", e.target.value)}
                placeholder="Arrival & Beach Walk" className={inp} />
            </div>
            <div>
              <label className={lbl}>Description</label>
              <textarea value={day.description} onChange={(e) => updateDay(i, "description", e.target.value)}
                placeholder="Describe the day's activities..." rows={2}
                className={`${inp} resize-none`} />
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading || uploading || !imgOk}
        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
        {loading ? <span className="loading loading-spinner loading-sm" /> : submitLabel}
      </button>
    </form>
  );
}
