import { FaAward, FaGlobe, FaHeart, FaUsers, FaStar, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export const metadata = { title: "About Us | MK Travel Agency" };

const team = [
  { name: "Mohammad Karim", role: "CEO & Founder", img: "https://i.pravatar.cc/150?img=11" },
  { name: "Nadia Islam", role: "Head of Operations", img: "https://i.pravatar.cc/150?img=47" },
  { name: "Rahul Hossain", role: "Lead Tour Designer", img: "https://i.pravatar.cc/150?img=12" },
  { name: "Sadia Akter", role: "Customer Experience", img: "https://i.pravatar.cc/150?img=48" },
];

const values = [
  { icon: <FaGlobe className="text-3xl text-emerald-400" />, title: "20+ Destinations", desc: "বাংলাদেশের সেরা গন্তব্যগুলোতে আমাদের উপস্থিতি।" },
  { icon: <FaHeart className="text-3xl text-emerald-400" />, title: "Passion First", desc: "প্রতিটি ট্যুর ভালোবাসা দিয়ে পরিকল্পনা করা হয়।" },
  { icon: <FaAward className="text-3xl text-emerald-400" />, title: "Award Winning", desc: "সেরা ট্যুর অপারেটর পুরস্কার ২০২৩।" },
  { icon: <FaUsers className="text-3xl text-emerald-400" />, title: "5K+ Travelers", desc: "সন্তুষ্ট যাত্রীরাই আমাদের সেরা পুরস্কার।" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80"
          alt="" className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-6">Our Story</span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">MK Travel</span>
          </h1>
          <p className="text-slate-300 font-bold text-lg max-w-xl mx-auto">
            ২০১৫ সাল থেকে বাংলাদেশের মানুষের ভ্রমণকে স্মরণীয় করে তুলছি আমরা।
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-slate-400 text-lg leading-relaxed font-medium">
          MK Travel Agency প্রতিষ্ঠিত হয়েছিল একটি সহজ বিশ্বাস নিয়ে — বাংলাদেশের প্রতিটি মানুষ তার নিজের দেশের সৌন্দর্য উপভোগ করার সুযোগ পাওয়া উচিত। ঢাকার একটি ছোট্ট অফিস থেকে শুরু করে আজ আমরা হাজারো পরিবারের বিশ্বস্ত ভ্রমণ সঙ্গী।
        </p>
      </section>

      {/* Values */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">What Drives Us</span>
            <h2 className="text-5xl font-black text-white tracking-tighter mt-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8 text-center hover:border-emerald-500/20 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {v.icon}
                </div>
                <h3 className="font-black text-white text-lg tracking-tight mb-3">{v.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">{v.desc}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 text-center hover:border-emerald-500/20 hover:-translate-y-2 transition-all duration-500 group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 ring-2 ring-slate-700 group-hover:ring-emerald-500/30 transition-all">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-black text-white text-sm tracking-tight">{member.name}</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">{member.role}</p>
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
              {[1,2,3,4,5].map(i => <FaStar key={i} className="text-amber-400 text-xl" />)}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Ready to Explore?</h2>
            <p className="text-slate-400 font-bold mb-8">আজই আপনার স্বপ্নের ভ্রমণ বুক করুন।</p>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5"
            >
              View Packages <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
