import { FaAward, FaGlobe, FaHeart, FaUsers, FaStar, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { connect } from "@/lib/mongodb";

export const metadata = {
  title: "About Us | MK Travel Agency",
  description: "MK Travel Agency সম্পর্কে জানুন। ২০১৫ সাল থেকে বাংলাদেশের মানুষের ভ্রমণকে স্মরণীয় করে তুলছি আমরা।",
  alternates: { canonical: "https://mk-travel-agency.vercel.app/about" },
  openGraph: {
    title: "About MK Travel Agency",
    description: "২০১৫ সাল থেকে বাংলাদেশের মানুষের ভ্রমণকে স্মরণীয় করে তুলছি আমরা।",
    url: "https://mk-travel-agency.vercel.app/about",
    images: [{ url: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80", width: 1200, height: 630 }],
  },
};

export const dynamic = "force-dynamic";

const DEFAULT_TEAM = [
  { name: "Mohammad Karim", role: "CEO & Founder",       img: "https://i.pravatar.cc/150?img=11" },
  { name: "Nadia Islam",    role: "Head of Operations",  img: "https://i.pravatar.cc/150?img=47" },
  { name: "Rahul Hossain",  role: "Lead Tour Designer",  img: "https://i.pravatar.cc/150?img=12" },
  { name: "Sadia Akter",    role: "Customer Experience", img: "https://i.pravatar.cc/150?img=48" },
];

const DEFAULT_STATS = [
  { label: "Destinations",    value: "20+" },
  { label: "Happy Travelers", value: "5K+" },
  { label: "Years Experience",value: "9+"  },
  { label: "Awards",          value: "12+" },
];

const ICON_MAP = {
  "20+ Destinations":  <FaGlobe  className="text-3xl text-emerald-400" />,
  "Destinations":      <FaGlobe  className="text-3xl text-emerald-400" />,
  "Passion First":     <FaHeart  className="text-3xl text-emerald-400" />,
  "Award Winning":     <FaAward  className="text-3xl text-emerald-400" />,
  "Awards":            <FaAward  className="text-3xl text-emerald-400" />,
  "5K+ Travelers":     <FaUsers  className="text-3xl text-emerald-400" />,
  "Happy Travelers":   <FaUsers  className="text-3xl text-emerald-400" />,
  "Years Experience":  <FaStar   className="text-3xl text-emerald-400" />,
};

function getIcon(label) {
  return ICON_MAP[label] || <FaGlobe className="text-3xl text-emerald-400" />;
}

async function getSettings() {
  try {
    const col = await connect("settings");
    const doc = await col.findOne({ key: "site" });
    return doc || {};
  } catch {
    return {};
  }
}

export default async function AboutPage() {
  const settings = await getSettings();
  const about    = settings.about || {};

  const heroTitle    = about.heroTitle    || "About MK Travel";
  const heroSubtitle = about.heroSubtitle || "২০১৫ সাল থেকে বাংলাদেশের মানুষের ভ্রমণকে স্মরণীয় করে তুলছি আমরা।";
  const story        = about.story        || "MK Travel Agency প্রতিষ্ঠিত হয়েছিল একটি সহজ বিশ্বাস নিয়ে — বাংলাদেশের প্রতিটি মানুষ তার নিজের দেশের সৌন্দর্য উপভোগ করার সুযোগ পাওয়া উচিত। ঢাকার একটি ছোট্ট অফিস থেকে শুরু করে আজ আমরা হাজারো পরিবারের বিশ্বস্ত ভ্রমণ সঙ্গী।";
  const stats        = about.stats?.length ? about.stats : DEFAULT_STATS;
  const team         = about.team?.length  ? about.team  : DEFAULT_TEAM;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80"
          alt="About MK Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-6">Our Story</span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
            {heroTitle.includes("MK Travel") ? (
              <>About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">MK Travel</span></>
            ) : heroTitle}
          </h1>
          <p className="text-slate-300 font-bold text-lg max-w-xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-slate-400 text-lg leading-relaxed font-medium">{story}</p>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">What Drives Us</span>
            <h2 className="text-5xl font-black text-white tracking-tighter mt-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8 text-center hover:border-emerald-500/20 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {getIcon(s.label)}
                </div>
                <h3 className="font-black text-white text-2xl tracking-tight mb-1">{s.value}</h3>
                <p className="text-slate-500 text-sm font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">The People</span>
            <h2 className="text-5xl font-black text-white tracking-tighter mt-4">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="group relative bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-center hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Glow bg */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {/* Avatar */}
                <div className="relative mx-auto mb-5 w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md group-hover:bg-emerald-500/30 transition-all duration-500" />
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-slate-700 group-hover:ring-emerald-500/50 transition-all duration-500">
                    {member.img
                      ? <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      : <div className="w-full h-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-3xl">{member.name?.charAt(0)}</div>
                    }
                  </div>
                </div>
                {/* Info */}
                <h3 className="font-black text-white text-base tracking-tight">{member.name}</h3>
                <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-widest">{member.role}</p>
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-0.5 bg-emerald-500 rounded-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              {[1,2,3,4,5].map((i) => <FaStar key={i} className="text-amber-400 text-xl" />)}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Ready to Explore?</h2>
            <p className="text-slate-400 font-bold mb-8">আজই আপনার স্বপ্নের ভ্রমণ বুক করুন।</p>
            <Link href="/packages"
              className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5">
              View Packages <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
