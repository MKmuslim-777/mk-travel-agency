import Link from "next/link";
import { FaArrowRight, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { MdBeachAccess, MdForest, MdLandscape, MdFlight } from "react-icons/md";

export const metadata = {
  title: "Destinations | বাংলাদেশের সেরা গন্তব্য — MK Travel Agency",
  description: "কক্সবাজার, সুন্দরবন, সিলেট, বান্দরবান, সেন্ট মার্টিন ও রাঙামাটি — বাংলাদেশের সেরা ভ্রমণ গন্তব্যগুলো আবিষ্কার করুন। প্রতিটি গন্তব্যের বিস্তারিত তথ্য ও ট্যুর প্যাকেজ।",
  alternates: { canonical: "https://mk-travel-agency.vercel.app/destinations" },
  openGraph: {
    title: "Destinations | বাংলাদেশের সেরা গন্তব্য",
    description: "কক্সবাজার, সুন্দরবন, সিলেট, বান্দরবান, সেন্ট মার্টিন ও রাঙামাটি — বাংলাদেশের সেরা ভ্রমণ গন্তব্য।",
    url: "https://mk-travel-agency.vercel.app/destinations",
    images: [{ url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80", width: 1200, height: 630, alt: "Bangladesh Destinations" }],
  },
};

const destinations = [
  {
    name: "কক্সবাজার",
    division: "Chittagong",
    tagline: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত",
    desc: "১২০ কিলোমিটার দীর্ঘ বালুকাময় সৈকত, সানসেট পয়েন্ট, হিমছড়ি ঝর্ণা ও ইনানী বিচ — কক্সবাজার বাংলাদেশের সবচেয়ে জনপ্রিয় পর্যটন গন্তব্য।",
    icon: "beach",
    color: "from-cyan-600 to-blue-800",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80",
    highlights: ["সানসেট বিচ", "হিমছড়ি ঝর্ণা", "ইনানী বিচ", "রাডার হিল"],
    rating: "4.9",
    packages: "15+",
    bestTime: "অক্টোবর — মার্চ",
  },
  {
    name: "সুন্দরবন",
    division: "Khulna",
    tagline: "পৃথিবীর বৃহত্তম ম্যানগ্রোভ বন",
    desc: "ইউনেস্কো বিশ্ব ঐতিহ্যবাহী স্থান সুন্দরবন — রয়েল বেঙ্গল টাইগার, ইরাবতী ডলফিন ও অসংখ্য পাখির আবাসস্থল। নৌকায় ভেসে অনুভব করুন প্রকৃতির অপার সৌন্দর্য।",
    icon: "forest",
    color: "from-emerald-700 to-green-900",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    highlights: ["রয়েল বেঙ্গল টাইগার", "করমজল", "কটকা বিচ", "হিরণ পয়েন্ট"],
    rating: "4.8",
    packages: "8+",
    bestTime: "নভেম্বর — ফেব্রুয়ারি",
  },
  {
    name: "সিলেট",
    division: "Sylhet",
    tagline: "চা বাগান ও হাওরের দেশ",
    desc: "সবুজ চা বাগান, রাতারগুল জলাবন, বিছানাকান্দি ও জাফলং — সিলেট প্রকৃতিপ্রেমীদের জন্য এক স্বর্গীয় গন্তব্য।",
    icon: "landscape",
    color: "from-teal-600 to-emerald-800",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    highlights: ["রাতারগুল জলাবন", "বিছানাকান্দি", "জাফলং", "লালাখাল"],
    rating: "4.8",
    packages: "10+",
    bestTime: "অক্টোবর — এপ্রিল",
  },
  {
    name: "বান্দরবান",
    division: "Chittagong",
    tagline: "মেঘের রাজ্যে পাহাড়ি অ্যাডভেঞ্চার",
    desc: "নীলগিরি, বগালেক, নাফাখুম ঝর্ণা ও কেওক্রাডং — বান্দরবান ট্রেকিং ও অ্যাডভেঞ্চারপ্রিয় পর্যটকদের প্রথম পছন্দ।",
    icon: "mountain",
    color: "from-violet-700 to-purple-900",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    highlights: ["নীলগিরি", "বগালেক", "নাফাখুম ঝর্ণা", "কেওক্রাডং"],
    rating: "4.9",
    packages: "12+",
    bestTime: "সেপ্টেম্বর — ফেব্রুয়ারি",
  },
  {
    name: "সেন্ট মার্টিন",
    division: "Chittagong",
    tagline: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ",
    desc: "স্বচ্ছ নীল জল, প্রবাল প্রাচীর ও নারিকেল গাছের সারি — সেন্ট মার্টিন দ্বীপ বাংলাদেশের সবচেয়ে রোমান্টিক গন্তব্য।",
    icon: "beach",
    color: "from-sky-600 to-indigo-800",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
    highlights: ["প্রবাল প্রাচীর", "ছেঁড়াদ্বীপ", "স্নোরকেলিং", "সানরাইজ বিচ"],
    rating: "4.7",
    packages: "6+",
    bestTime: "নভেম্বর — মার্চ",
  },
  {
    name: "রাঙামাটি",
    division: "Chittagong",
    tagline: "কাপ্তাই লেকের নীল জলের শহর",
    desc: "কাপ্তাই লেকের বুকে নৌকায় ভেসে পাহাড়ি জীবনের স্বাদ নিন। ঝুলন্ত সেতু, সুবলং ঝর্ণা ও আদিবাসী সংস্কৃতি — রাঙামাটি এক অনন্য অভিজ্ঞতা।",
    icon: "landscape",
    color: "from-rose-700 to-pink-900",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    highlights: ["কাপ্তাই লেক", "ঝুলন্ত সেতু", "সুবলং ঝর্ণা", "পেদা টিং টিং"],
    rating: "4.7",
    packages: "7+",
    bestTime: "অক্টোবর — মার্চ",
  },
];

function DestIcon({ type }) {
  const cls = "text-3xl text-white";
  if (type === "beach") return <MdBeachAccess className={cls} />;
  if (type === "forest") return <MdForest className={cls} />;
  if (type === "mountain") return <MdFlight className={`${cls} rotate-45`} />;
  return <MdLandscape className={cls} />;
}

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2.5 text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-8">
            <FaMapMarkerAlt /> বাংলাদেশের সেরা গন্তব্য
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6">
            আপনার পরবর্তী <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              অ্যাডভেঞ্চার
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            বাংলাদেশের ৬টি অসাধারণ গন্তব্য — সমুদ্র থেকে পাহাড়, বন থেকে দ্বীপ। প্রতিটি জায়গায় লুকিয়ে আছে এক অনন্য গল্প।
          </p>
        </div>
      </section>

      {/* ── Destinations Grid ── */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {destinations.map((d, i) => (
            <div
              key={d.name}
              className={`group grid lg:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-emerald-500/30 transition-all duration-500 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Image */}
              <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${d.color} opacity-50`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                {/* Icon badge */}
                <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <DestIcon type={d.icon} />
                </div>

                {/* Rating */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-slate-900/70 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl">
                  <FaStar className="text-amber-400 text-sm" />
                  <span className="text-white font-black text-sm">{d.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="bg-slate-900/80 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-3">
                  {d.division} Division
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                  {d.name}
                </h2>
                <p className="text-slate-400 font-bold text-sm mb-4">{d.tagline}</p>
                <p className="text-slate-400 leading-relaxed mb-8 font-medium">{d.desc}</p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {d.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-6 mb-8 text-sm">
                  <div>
                    <p className="text-slate-600 font-black text-xs uppercase tracking-widest">প্যাকেজ</p>
                    <p className="text-white font-black">{d.packages}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div>
                    <p className="text-slate-600 font-black text-xs uppercase tracking-widest">সেরা সময়</p>
                    <p className="text-white font-black">{d.bestTime}</p>
                  </div>
                </div>

                <Link
                  href={`/packages?division=${d.division}`}
                  className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 transition-all duration-300 self-start"
                >
                  প্যাকেজ দেখুন
                  <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
