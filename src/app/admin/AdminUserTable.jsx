"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdPerson, MdAdminPanelSettings, MdSupervisorAccount } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const ROLES = [
  { value: "admin",     label: "Admin",     icon: <MdAdminPanelSettings />, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "moderator", label: "Moderator", icon: <MdSupervisorAccount />,  color: "text-blue-400 bg-blue-500/10 border-blue-500/20"   },
  { value: "user",      label: "User",      icon: <MdPerson />,             color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
];

function RoleBadge({ role }) {
  const r = ROLES.find((x) => x.value === role) || ROLES[2];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${r.color}`}>
      {r.icon} {r.label}
    </span>
  );
}

export default function AdminUserTable({ users, currentUserId }) {
  const router = useRouter();
  const [updating, setUpdating]     = useState(null);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = useMemo(() => users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchR = roleFilter === "all" || (u.role || "user") === roleFilter;
    return matchQ && matchR;
  }), [users, search, roleFilter]);

  async function handleRoleChange(userId, newRole, userName) {
    if (newRole === "admin") {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-sm"><span className="font-black">"{userName}"</span>-কে Admin বানাবেন?</p>
          <p className="text-xs text-gray-500">Admin সব কিছু নিয়ন্ত্রণ করতে পারবে।</p>
          <div className="flex gap-2">
            <button onClick={async () => { toast.dismiss(t.id); await doRoleUpdate(userId, newRole); }}
              className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-black rounded-xl">হ্যাঁ, করুন</button>
            <button onClick={() => toast.dismiss(t.id)} className="flex-1 py-2 bg-slate-200 text-slate-700 text-xs font-black rounded-xl">বাতিল</button>
          </div>
        </div>
      ), { duration: 10000 });
      return;
    }
    await doRoleUpdate(userId, newRole);
  }

  async function doRoleUpdate(userId, role) {
    setUpdating(userId);
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    setUpdating(null);
    if (res.ok) { toast.success("Role আপডেট হয়েছে।"); router.refresh(); }
    else toast.error("আপডেট ব্যর্থ হয়েছে।");
  }

  return (
    <>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-slate-900/80 border border-slate-800 text-white placeholder-slate-600 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-900/80 border border-slate-800 text-white rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors">
          <option value="all" className="bg-slate-900">All Roles</option>
          {ROLES.map((r) => <option key={r.value} value={r.value} className="bg-slate-900">{r.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-700 rounded-[2rem]">
          <p className="text-slate-500 font-black text-sm uppercase tracking-widest">No users found</p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filtered.length} users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["User", "Email", "Current Role", "Change Role", "Joined", ""].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm overflow-hidden">
                          {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-black text-white text-sm max-w-[120px] truncate">
                          {user.name}
                          {user._id === currentUserId && (
                            <span className="ml-1.5 text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">You</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-bold text-sm max-w-[160px] truncate">{user.email}</td>
                    <td className="px-6 py-4"><RoleBadge role={user.role || "user"} /></td>
                    <td className="px-6 py-4">
                      {user._id === currentUserId ? (
                        <span className="text-slate-600 text-xs font-bold">নিজের role পরিবর্তন করা যাবে না</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {updating === user._id ? (
                            <span className="loading loading-spinner loading-xs text-emerald-400" />
                          ) : ROLES.map((r) => (
                            <button key={r.value} onClick={() => handleRoleChange(user._id, r.value, user.name)}
                              disabled={(user.role || "user") === r.value}
                              className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl border transition-all ${
                                (user.role || "user") === r.value ? `${r.color} cursor-default` : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                              }`}>
                              {r.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-bold text-xs whitespace-nowrap">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("bn-BD") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/manage-users/${user._id}`}
                        className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-all whitespace-nowrap">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
