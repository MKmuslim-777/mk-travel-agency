"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdCloudUpload, MdAdd, MdDelete } from "react-icons/md";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

async function uploadToImgbb(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
  const data = await res.json();
  if (!data.success) throw new Error();
  return data.data.url;
}

const inp = "w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-600 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors";
const lbl = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

const DEFAULT = {
  logoUrl: "",
  contact: { phone: "", whatsapp: "", email: "", address: "", facebook: "", instagram: "", linkedin: "" },
  about: {
    heroTitle: "About MK Travel",
    heroSubtitle: "২০১৫ সাল থেকে বাংলাদেশের মানুষের ভ্রমণকে স্মরণীয় করে তুলছি আমরা।",
    story: "MK Travel Agency প্রতিষ্ঠিত হয়েছিল একটি সহজ বিশ্বাস নিয়ে।",
    stats: [
      { label: "Destinations", value: "20+" },
      { label: "Happy Travelers", value: "5K+" },
      { label: "Years Experience", value: "9+" },
      { label: "Awards", value: "12+" },
    ],
    team: [
      { name: "Muslim uddin mk", role: "CEO & Founder", img: "https://i.ibb.co.com/jknN9b0D/sfsf.png" },
      { name: "Nadia Islam", role: "Head of Operations", img: "https://i.pravatar.cc/150?img=47" },
    ],
  },
  destinations: [
    { name: "কক্সবাজার", tagline: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত", bestTime: "অক্টোবর — মার্চ", packages: "15+", image: "" },
    { name: "সুন্দরবন", tagline: "পৃথিবীর বৃহত্তম ম্যানগ্রোভ বন", bestTime: "নভেম্বর — ফেব্রুয়ারি", packages: "8+", image: "" },
    { name: "সিলেট", tagline: "চা বাগান ও হাওরের দেশ", bestTime: "অক্টোবর — এপ্রিল", packages: "10+", image: "" },
    { name: "বান্দরবান", tagline: "মেঘের রাজ্যে পাহাড়ি অ্যাডভেঞ্চার", bestTime: "সেপ্টেম্বর — ফেব্রুয়ারি", packages: "12+", image: "" },
    { name: "সেন্ট মার্টিন", tagline: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ", bestTime: "নভেম্বর — মার্চ", packages: "6+", image: "" },
    { name: "রাঙামাটি", tagline: "কাপ্তাই লেকের নীল জলের শহর", bestTime: "অক্টোবর — মার্চ", packages: "7+", image: "" },
  ],
};

function Card({ title, children }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 space-y-4">
      <h2 className="text-base font-black text-white border-b border-slate-800 pb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function SiteSettingsPage() {
  const [s, setS]             = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [tab, setTab]         = useState("contact");
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.contact) {
          setS((prev) => ({
            ...prev,
            ...data,
            contact:      { ...prev.contact,      ...(data.contact || {}) },
            about:        { ...prev.about,         ...(data.about   || {}), stats: data.about?.stats || prev.about.stats, team: data.about?.team || prev.about.team },
            destinations: data.destinations || prev.destinations,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function upload(key, file) {
    setUploading((p) => ({ ...p, [key]: true }));
    const tid = toast.loading("আপলোড হচ্ছে...");
    try {
      const url = await uploadToImgbb(file);
      toast.success("হয়েছে!", { id: tid });
      return url;
    } catch {
      toast.error("ব্যর্থ।", { id: tid });
      return null;
    } finally {
      setUploading((p) => ({ ...p, [key]: false }));
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved!");
    } catch {
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: "contact", label: "Contact" },
    { id: "about",   label: "About Page" },
    { id: "dest",    label: "Destinations" },
    { id: "logo",    label: "Logo" },
  ];

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <span className="text-amber-400 font-black text-xs uppercase tracking-[0.3em]">Admin</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">Site Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
              tab === t.id ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">

        {/* LOGO */}
        {tab === "logo" && (
          <Card title="Site Logo">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-[1.5rem] bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-slate-600 text-3xl shrink-0">
                {s.logoUrl
                  ? <img src={s.logoUrl} alt="logo" className="w-full h-full object-contain p-2" />
                  : "🏖️"
                }
              </div>
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 text-sm font-bold hover:border-emerald-500 transition-colors ${uploading.logo ? "opacity-60 pointer-events-none" : ""}`}>
                <input type="file" accept="image/*" className="sr-only"
                  onChange={async (e) => {
                    const url = await upload("logo", e.target.files[0]);
                    if (url) setS((p) => ({ ...p, logoUrl: url }));
                    e.target.value = "";
                  }} />
                {uploading.logo
                  ? <><span className="loading loading-spinner loading-xs" /> আপলোড হচ্ছে...</>
                  : <><MdCloudUpload size={18} /> লোগো পরিবর্তন করুন</>
                }
              </label>
            </div>
          </Card>
        )}

        {/* CONTACT */}
        {tab === "contact" && (
          <Card title="Contact & Social">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: "phone",     l: "Phone",         ph: "+880 1XXX-XXXXXX" },
                { k: "whatsapp",  l: "WhatsApp",      ph: "+880 1XXX-XXXXXX" },
                { k: "email",     l: "Email",         ph: "info@mktravel.com" },
                { k: "facebook",  l: "Facebook URL",  ph: "https://facebook.com/..." },
                { k: "instagram", l: "Instagram URL", ph: "https://instagram.com/..." },
                { k: "linkedin", l: "Linkedin URL", ph: "https://www.linkedin.com/..." },
              ].map(({ k, l, ph }) => (
                <div key={k}>
                  <label className={lbl}>{l}</label>
                  <input value={s.contact[k] || ""} placeholder={ph} className={inp}
                    onChange={(e) => setS((p) => ({ ...p, contact: { ...p.contact, [k]: e.target.value } }))} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className={lbl}>Address</label>
                <textarea value={s.contact.address || ""} placeholder="Dhaka, Bangladesh" rows={2}
                  className={`${inp} resize-none`}
                  onChange={(e) => setS((p) => ({ ...p, contact: { ...p.contact, address: e.target.value } }))} />
              </div>
            </div>
          </Card>
        )}

        {/* ABOUT */}
        {tab === "about" && (
          <>
            <Card title="Hero Section">
              <div>
                <label className={lbl}>Hero Title</label>
                <input value={s.about.heroTitle} className={inp}
                  onChange={(e) => setS((p) => ({ ...p, about: { ...p.about, heroTitle: e.target.value } }))} />
              </div>
              <div>
                <label className={lbl}>Hero Subtitle</label>
                <input value={s.about.heroSubtitle} className={inp}
                  onChange={(e) => setS((p) => ({ ...p, about: { ...p.about, heroSubtitle: e.target.value } }))} />
              </div>
              <div>
                <label className={lbl}>Our Story</label>
                <textarea value={s.about.story} rows={4} className={`${inp} resize-none`}
                  onChange={(e) => setS((p) => ({ ...p, about: { ...p.about, story: e.target.value } }))} />
              </div>
            </Card>

            <Card title="Stats Cards">
              <div className="space-y-3">
                {s.about.stats.map((st, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Label</label>
                      <input value={st.label} className={inp}
                        onChange={(e) => {
                          const stats = [...s.about.stats];
                          stats[i] = { ...stats[i], label: e.target.value };
                          setS((p) => ({ ...p, about: { ...p.about, stats } }));
                        }} />
                    </div>
                    <div>
                      <label className={lbl}>Value</label>
                      <input value={st.value} className={inp}
                        onChange={(e) => {
                          const stats = [...s.about.stats];
                          stats[i] = { ...stats[i], value: e.target.value };
                          setS((p) => ({ ...p, about: { ...p.about, stats } }));
                        }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Team Members">
              <div className="space-y-3">
                {s.about.team.map((m, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-300">Member {i + 1}</p>
                      <button
                        onClick={() => setS((p) => ({ ...p, about: { ...p.about, team: p.about.team.filter((_, j) => j !== i) } }))}
                        className="text-rose-400 hover:text-rose-300 transition-colors">
                        <MdDelete size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>Name</label>
                        <input value={m.name} className={inp}
                          onChange={(e) => {
                            const team = [...s.about.team];
                            team[i] = { ...team[i], name: e.target.value };
                            setS((p) => ({ ...p, about: { ...p.about, team } }));
                          }} />
                      </div>
                      <div>
                        <label className={lbl}>Role</label>
                        <input value={m.role} className={inp}
                          onChange={(e) => {
                            const team = [...s.about.team];
                            team[i] = { ...team[i], role: e.target.value };
                            setS((p) => ({ ...p, about: { ...p.about, team } }));
                          }} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Photo URL</label>
                      <input value={m.img} className={inp}
                        onChange={(e) => {
                          const team = [...s.about.team];
                          team[i] = { ...team[i], img: e.target.value };
                          setS((p) => ({ ...p, about: { ...p.about, team } }));
                        }} />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setS((p) => ({ ...p, about: { ...p.about, team: [...p.about.team, { name: "", role: "", img: "" }] } }))}
                className="flex items-center gap-2 text-sm font-black text-emerald-400 hover:text-emerald-300 transition-colors mt-2">
                <MdAdd size={18} /> Add Team Member
              </button>
            </Card>
          </>
        )}

        {/* DESTINATIONS */}
        {tab === "dest" && (
          <Card title="Destinations">
            <div className="space-y-4">
              {s.destinations.map((d, i) => (
                <div key={i} className="bg-slate-800/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-300">{d.name || `Destination ${i + 1}`}</p>
                    <button
                      onClick={() => setS((p) => ({ ...p, destinations: p.destinations.filter((_, j) => j !== i) }))}
                      className="text-rose-400 hover:text-rose-300 transition-colors">
                      <MdDelete size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { k: "name",     l: "Name (Bengali)" },
                      { k: "tagline",  l: "Tagline" },
                      { k: "bestTime", l: "Best Time" },
                      { k: "packages", l: "Packages Count" },
                      { k: "division", l: "Division (for filter)" },
                    ].map(({ k, l }) => (
                      <div key={k}>
                        <label className={lbl}>{l}</label>
                        <input value={d[k] || ""} className={inp}
                          onChange={(e) => {
                            const destinations = [...s.destinations];
                            destinations[i] = { ...destinations[i], [k]: e.target.value };
                            setS((p) => ({ ...p, destinations }));
                          }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className={lbl}>Image URL</label>
                    <input value={d.image || ""} placeholder="https://..." className={inp}
                      onChange={(e) => {
                        const destinations = [...s.destinations];
                        destinations[i] = { ...destinations[i], image: e.target.value };
                        setS((p) => ({ ...p, destinations }));
                      }} />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setS((p) => ({ ...p, destinations: [...p.destinations, { name: "", tagline: "", bestTime: "", packages: "", image: "" }] }))}
              className="flex items-center gap-2 text-sm font-black text-emerald-400 hover:text-emerald-300 transition-colors mt-2">
              <MdAdd size={18} /> Add Destination
            </button>
          </Card>
        )}

        <button onClick={save} disabled={saving}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
          {saving ? <span className="loading loading-spinner loading-sm" /> : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
