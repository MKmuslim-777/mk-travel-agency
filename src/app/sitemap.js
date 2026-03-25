import { connect } from "@/lib/mongodb";

const BASE = "https://mk-travel-agency.vercel.app";

export default async function sitemap() {
  const staticRoutes = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/packages`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/destinations`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  let packageRoutes = [];
  try {
    const col  = await connect("packages");
    const pkgs = await col.find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray();
    packageRoutes = pkgs.map((p) => ({
      url:             `${BASE}/packages/${p._id.toString()}`,
      lastModified:    p.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority:        0.8,
    }));
  } catch {}

  return [...staticRoutes, ...packageRoutes];
}
