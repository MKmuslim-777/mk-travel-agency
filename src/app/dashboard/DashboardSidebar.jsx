"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  MdHome, MdPerson, MdBookmark, MdFavorite, MdRateReview,
  MdPeople, MdInventory, MdAddBox, MdSettings, MdLogout,
  MdMenu, MdClose, MdListAlt, MdDashboard, MdOpenInNew,
} from "react-icons/md";
import { useState } from "react";

function getSidebarLinks(role) {
  const shared = [
    { href: "/dashboard/home",    label: "Overview",   icon: <MdDashboard size={18} /> },
    { href: "/dashboard/profile", label: "My Profile", icon: <MdPerson size={18} /> },
  ];
  const userLinks = [
    { href: "/dashboard/my-bookings", label: "My Bookings", icon: <MdBookmark size={18} />, divider: true, dividerLabel: "My Activity" },
    { href: "/dashboard/my-wishlist", label: "My Wishlist", icon: <MdFavorite size={18} /> },
    { href: "/dashboard/add-review",  label: "Add Review",  icon: <MdRateReview size={18} /> },
  ];
  const modLinks = [
    { href: "/dashboard/add-package",     label: "Add Package",     icon: <MdAddBox size={18} />,    divider: true, dividerLabel: "Management" },
    { href: "/dashboard/manage-packages", label: "Manage Packages", icon: <MdInventory size={18} /> },
    { href: "/dashboard/manage-reviews",  label: "Manage Reviews",  icon: <MdListAlt size={18} /> },
    { href: "/dashboard/all-bookings",    label: "All Bookings",    icon: <MdBookmark size={18} /> },
  ];
  const adminLinks = [
    { href: "/dashboard/manage-users",  label: "Manage Users",  icon: <MdPeople size={18} />,   divider: true, dividerLabel: "Admin" },
    { href: "/dashboard/site-settings", label: "Site Settings", icon: <MdSettings size={18} /> },
  ];

  if (role === "admin")     return [...shared, ...userLinks, ...modLinks, ...adminLinks];
  if (role === "moderator") return [...shared, ...userLinks, ...modLinks,
    { href: "/dashboard/manage-users", label: "Manage Users", icon: <MdPeople size={18} />, divider: true, dividerLabel: "Users" },
  ];
  return [...shared, ...userLinks];
}

const roleMeta = {
  admin:     { label: "Admin",     cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  moderator: { label: "Moderator", cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  user:      { label: "User",      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
};

function SidebarContent({ role, userName, userImage, pathname, onClose }) {
  const links = getSidebarLinks(role);
  const meta  = roleMeta[role] || roleMeta.user;

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-800/60">
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">MK</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">MK Travel</p>
            <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Agency</p>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3 bg-slate-800/40 rounded-2xl p-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-base overflow-hidden shrink-0">
            {userImage
              ? <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              : userName?.charAt(0)?.toUpperCase()
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-white text-sm truncate leading-tight">{userName}</p>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border inline-block mt-0.5 ${meta.cls}`}>
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <div key={link.href}>
              {link.divider && (
                <div className="pt-3 pb-1.5 px-2">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                    {link.dividerLabel}
                  </p>
                </div>
              )}
              <Link
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <span className={`shrink-0 ${active ? "text-emerald-400" : "text-slate-500"}`}>{link.icon}</span>
                <span className="truncate">{link.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-slate-800/60 space-y-1">
        <Link href="/" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
          <MdHome size={18} className="text-slate-500 shrink-0" />
          <span>Go to Home</span>
          <MdOpenInNew size={14} className="ml-auto text-slate-600" />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <MdLogout size={18} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardSidebar({ role, userName, userImage }) {
  const pathname    = usePathname();
  const [open, setOpen] = useState(false);

  const props = { role, userName, userImage, pathname, onClose: () => setOpen(false) };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-slate-900 border-r border-slate-800/60 h-screen sticky top-0 overflow-hidden">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[150] bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-black text-xs">MK</span>
          </div>
          <span className="text-white font-black text-sm">Dashboard</span>
        </Link>
        <button onClick={() => setOpen(!open)}
          className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-[140] transition-all duration-300 ${open ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside className={`absolute top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 pt-14 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <SidebarContent {...props} />
        </aside>
      </div>
    </>
  );
}
