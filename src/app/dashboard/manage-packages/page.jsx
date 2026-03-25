import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connect } from "@/lib/mongodb";
import ManagePackagesClient from "./ManagePackagesClient";

export const metadata = { title: "Manage Packages | Dashboard" };

export default async function ManagePackagesPage() {
  const session = await auth();
  if (!["admin", "moderator"].includes(session?.user?.role)) redirect("/dashboard/home");

  let packages = [];
  try {
    const col = await connect("packages");
    const pkgs = await col.find({}).sort({ createdAt: -1 }).toArray();
    packages = pkgs.map((p) => ({ ...p, _id: p._id.toString() }));
  } catch {}

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Packages</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">Manage Packages</h1>
        <p className="text-slate-500 font-bold mt-1 text-sm">{packages.length} total packages</p>
      </div>
      <ManagePackagesClient packages={packages} />
    </div>
  );
}
