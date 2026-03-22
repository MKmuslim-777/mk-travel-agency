import { connectDB } from "@/lib/mongodb";
import Package from "@/models/Package";
import PackageCard from "@/components/PackageCard";
import PackageFilters from "./PackageFilters";

async function getPackages(category) {
  await connectDB();
  const query = category ? { category } : {};
  const packages = await Package.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(packages));
}

export const metadata = { title: "Tour Packages | MK Travel Agency" };

export default async function PackagesPage({ searchParams }) {
  const { category } = await searchParams;
  let packages = [];
  try { packages = await getPackages(category); } catch { /* DB not connected */ }

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
        {/* Filters */}
        <PackageFilters active={category} />

        {packages.length > 0 ? (
          <>
            <p className="text-slate-600 text-xs font-black uppercase tracking-widest mt-8 mb-6">
              {packages.length} Packages Found
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
            <p className="text-2xl font-black text-slate-400 tracking-tighter">No Packages Found</p>
            <p className="text-slate-600 font-bold mt-2 text-sm">Try a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
