import { connectDB } from "@/lib/mongodb";
import Package from "@/models/Package";
import { notFound } from "next/navigation";
import { FaStar, FaClock, FaMapMarkerAlt, FaCheck, FaArrowLeft } from "react-icons/fa";
import BookingForm from "./BookingForm";
import Link from "next/link";

async function getPackage(id) {
  await connectDB();
  const pkg = await Package.findById(id).lean();
  if (!pkg) return null;
  return JSON.parse(JSON.stringify(pkg));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const pkg = await getPackage(id);
    return { title: `${pkg?.title} | MK Travel` };
  } catch { return { title: "Package | MK Travel" }; }
}

export default async function PackageDetailPage({ params }) {
  const { id } = await params;
  let pkg = null;
  try { pkg = await getPackage(id); } catch { notFound(); }
  if (!pkg) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950" />
        <div className="absolute top-24 left-4 md:left-8">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-black px-5 py-2.5 rounded-2xl hover:bg-white/20 transition-all"
          >
            <FaArrowLeft className="text-xs" /> Back
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                {pkg.category}
              </span>
              {pkg.featured && (
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
              {pkg.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-800">
              {[
                { icon: <FaMapMarkerAlt className="text-emerald-400" />, text: pkg.destination },
                { icon: <FaClock className="text-emerald-400" />, text: pkg.duration },
                { icon: <FaStar className="text-amber-400" />, text: `${pkg.rating} / 5` },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  {m.icon} {m.text}
                </div>
              ))}
            </div>

            <p className="text-slate-400 leading-relaxed font-medium mb-10">{pkg.description}</p>

            {/* Includes */}
            {pkg.includes?.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8">
                <h2 className="text-xl font-black text-white tracking-tighter mb-6">What&apos;s Included</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                      <span className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <FaCheck className="text-emerald-400 text-[10px]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right — Booking */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-6 sticky top-24 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
              <div className="mb-6 pb-6 border-b border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Price Per Person</p>
                <p className="text-4xl font-black text-emerald-400">৳{pkg.price.toLocaleString()}</p>
              </div>
              <BookingForm packageId={pkg._id} pricePerPerson={pkg.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
