import Link from "next/link";
import PackageCard from "@/components/PackageCard";
import { connectDB } from "@/lib/mongodb";
import Package from "@/models/Package";
import {
  FaStar,
  FaArrowRight,
  FaShieldAlt,
  FaHeadset,
  FaHotel,
  FaCar,
} from "react-icons/fa";
import {
  MdVerified,
  MdBeachAccess,
  MdForest,
  MdLandscape,
  MdFlight,
} from "react-icons/md";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { num: "5,000+", label: "Happy Travelers" },
  { num: "50+", label: "Tour Packages" },
  { num: "6", label: "Destinations" },
  { num: "4.9★", label: "Average Rating" },
];

const destinations = [
  {
    name: "কক্সবাজার",
    desc: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত — সানসেট, সার্ফিং ও সামুদ্রিক খাবারের স্বর্গ।",
    icon: "beach",
    color: "from-cyan-600 to-blue-700",
    division: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
  },
  {
    name: "সুন্দরবন",
    desc: "পৃথিবীর বৃহত্তম ম্যানগ্রোভ বন — রয়েল বেঙ্গল টাইগারের আবাসস্থল।",
    icon: "forest",
    color: "from-emerald-700 to-green-900",
    division: "Khulna",
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
  },
  {
    name: "সিলেট",
    desc: "চা বাগান, হাওর ও ঝর্ণার দেশ — প্রকৃতির এক অনন্য রূপ।",
    icon: "landscape",
    color: "from-teal-600 to-emerald-800",
    division: "Sylhet",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    name: "বান্দরবান",
    desc: "মেঘের রাজ্যে পাহাড়ি ট্রেকিং — নীলগিরি, বগালেক ও নাফাখুম।",
    icon: "mountain",
    color: "from-violet-700 to-purple-900",
    division: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    name: "সেন্ট মার্টিন",
    desc: "বাংলাদেশের একমাত্র প্রবাল দ্বীপ — স্বচ্ছ নীল জল ও প্রবাল প্রাচীর।",
    icon: "beach",
    color: "from-sky-600 to-indigo-800",
    division: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  },
  {
    name: "রাঙামাটি",
    desc: "কাপ্তাই লেকের বুকে নৌকায় ভেসে পাহাড়ি জীবনের স্বাদ নিন।",
    icon: "landscape",
    color: "from-rose-700 to-pink-900",
    division: "Chittagong",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  },
];

const features = [
  {
    icon: <FaShieldAlt />,
    title: "100% Secure Booking",
    desc: "নিরাপদ পেমেন্ট গেটওয়ে",
  },
  { icon: <FaHeadset />, title: "24/7 Support", desc: "যেকোনো সময় সাহায্য" },
  { icon: <FaHotel />, title: "Premium Hotels", desc: "সেরা আবাসন নিশ্চিত" },
  {
    icon: <FaCar />,
    title: "Private Transport",
    desc: "এসি গাড়ি ও বাস সার্ভিস",
  },
];

// ── Helper Components ─────────────────────────────────────────────────────────

function DestIcon({ type }) {
  const cls = "text-2xl text-white";
  if (type === "beach") return <MdBeachAccess className={cls} />;
  if (type === "forest") return <MdForest className={cls} />;
  if (type === "mountain") return <MdFlight className={`${cls} rotate-45`} />;
  return <MdLandscape className={cls} />;
}

// ── DB Fetch ──────────────────────────────────────────────────────────────────

async function getFeaturedPackages() {
  try {
    await connectDB();
    const packages = await Package.find({ featured: true }).limit(6).lean();
    return JSON.parse(JSON.stringify(packages));
  } catch {
    return [];
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const packages = await getFeaturedPackages();

  return (
    <div className="overflow-x-hidden bg-slate-950 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* ── Hero ── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1920&q=80"
            alt="Explore Bangladesh"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-full px-6 py-2.5 text-xs md:text-sm font-black text-emerald-400 uppercase tracking-[0.2em] mb-8">
            <MdVerified className="text-lg" /> Bangladesh&apos;s #1 Premium
            Travel Partner
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tighter">
            Explore Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
              Dream Destination
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            কক্সবাজারের বালুকাবেলায় রিল্যাক্স করুন অথবা বান্দরবানের মেঘের
            রাজ্যে হারিয়ে যান।{" "}
            <span className="text-white font-bold">
              আমরা আপনার স্বপ্নের ভ্রমণ সাজিয়ে দিই।
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              href="/packages"
              className="group px-10 py-5 rounded-2xl bg-emerald-500 text-white font-black text-lg shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              Explore Packages
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3">
          <div className="w-[30px] h-[50px] rounded-full border-2 border-white/20 flex justify-center p-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative z-20 mt-16 max-w-6xl mx-auto px-4">
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300">
                {s.num}
              </div>
              <div className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Destinations ── */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-emerald-400 font-black text-sm uppercase tracking-[0.3em]">
                Destinations
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mt-4 leading-tight tracking-tighter">
                আপনার পরবর্তী <br />
                <span className="text-slate-500">অ্যাডভেঞ্চার বেছে নিন</span>
              </h2>
            </div>
            <Link
              href="/packages"
              className="text-slate-400 font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors text-lg"
            >
              সব প্যাকেজ দেখুন <FaArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <Link
                key={d.name}
                href={`/packages?division=${d.division}`}
                className="group relative h-[380px] rounded-[2.5rem] overflow-hidden hover:-translate-y-3 transition-all duration-500"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${d.color} opacity-70`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                    <DestIcon type={d.icon} />
                  </div>
                  <h3 className="font-black text-3xl mb-2 tracking-tighter">
                    {d.name}
                  </h3>
                  <p className="text-white/70 font-medium mb-5 leading-relaxed text-sm">
                    {d.desc}
                  </p>
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-emerald-300">
                    See Packages
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Packages ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-black text-sm uppercase tracking-[0.3em]">
              Featured
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4 tracking-tighter">
              Trending Packages
            </h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">
              সারা দেশের সেরা ডিলগুলো খুঁজে নিন এক জায়গায়।
            </p>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 font-bold">
              <MdLandscape className="text-6xl mx-auto mb-4 opacity-30" />
              <p>প্যাকেজ লোড হচ্ছে... ডেটাবেজ কানেক্ট করুন।</p>
            </div>
          )}

          <div className="text-center mt-14">
            <Link
              href="/packages"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-black hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300"
            >
              সব প্যাকেজ দেখুন <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">
              Our Features
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mt-6 mb-8 leading-tight tracking-tighter">
              কেন ট্রাভেলাররা <br />
              <span className="text-emerald-400">MK Travel</span> বেছে নেন?
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
              আমরা আপনাকে শুধু একটি টিকিট বা হোটেল দিই না — আমরা নিশ্চিত করি
              আপনার প্রতিটি মুহূর্ত যেন হয় স্পেশাল।
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 p-5 rounded-[1.5rem] bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm mb-1">
                      {f.title}
                    </h4>
                    <p className="text-slate-400 text-xs font-bold">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000"
              alt="Happy Travelers"
              className="relative rounded-[3rem] border border-slate-800 w-full object-cover"
            />
            <div className="absolute -bottom-8 -left-8 bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hidden md:block">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden"
                    >
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-black text-white leading-none">
                    5k+ Reviews
                  </p>
                  <div className="flex text-amber-400 text-xs mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 pb-32">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-slate-900/80 backdrop-blur-2xl border border-slate-800 overflow-hidden relative p-12 md:p-24 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              আজই শুরু করুন <br />
              <span className="text-emerald-400">আপনার স্বপ্নের যাত্রা</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
              Don&apos;t wait for the right moment. আপনার পছন্দের ট্যুর প্যাকেজ
              বুক করুন আজই।
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/packages"
                className="px-12 py-5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all duration-300 shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
              >
                Book Now
              </Link>
              <Link
                href="/contact"
                className="px-12 py-5 bg-slate-800 text-white font-black rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all"
              >
                Get Expert Advice
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
