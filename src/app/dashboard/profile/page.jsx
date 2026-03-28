"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdCloudUpload, MdPerson, MdLock, MdPhone, MdLocationOn } from "react-icons/md";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

async function uploadToImgbb(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
  const data = await res.json();
  if (!data.success) throw new Error("Upload failed");
  return data.data.url;
}

const inputCls = "w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors";
const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2";

const empty = {
  name: "", image: "", phone: "", address: "", city: "",
  occupation: "", bio: "", dateOfBirth: "", gender: "",
  emergencyContact: "", emergencyPhone: "",
};

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [form, setForm]           = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [curPwd, setCurPwd]         = useState("");
  const [newPwd, setNewPwd]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving]   = useState(false);

  // Password strength
  const pwdChecks = {
    length:  newPwd.length >= 8,
    upper:   /[A-Z]/.test(newPwd),
    lower:   /[a-z]/.test(newPwd),
    number:  /[0-9]/.test(newPwd),
    special: /[^A-Za-z0-9]/.test(newPwd),
  };
  const pwdScore   = Object.values(pwdChecks).filter(Boolean).length;
  const pwdMatch   = newPwd && confirmPwd && newPwd === confirmPwd;
  const pwdStrong  = pwdScore >= 4;

  // Load full profile from DB on mount
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setForm({
          name:             data.name             || "",
          image:            data.image            || "",
          phone:            data.phone            || "",
          address:          data.address          || "",
          city:             data.city             || "",
          occupation:       data.occupation       || "",
          bio:              data.bio              || "",
          dateOfBirth:      data.dateOfBirth      || "",
          gender:           data.gender           || "",
          emergencyContact: data.emergencyContact || "",
          emergencyPhone:   data.emergencyPhone   || "",
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoadingData(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleImagePick(e) {
    const file = e.target.files?.[0];
    const input = e.target;
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("ছবি আপলোড হচ্ছে...");
    try {
      const url = await uploadToImgbb(file);
      setForm((p) => ({ ...p, image: url }));
      toast.success("ছবি আপলোড হয়েছে!", { id: toastId });
    } catch {
      toast.error("আপলোড ব্যর্থ।", { id: toastId });
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("নাম দিন।"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      // Update next-auth session name/image
      await updateSession({ name: form.name, image: form.image });
      toast.success("প্রোফাইল আপডেট হয়েছে!");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    if (!curPwd || !newPwd || !confirmPwd) { toast.error("সব ঘর পূরণ করুন।"); return; }
    if (!pwdMatch) { toast.error("নতুন পাসওয়ার্ড দুটো মিলছে না।"); return; }
    if (!pwdStrong) { toast.error("পাসওয়ার্ড আরো শক্তিশালী করুন।"); return; }
    setPwdSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: curPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      toast.success("পাসওয়ার্ড পরিবর্তন হয়েছে!");
      setCurPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPwdSaving(false);
    }
  }

  if (loadingData) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Settings</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">My Profile</h1>
        <p className="text-slate-500 font-bold mt-1 text-sm">আপনার তথ্য আপডেট করুন।</p>
      </div>

      <form onSubmit={handleProfileSave} className="space-y-6">

        {/* ── Avatar & Basic ── */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <MdPerson className="text-emerald-400 text-xl" />
            <h2 className="text-lg font-black text-white">Basic Information</h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 overflow-hidden flex items-center justify-center text-emerald-400 font-black text-3xl shrink-0">
              {form.image
                ? <img src={form.image} alt="avatar" className="w-full h-full object-cover" />
                : form.name?.charAt(0)?.toUpperCase() || "?"
              }
            </div>
            <label className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 text-sm font-bold hover:border-emerald-500 transition-colors ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
              <input type="file" accept="image/*" className="sr-only" onChange={handleImagePick} disabled={uploading} />
              {uploading
                ? <><span className="loading loading-spinner loading-xs" /> আপলোড হচ্ছে...</>
                : <><MdCloudUpload size={18} /> ছবি পরিবর্তন করুন</>
              }
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="আপনার পুরো নাম" required />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Email (পরিবর্তন করা যাবে না)</label>
              <input value={session?.user?.email || ""} disabled className={`${inputCls} opacity-40 cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelCls}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
                <option value="" className="bg-slate-800">-- বেছে নিন --</option>
                <option value="male"   className="bg-slate-800">Male / পুরুষ</option>
                <option value="female" className="bg-slate-800">Female / মহিলা</option>
                <option value="other"  className="bg-slate-800">Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Occupation</label>
              <input name="occupation" value={form.occupation} onChange={handleChange} className={inputCls} placeholder="যেমন: Student, Engineer..." />
            </div>
          </div>

          <div>
            <label className={labelCls}>Bio / About</label>
            <textarea name="bio" value={form.bio} onChange={handleChange}
              className={`${inputCls} resize-none`} rows={3} placeholder="নিজের সম্পর্কে কিছু লিখুন..." />
          </div>
        </div>

        {/* ── Contact Info ── */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <MdPhone className="text-emerald-400 text-xl" />
            <h2 className="text-lg font-black text-white">Contact Information</h2>
          </div>
          <p className="text-xs text-slate-500 font-bold -mt-3">Moderator প্রয়োজনে এই তথ্য দেখতে পারবে।</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+880 1XXX-XXXXXX" />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input name="city" value={form.city} onChange={handleChange} className={inputCls} placeholder="ঢাকা, চট্টগ্রাম..." />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Full Address</label>
              <textarea name="address" value={form.address} onChange={handleChange}
                className={`${inputCls} resize-none`} rows={2} placeholder="বাড়ি নং, রাস্তা, এলাকা..." />
            </div>
          </div>
        </div>

        {/* ── Emergency Contact ── */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <MdLocationOn className="text-rose-400 text-xl" />
            <h2 className="text-lg font-black text-white">Emergency Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Contact Name</label>
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange}
                className={inputCls} placeholder="জরুরি যোগাযোগের নাম" />
            </div>
            <div>
              <label className={labelCls}>Contact Phone</label>
              <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange}
                className={inputCls} placeholder="+880 1XXX-XXXXXX" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving || uploading}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
          {saving ? <span className="loading loading-spinner loading-sm" /> : "Save Profile"}
        </button>
      </form>

      {/* ── Password Change ── */}
      <form onSubmit={handlePasswordSave} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5 mt-6">
        <div className="flex items-center gap-3">
          <MdLock className="text-emerald-400 text-xl" />
          <h2 className="text-lg font-black text-white">Change Password</h2>
        </div>
        <p className="text-xs text-slate-500 font-bold -mt-3">Google দিয়ে লগইন করলে এটি কাজ করবে না।</p>

        <div>
          <label className={labelCls}>Current Password</label>
          <input type="password" value={curPwd} onChange={(e) => setCurPwd(e.target.value)} className={inputCls} placeholder="••••••••" />
        </div>

        <div>
          <label className={labelCls}>New Password</label>
          <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={inputCls} placeholder="••••••••" />
          {/* Strength bars */}
          {newPwd && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwdScore ? (pwdScore <= 2 ? "bg-rose-500" : pwdScore <= 3 ? "bg-amber-500" : "bg-emerald-500") : "bg-slate-700"}`} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  { key: "length",  label: "৮+ অক্ষর" },
                  { key: "upper",   label: "বড় হাতের অক্ষর" },
                  { key: "lower",   label: "ছোট হাতের অক্ষর" },
                  { key: "number",  label: "সংখ্যা" },
                  { key: "special", label: "বিশেষ চিহ্ন (!@#...)" },
                ].map(({ key, label }) => (
                  <p key={key} className={`text-xs font-bold flex items-center gap-1.5 ${pwdChecks[key] ? "text-emerald-400" : "text-slate-600"}`}>
                    <span>{pwdChecks[key] ? "✓" : "○"}</span> {label}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>Confirm New Password</label>
          <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className={`${inputCls} ${confirmPwd ? (pwdMatch ? "border-emerald-500" : "border-rose-500") : ""}`} placeholder="••••••••" />
          {confirmPwd && (
            <p className={`text-xs font-bold mt-1.5 ${pwdMatch ? "text-emerald-400" : "text-rose-400"}`}>
              {pwdMatch ? "✓ পাসওয়ার্ড মিলেছে" : "✗ পাসওয়ার্ড মিলছে না"}
            </p>
          )}
        </div>

        <button type="submit" disabled={pwdSaving || !pwdMatch || !pwdStrong}
          className="px-8 py-3.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-black rounded-2xl transition-all">
          {pwdSaving ? <span className="loading loading-spinner loading-sm" /> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
