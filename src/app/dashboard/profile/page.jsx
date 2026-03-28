"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  MdCloudUpload, MdPerson, MdLock, MdPhone, MdLocationOn,
  MdEdit, MdSave, MdBadge, MdCake, MdWork,
} from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

async function uploadToImgbb(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
  const data = await res.json();
  if (!data.success) throw new Error("Upload failed");
  return data.data.url;
}

const inp = "w-full bg-slate-800/60 border border-slate-700/80 text-white placeholder-slate-600 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all";
const lbl = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

const empty = {
  name: "", image: "", phone: "", address: "", city: "",
  occupation: "", bio: "", dateOfBirth: "", gender: "",
  emergencyContact: "", emergencyPhone: "",
};

const TABS = [
  { id: "basic",     label: "Basic Info",  icon: <MdPerson size={16} /> },
  { id: "contact",   label: "Contact",     icon: <MdPhone size={16} /> },
  { id: "emergency", label: "Emergency",   icon: <FaShieldAlt size={14} /> },
  { id: "password",  label: "Password",    icon: <MdLock size={16} /> },
];

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [form, setForm]           = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  const [curPwd, setCurPwd]         = useState("");
  const [newPwd, setNewPwd]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving]   = useState(false);

  const pwdChecks = {
    length:  newPwd.length >= 8,
    upper:   /[A-Z]/.test(newPwd),
    lower:   /[a-z]/.test(newPwd),
    number:  /[0-9]/.test(newPwd),
    special: /[^A-Za-z0-9]/.test(newPwd),
  };
  const pwdScore  = Object.values(pwdChecks).filter(Boolean).length;
  const pwdMatch  = newPwd && confirmPwd && newPwd === confirmPwd;
  const pwdStrong = pwdScore >= 4;

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
    const tid = toast.loading("ছবি আপলোড হচ্ছে...");
    try {
      const url = await uploadToImgbb(file);
      setForm((p) => ({ ...p, image: url }));
      toast.success("ছবি আপলোড হয়েছে!", { id: tid });
    } catch {
      toast.error("আপলোড ব্যর্থ।", { id: tid });
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
    if (!pwdMatch)  { toast.error("নতুন পাসওয়ার্ড দুটো মিলছে না।"); return; }
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

  const roleMeta = {
    admin:     { label: "Admin",     cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    moderator: { label: "Moderator", cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    user:      { label: "User",      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  };
  const role = session?.user?.role || "user";
  const rm   = roleMeta[role] || roleMeta.user;

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ── */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.08)_0%,_transparent_60%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── Avatar + Name row ── */}
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="relative -mt-16 mb-6 flex items-end gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-[1.75rem] bg-slate-800 border-4 border-slate-950 overflow-hidden shadow-2xl">
              {form.image
                ? <img src={form.image} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-emerald-500/30 to-teal-500/20 flex items-center justify-center text-emerald-400 font-black text-4xl">
                    {form.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
              }
            </div>
            {/* Upload overlay */}
            <label className={`absolute inset-0 rounded-[1.75rem] bg-slate-950/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer ${uploading ? "opacity-100 cursor-not-allowed" : ""}`}>
              <input type="file" accept="image/*" className="sr-only" onChange={handleImagePick} disabled={uploading} />
              {uploading
                ? <span className="loading loading-spinner loading-sm text-white" />
                : <MdCloudUpload size={24} className="text-white" />
              }
            </label>
          </div>

          {/* Name + role */}
          <div className="pb-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-white tracking-tight truncate">
                {form.name || "Your Name"}
              </h1>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${rm.cls}`}>
                {rm.label}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-bold mt-0.5 truncate">{session?.user?.email}</p>
            {form.occupation && (
              <p className="text-slate-400 text-xs font-bold mt-0.5 flex items-center gap-1">
                <MdWork size={12} className="text-emerald-500" /> {form.occupation}
              </p>
            )}
          </div>
        </div>

        {/* Bio preview */}
        {form.bio && (
          <p className="text-slate-400 text-sm font-medium mb-6 bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 italic">
            "{form.bio}"
          </p>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === t.id
                  ? "bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <form onSubmit={handleProfileSave}>

          {/* BASIC INFO */}
          {activeTab === "basic" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={lbl}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className={inp} placeholder="আপনার পুরো নাম" required />
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Email (পরিবর্তন করা যাবে না)</label>
                  <input value={session?.user?.email || ""} disabled className={`${inp} opacity-40 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={lbl}>Date of Birth</label>
                  <div className="relative">
                    <MdCake className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={`${inp} pl-10`} />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={inp}>
                    <option value="" className="bg-slate-800">-- বেছে নিন --</option>
                    <option value="male"   className="bg-slate-800">Male / পুরুষ</option>
                    <option value="female" className="bg-slate-800">Female / মহিলা</option>
                    <option value="other"  className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Occupation</label>
                  <div className="relative">
                    <MdWork className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input name="occupation" value={form.occupation} onChange={handleChange} className={`${inp} pl-10`} placeholder="যেমন: Student, Engineer..." />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Bio / About</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange}
                    className={`${inp} resize-none`} rows={3} placeholder="নিজের সম্পর্কে কিছু লিখুন..." />
                </div>
              </div>
              <SaveButton saving={saving} uploading={uploading} />
            </div>
          )}

          {/* CONTACT */}
          {activeTab === "contact" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5">
              <p className="text-xs text-slate-500 font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl px-3 py-2">
                Moderator প্রয়োজনে এই তথ্য দেখতে পারবে।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Phone Number</label>
                  <div className="relative">
                    <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input name="phone" value={form.phone} onChange={handleChange} className={`${inp} pl-10`} placeholder="+880 1XXX-XXXXXX" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>City</label>
                  <div className="relative">
                    <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input name="city" value={form.city} onChange={handleChange} className={`${inp} pl-10`} placeholder="ঢাকা, চট্টগ্রাম..." />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Full Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange}
                    className={`${inp} resize-none`} rows={2} placeholder="বাড়ি নং, রাস্তা, এলাকা..." />
                </div>
              </div>
              <SaveButton saving={saving} uploading={uploading} />
            </div>
          )}

          {/* EMERGENCY */}
          {activeTab === "emergency" && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5">
              <p className="text-xs text-slate-500 font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl px-3 py-2">
                জরুরি পরিস্থিতিতে যোগাযোগের জন্য।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Contact Name</label>
                  <div className="relative">
                    <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange}
                      className={`${inp} pl-10`} placeholder="জরুরি যোগাযোগের নাম" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Contact Phone</label>
                  <div className="relative">
                    <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange}
                      className={`${inp} pl-10`} placeholder="+880 1XXX-XXXXXX" />
                  </div>
                </div>
              </div>
              <SaveButton saving={saving} uploading={uploading} />
            </div>
          )}
        </form>

        {/* PASSWORD TAB — separate form */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSave} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-5">
            <p className="text-xs text-slate-500 font-bold bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
              Google দিয়ে লগইন করলে এটি কাজ করবে না।
            </p>

            <div>
              <label className={lbl}>Current Password</label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="password" value={curPwd} onChange={(e) => setCurPwd(e.target.value)}
                  className={`${inp} pl-10`} placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className={lbl}>New Password</label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                  className={`${inp} pl-10`} placeholder="••••••••" />
              </div>
              {newPwd && (
                <div className="mt-3 space-y-2">
                  {/* Strength bar */}
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= pwdScore
                          ? pwdScore <= 2 ? "bg-rose-500" : pwdScore <= 3 ? "bg-amber-500" : "bg-emerald-500"
                          : "bg-slate-700"
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs font-black ${pwdScore <= 2 ? "text-rose-400" : pwdScore <= 3 ? "text-amber-400" : "text-emerald-400"}`}>
                    {pwdScore <= 2 ? "Weak" : pwdScore <= 3 ? "Medium" : "Strong"}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    {[
                      { key: "length",  label: "৮+ অক্ষর" },
                      { key: "upper",   label: "বড় হাতের অক্ষর" },
                      { key: "lower",   label: "ছোট হাতের অক্ষর" },
                      { key: "number",  label: "সংখ্যা" },
                      { key: "special", label: "বিশেষ চিহ্ন" },
                    ].map(({ key, label }) => (
                      <p key={key} className={`text-xs font-bold flex items-center gap-1.5 ${pwdChecks[key] ? "text-emerald-400" : "text-slate-600"}`}>
                        <span className="text-base leading-none">{pwdChecks[key] ? "✓" : "○"}</span> {label}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={lbl}>Confirm New Password</label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                  className={`${inp} pl-10 ${confirmPwd ? (pwdMatch ? "border-emerald-500" : "border-rose-500") : ""}`}
                  placeholder="••••••••" />
              </div>
              {confirmPwd && (
                <p className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${pwdMatch ? "text-emerald-400" : "text-rose-400"}`}>
                  {pwdMatch ? "✓ পাসওয়ার্ড মিলেছে" : "✗ পাসওয়ার্ড মিলছে না"}
                </p>
              )}
            </div>

            <button type="submit" disabled={pwdSaving || !pwdMatch || !pwdStrong}
              className="w-full py-3.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2">
              {pwdSaving ? <span className="loading loading-spinner loading-sm" /> : <><MdLock size={16} /> Update Password</>}
            </button>
          </form>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}

function SaveButton({ saving, uploading }) {
  return (
    <button type="submit" disabled={saving || uploading}
      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-[0_6px_16px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2">
      {saving
        ? <span className="loading loading-spinner loading-sm" />
        : <><MdSave size={18} /> Save Changes</>
      }
    </button>
  );
}
