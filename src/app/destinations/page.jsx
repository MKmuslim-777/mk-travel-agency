import Link from "next/link";
import { FaArrowRight, FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdBeachAccess, MdForest, MdLandscape, MdFlight } from "react-icons/md";
import { connect } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Destinations | বাংলাদেশের সেরা গন্তব্য — MK Travel Agency",
  description: "কক্সবাজার, সুন্দরবন, সিলেট, বান্দরবান, সেন্ট মার্টিন ও রাঙামাটি — বাংলাদেশের সেরা ভ্রমণ গন্তব্যগুলো আবিষ্কার করুন।",
  alternates: { canonical: "https://mk-travel-agency.vercel.app/destinations" },
  openGraph: {
    title: "Destinations | বাংলাদেশের সেরা গন্তব্য",
    description: "বাংলাদেশের সেরা ভ্রমণ গন্তব্য।",
    url: "https://mk-travel-agency.vercel.app/destinations",
    images: [{ url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80", width: 1200, height: 630 }],
  },
};

const DEFAULT_DESTINATIONS = [
  { name: "কক্সবাজার",   tagline: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত",      icon: "beach",    color: "from-cyan-500 to-blue-700",     image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",   rating: "4.9", packages: "15+", bestTime: "অক্টোবর — মার্চ",      division: "Chittagong" },
  { name: "সুন্দরবন",    tagline: "পৃথিবীর বৃহত্তম ম্যানগ্রোভ বন",    icon: "forest",   color: "from-emerald-600 to-green-900",  image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",   rating: "4.8", packages: "8+",  bestTime: "নভেম্বর — ফেব্রুয়ারি", division: "Khulna"     },
  { name: "সিলেট",       tagline: "চা বাগান ও হাওরের দেশ",             icon: "landscape", color: "from-teal-500 to-emerald-800",   image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",   rating: "4.8", packages: "10+", bestTime: "অক্টোবর — এপ্রিল",     division: "Sylhet"     },
  { name: "বান্দরবান",   tagline: "মেঘের রাজ্যে পাহাড়ি অ্যাডভেঞ্চার", icon: "mountain", color: "from-violet-600 to-purple-900",  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",  rating: "4.9", packages: "12+", bestTime: "সেপ্টেম্বর — ফেব্রুয়ারি", division: "Chittagong" },
  { name: "সেন্ট মার্টিন", tagline: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ", icon: "beach",   color: "from-sky-500 to-indigo-800",     image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",   rating: "4.7", packages: "6+",  bestTime: "নভেম্বর — মার্চ",      division: "Chittagong" },
  { name: "রাঙামাটি",    tagline: "কাপ্তাই লেকের নীল জলের শহর",       icon: "landscape", color: "from-rose-600 to-pink-900",      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",  rating: "4.7", packages: "7+",  bestTime: "অক্টোবর — মার্চ",      division: "Chittagong" },
  { name: "খাগড়াছড়ি",  tagline: "পাহাড়ি ঝর্ণা ও আদিবাসী সংস্কৃতি", icon: "mountain", color: "from-amber-600 to-orange-900",   image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",  rating: "4.6", packages: "5+",  bestTime: "অক্টোবর — মার্চ",      division: "Chittagong" },
  { name: "কুয়াকাটা",   tagline: "সূর্যোদয় ও সূর্যাস্তের সৈকত",      icon: "beach",    color: "from-orange-500 to-red-800",     image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",  rating: "4.6", packages: "4+",  bestTime: "নভেম্বর — ফেব্রুয়ারি", division: "Barisal"    },
];

function mergeDestinations(dbDests, defaults) {
  if (!dbDests?.length) return defaults;
  return dbDests.map((d, i) => {
    const def = defaults[i] || defaults[0];
    return {
      ...def,
      name:     d.name     || def.name,
      tagline:  d.tagline  || def.tagline,
      bestTime: d.bestTime || def.bestTime,
      packages: d.packages || def.packages,
      image:    d.image    || def.image,
      division: d.division || def.division,
    };
  });
}

function DestIcon({ type }) {
  const cls = "text-2xl text-white drop-shadow";
  if (type === "beach")    return <MdBeachAccess className={cls} />;
  if (type === "forest")   return <MdForest className={cls} />;
  if (type === "mountain") return <MdFlight className={`${cls} rotate-45`} />;
  return <MdLandscape className={cls} />;
}

async function getSettings() {
  try {
    const col = await connect("settings");
    return await col.findOne({ key: "site" }) || {};
  } catch { return {}; }
}

export default async function DestinationsPage() {
  const settings     = await getSettings();
  const destinations = mergeDestinations(settings.destinations, DEFAULT_DESTINATIONS);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative pt-40 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2.5 text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">
            <FaMapMarkerAlt /> বাংলাদেশের সেরা গন্তব্য
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-4">
            আপনার পরবর্তী{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">অ্যাডভেঞ্চার</span>
          </h1>
          <p className="text-slate-400 text-base font-medium max-w-xl mx-auto">
            {destinations.length}টি অসাধারণ গন্তব্য — সমুদ্র থেকে পাহাড়, বন থেকে দ্বীপ। একটি বেছে নিন।
          </p>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((d, i) => (
            <Link
              key={d.name + i}
              href={`/packages?destination=${encodeURIComponent(d.name)}`}
              className="group relative rounded-[2rem] overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] bg-slate-900"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${d.color} opacity-40 group-hover:opacity-50 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Icon badge */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <DestIcon type={d.icon} />
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 px-2.5 py-1 rounded-xl">
                  <FaStar className="text-amber-400 text-xs" />
                  <span className="text-white font-black text-xs">{d.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-xl font-black text-white tracking-tight mb-1 group-hover:text-emerald-400 transition-colors duration-300">
                  {d.name}
                </h2>
                <p className="text-slate-500 text-xs font-bold mb-4 line-clamp-1">{d.tagline}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-emerald-500 text-[10px]" />
                      {d.packages} packages
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-emerald-500 text-[10px]" />
                      {d.bestTime?.split("—")[0]?.trim()}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:border-emerald-500 flex items-center justify-center transition-all duration-300">
                    <FaArrowRight className="text-emerald-400 group-hover:text-white text-xs transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
