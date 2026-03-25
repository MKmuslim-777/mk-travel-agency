import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connect } from "@/lib/mongodb";
import AdminUserTable from "@/app/admin/AdminUserTable";

export const metadata = { title: "Manage Users | Dashboard" };

export default async function ManageUsersPage() {
  const session = await auth();
  if (!["admin", "moderator"].includes(session?.user?.role)) redirect("/dashboard/home");

  let users = [];
  try {
    const col = await connect("users");
    const raw = await col.find({}, { projection: { password: 0 } }).sort({ createdAt: -1 }).toArray();
    users = raw.map((u) => ({ ...u, _id: u._id.toString() }));
  } catch {}

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <span className="text-amber-400 font-black text-xs uppercase tracking-[0.3em]">Admin</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">Manage Users</h1>
        <p className="text-slate-500 font-bold mt-1 text-sm">{users.length} total users</p>
      </div>
      <AdminUserTable users={users} currentUserId={session.user.id} />
    </div>
  );
}
