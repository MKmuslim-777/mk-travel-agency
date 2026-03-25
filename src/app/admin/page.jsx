import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connect } from "@/lib/mongodb";
import AdminPackageTable from "./AdminPackageTable";
import AdminUserTable from "./AdminUserTable";
import AddPackageModal from "./AddPackageModal";
import { MdInventory, MdBookmark, MdPeople, MdAttachMoney } from "react-icons/md";

async function getStats() {
  const [pkgCol, bookingCol, userCol] = await Promise.all([
    connect("packages"),
    connect("bookings"),
    connect("users"),
  ]);
  const [pkgCount, bookings, userCount] = await Promise.all([
    pkgCol.countDocuments(),
    bookingCol.find({}).toArray(),
    userCol.countDocuments(),
  ]);
  const revenue = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  return { packages: pkgCount, bookings: bookings.length, users: userCount, revenue };
}

async function getAllPackages() {
  const col = await connect("packages");
  const pkgs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return pkgs.map((p) => ({ ...p, _id: p._id.toString() }));
}

async function getAllUsers() {
  const col = await connect("users");
  const users = await col
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return users.map((u) => ({ ...u, _id: u._id.toString() }));
}

export const metadata = { title: "Admin Panel | MK Travel" };

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");
  // moderator এর নিজস্ব panel আছে
  if (session.user.role === "moderator") redirect("/moderator");
  if (session.user.role !== "admin") redirect("/");

  let stats = { packages: 0, bookings: 0, users: 0, revenue: 0 };
  let packages = [];
  let users = [];
  try {
    const results = await Promise.all([
      getStats(),
      getAllPackages(),
      getAllUsers(),
    ]);
    stats = results[0];
    packages = results[1];
    users = results[2];
  } catch (e) {
    console.error("Admin DB error:", e);
  }

  const statCards = [
    { icon: <MdInventory className="text-2xl text-emerald-400" />,  label: "Packages", value: stats.packages,                       bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: <MdBookmark  className="text-2xl text-blue-400"    />,  label: "Bookings", value: stats.bookings,                       bg: "bg-blue-500/10 border-blue-500/20"       },
    { icon: <MdPeople    className="text-2xl text-amber-400"   />,  label: "Users",    value: stats.users,                          bg: "bg-amber-500/10 border-amber-500/20"     },
    { icon: <MdAttachMoney className="text-2xl text-purple-400"/>,  label: "Revenue",  value: `৳${stats.revenue.toLocaleString()}`, bg: "bg-purple-500/10 border-purple-500/20"   },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.06)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex items-end justify-between flex-wrap gap-6">
          <div>
            <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">
              Admin
            </span>
            <h1 className="text-5xl font-black text-white tracking-tighter mt-2">Control Panel</h1>
            <p className="text-slate-500 font-bold mt-1 text-sm">Manage packages, bookings & users</p>
          </div>
          <AddPackageModal />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className={`bg-slate-900/80 border rounded-[2rem] p-6 ${s.bg}`}>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${s.bg}`}>
                {s.icon}
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Packages Table */}
        <div id="packages">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white tracking-tighter">All Packages</h2>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{packages.length} total</span>
          </div>
          <AdminPackageTable packages={packages} />
        </div>

        {/* User Management */}
        <div id="users">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white tracking-tighter">User Management</h2>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{users.length} total</span>
          </div>
          <AdminUserTable users={users} currentUserId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
