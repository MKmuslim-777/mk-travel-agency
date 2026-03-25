import { connect } from "@/lib/mongodb";
import PackageCard from "@/components/PackageCard";
import PackageFilters from "./PackageFilters";

async function getPackages(category, q) {
  const query = {};
  if (category) query.category = category;
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { destination: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }
  const col = await connect("packages");
  const pkgs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return JSON.parse(JSON.stringify(pkgs));
}

export const metadata = {
  title: "Tour Packages | MK Travel Agency",
  description: "বাংলাদেশের সেরা ট্যুর প্যাকেজ। কক্সবাজার, সুন্দরবন, সিলেট, বান্দরবান, সেন্ট মার্টিন ও রাঙামাটি — সব গন্তব্যের প্যাকেজ এক জায়গায়।",
  alternates: { canonical: "https://mk-travel-agency.vercel.app/packages" },
  openGraph: {
    title: "Tour Packages | MK Travel Agency",
    description: "বাংলাদেশের সেরা ট্যুর প্যাকেজ এক জায়গায়।",
    url: "https://mk-travel-agency.vercel.app/packages",
    images: [{ url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80", width: 1200, height: 630 }],
  },
};

export default async function PackagesPage({ searchParams }) {
  const { category, q } = await searchParams;
  let packages = [];
  try { packages = await getPackages(category, q); } catch { /* DB not connected */ }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <span className="inline-block text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-4">
          Explore Bangladesh
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
          All Packages
        </h1>
        <p className="text-slate-400 font-bold max-w-lg mx-auto">
          সারা বাংলাদেশের সেরা ট্যুর প্যাকেজ এক জায়গায়।
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        {/* Filters + Search */}
        <PackageFilters active={category} />

        {packages.length > 0 ? (
          <>
            <p className="text-slate-600 text-xs font-black uppercase tracking-widest mt-8 mb-6">
              {packages.length} Packages Found
              {q && <span className="text-emerald-600 ml-2">— "{q}"</span>}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32">
            <p className="text-6xl mb-6">🌿</p>
            <p className="text-2xl font-black text-slate-400 tracking-tighter">
              {q ? `"${q}" — কোনো প্যাকেজ পাওয়া যায়নি` : "No Packages Found"}
            </p>
            <p className="text-slate-600 font-bold mt-2 text-sm">
              {q ? "অন্য কিছু দিয়ে খোঁজার চেষ্টা করুন" : "Try a different category"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
