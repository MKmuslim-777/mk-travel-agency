import { connect } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingForm from "./BookingForm";
import ReviewForm from "./ReviewForm";
import {
  FaStar, FaClock, FaMapMarkerAlt, FaCheck, FaTimes,
  FaArrowLeft, FaUsers, FaBolt, FaShareAlt,
} from "react-icons/fa";
import { MdVerified, MdLandscape } from "react-icons/md";

// Serialize ObjectId fields so they can be passed as props
function serialize(doc) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

async function getPackage(id) {
  try {
    const col = await connect("packages");
    const pkg = await col.findOne({ _id: new ObjectId(id) });
    return serialize(pkg);
  } catch {
    return null;
  }
}

async function getSimilar(category, currentId) {
  try {
    const col = await connect("packages");
    const pkgs = await col
      .find({ category, _id: { $ne: new ObjectId(currentId) } })
      .limit(3)
      .toArray();
    return serialize(pkgs);
  } catch {
    return [];
  }
}

async function getReviews(packageId) {
  try {
    const col = await connect("reviews");
    const reviews = await col.find({ packageId, published: true }).sort({ createdAt: -1 }).toArray();
    return serialize(reviews);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pkg = await getPackage(id);
  if (!pkg) return { title: "Package Not Found | MK Travel" };
  const url = `https://mk-travel-agency.vercel.app/packages/${id}`;
  const img = pkg.image || "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80";
  return {
    title: `${pkg.title} | MK Travel Agency`,
    description: pkg.description?.slice(0, 155) || `${pkg.destination} ট্যুর প্যাকেজ — ${pkg.duration} — ৳${pkg.price?.toLocaleString()} থেকে শুরু।`,
    keywords: [pkg.title, pkg.destination, "ট্যুর প্যাকেজ", "bangladesh tour", pkg.category],
    alternates: { canonical: url },
    openGraph: {
      title: `${pkg.title} | MK Travel Agency`,
      description: pkg.description?.slice(0, 155),
      url,
      type: "article",
      images: [{ url: img, width: 1200, height: 630, alt: pkg.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: pkg.title,
      description: pkg.description?.slice(0, 155),
      images: [img],
    },
  };
}

export default async function PackageDetailPage({ params }) {
  const { id } = await params;
  const pkg = await getPackage(id);
  if (!pkg) notFound();

  const similar = await getSimilar(pkg.category, id);
  const reviews = await getReviews(id);

  // Fallback gallery from main image
  const gallery = pkg.gallery?.length > 0
    ? pkg.gallery
    : [pkg.image, pkg.image, pkg.image];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: pkg.title,
          description: pkg.description,
          image: pkg.gallery?.length ? pkg.gallery : [pkg.image],
          offers: {
            "@type": "Offer",
            price: pkg.price,
            priceCurrency: "BDT",
            availability: "https://schema.org/InStock",
            url: `https://mk-travel-agency.vercel.app/packages/${pkg._id}`,
          },
          aggregateRating: reviews.length > 0 ? {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          } : undefined,
          brand: { "@type": "Brand", name: "MK Travel Agency" },
        })}}
      />

      {/* ── Hero ── */}
      <div className="relative h-[65vh] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950" />

        {/* Back button */}
        <div className="absolute top-24 left-4 md:left-8 z-10">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-black px-5 py-2.5 rounded-2xl hover:bg-white/20 transition-all"
          >
            <FaArrowLeft className="text-xs" /> সব প্যাকেজ
          </Link>
        </div>

        {/* Flash deal badge */}
        {pkg.isFlashDeal && (
          <div className="absolute top-24 right-4 md:right-8 z-10">
            <span className="flex items-center gap-1.5 bg-rose-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full animate-pulse">
              <FaBolt /> Flash Deal
            </span>
          </div>
        )}

        {/* Hero title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                {pkg.category}
              </span>
              {pkg.featured && (
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1">
                  <MdVerified /> Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight max-w-3xl">
              {pkg.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <FaMapMarkerAlt className="text-emerald-400" />, label: "গন্তব্য", value: pkg.destination },
                { icon: <FaClock className="text-emerald-400" />, label: "সময়কাল", value: pkg.duration },
                { icon: <FaStar className="text-amber-400" />, label: "রেটিং", value: `${pkg.rating} / 5` },
                { icon: <FaUsers className="text-emerald-400" />, label: "গ্রুপ সাইজ", value: `সর্বোচ্চ ${pkg.maxGroupSize || 15}` },
              ].map((s) => (
                <div key={s.label} className="bg-slate-900/80 border border-slate-800 rounded-[1.5rem] p-4 text-center">
                  <div className="flex justify-center mb-2 text-lg">{s.icon}</div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-white font-black text-sm">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter mb-4">প্যাকেজ বিবরণ</h2>
              <p className="text-slate-400 leading-relaxed font-medium">{pkg.description}</p>
            </div>

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8">
                <h2 className="text-2xl font-black text-white tracking-tighter mb-6">হাইলাইটস</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-4 py-3">
                      <span className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center shrink-0">
                        <FaCheck className="text-emerald-400 text-[10px]" />
                      </span>
                      <span className="text-slate-300 font-bold text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-6">দিনওয়ারি পরিকল্পনা</h2>
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="flex gap-4">
                      {/* Day number */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <span className="text-emerald-400 font-black text-sm">{day.day}</span>
                        </div>
                        <div className="w-px flex-1 bg-slate-800 mt-2" />
                      </div>
                      {/* Content */}
                      <div className="bg-slate-900/80 border border-slate-800 rounded-[1.5rem] p-5 flex-1 mb-4">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                          Day {day.day}
                        </p>
                        <h3 className="text-white font-black mb-2">{day.title}</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Includes / Excludes */}
            <div className="grid sm:grid-cols-2 gap-6">
              {pkg.includes?.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6">
                  <h3 className="text-lg font-black text-white tracking-tighter mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <FaCheck className="text-emerald-400 text-[10px]" />
                    </span>
                    অন্তর্ভুক্ত
                  </h3>
                  <ul className="space-y-2.5">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                        <FaCheck className="text-emerald-400 text-[10px] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.excludes?.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6">
                  <h3 className="text-lg font-black text-white tracking-tighter mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-rose-500/20 rounded-lg flex items-center justify-center">
                      <FaTimes className="text-rose-400 text-[10px]" />
                    </span>
                    অন্তর্ভুক্ত নয়
                  </h3>
                  <ul className="space-y-2.5">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                        <FaTimes className="text-rose-400 text-[10px] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-6">গ্যালারি</h2>
                <div className="grid grid-cols-3 gap-3">
                  {gallery.slice(0, 6).map((img, i) => (
                    <div key={i} className={`rounded-[1.5rem] overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-[1.5rem]">
              <FaShareAlt className="text-slate-400 text-lg shrink-0" />
              <p className="text-slate-400 font-bold text-sm flex-1">এই প্যাকেজটি বন্ধুদের সাথে শেয়ার করুন</p>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`MK Travel Agency — ${pkg.title}\n${pkg.destination} | ${pkg.duration}\n৳${pkg.price?.toLocaleString()}\n\nhttps://mk-travel-agency.vercel.app/packages/${pkg._id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs rounded-xl transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* ── Right Column — Booking Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-6 sticky top-24 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  প্রতি জন মূল্য
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-emerald-400">
                    ৳{pkg.price?.toLocaleString()}
                  </p>
                  {pkg.oldPrice && (
                    <p className="text-slate-500 line-through font-bold text-sm">
                      ৳{pkg.oldPrice?.toLocaleString()}
                    </p>
                  )}
                </div>
                {pkg.oldPrice && (
                  <p className="text-emerald-400 text-xs font-black mt-1">
                    ৳{(pkg.oldPrice - pkg.price).toLocaleString()} সাশ্রয়!
                  </p>
                )}
              </div>

              <BookingForm packageId={pkg._id} pricePerPerson={pkg.price} />

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
                {["নিরাপদ পেমেন্ট", "বিনামূল্যে বাতিল (৪৮ ঘণ্টা আগে)", "২৪/৭ সাপোর্ট"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <FaCheck className="text-emerald-500 text-[10px]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Customer Reviews ── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white tracking-tighter">
              Customer Reviews
            </h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
                <FaStar className="text-amber-400" />
                <span className="text-amber-400 font-black text-sm">
                  {(reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)}
                </span>
                <span className="text-slate-500 font-bold text-xs">({reviews.length} reviews)</span>
              </div>
            )}
          </div>

          {/* Write a review */}
          <div className="mb-8">
            <ReviewForm packageId={pkg._id} />
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-[2rem]">
              <p className="text-4xl mb-4">💬</p>
              <p className="text-slate-400 font-bold">এখনো কোনো রিভিউ নেই।</p>
              <p className="text-slate-600 text-sm font-bold mt-1">ভ্রমণ শেষে আপনার অভিজ্ঞতা শেয়ার করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 hover:border-emerald-500/20 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-base overflow-hidden shrink-0">
                      {r.userImage
                        ? <img src={r.userImage} alt={r.userName} className="w-full h-full object-cover" />
                        : r.userName?.charAt(0)?.toUpperCase()
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white text-sm">{r.userName}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar key={i} className={`text-xs ${i < (r.rating || 5) ? "text-amber-400" : "text-slate-700"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-bold shrink-0">
                      {new Date(r.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Similar Packages ── */}
        {similar.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-8">
              একই ধরনের প্যাকেজ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((s) => (
                <Link
                  key={s._id}
                  href={`/packages/${s._id}`}
                  className="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <MdLandscape className="text-5xl text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-black tracking-tight line-clamp-1 mb-1">
                      {s.title}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold mb-3">
                      {s.destination} · {s.duration}
                    </p>
                    <p className="text-emerald-400 font-black">
                      ৳{s.price?.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
