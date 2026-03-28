"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MdFlight, MdMenu, MdClose, MdDashboard,
  MdLogout, MdKeyboardArrowDown,
  MdInventory, MdBookmark, MdPeople, MdRateReview,
} from "react-icons/md";
import { FaHome, FaBoxOpen, FaMapMarkedAlt, FaInfoCircle, FaPhoneAlt } from "react-icons/fa";

const navLinks = [
  { href: "/",            label: "Home",         icon: <FaHome /> },
  { href: "/packages",    label: "Packages",     icon: <FaBoxOpen /> },
  { href: "/destinations",label: "Destinations", icon: <FaMapMarkedAlt /> },
  { href: "/about",       label: "About",        icon: <FaInfoCircle /> },
  { href: "/contact",     label: "Contact",      icon: <FaPhoneAlt /> },
];

// role অনুযায়ী dropdown মেনু আইটেম
function getUserMenuItems(role) {
  const common = [
    { href: "/dashboard/home",        label: "Dashboard",   icon: <MdDashboard size={18} /> },
    { href: "/dashboard/my-bookings", label: "My Bookings", icon: <MdBookmark size={18} /> },
  ];
  const adminItems = [
    { href: "/dashboard/manage-users",    label: "Manage Users",    icon: <MdPeople size={18} />,            highlight: true },
    { href: "/dashboard/all-bookings",    label: "All Bookings",    icon: <MdBookmark size={18} /> },
    { href: "/dashboard/manage-packages", label: "Packages",        icon: <MdInventory size={18} /> },
  ];
  const modItems = [
    { href: "/dashboard/manage-packages", label: "Manage Packages", icon: <MdInventory size={18} />,         highlight: true },
    { href: "/dashboard/manage-reviews",  label: "Manage Reviews",  icon: <MdRateReview size={18} /> },
  ];
  if (role === "admin")     return [...adminItems, ...common];
  if (role === "moderator") return [...modItems,   ...common];
  return common;
}

export default function Navbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const role = session?.user?.role ?? "user";
  const menuItems = getUserMenuItems(role);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 px-6 py-2.5 flex items-center justify-between border ${
            scrolled
              ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-white/20 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
              : "bg-white/70 dark:bg-slate-800/40 backdrop-blur-md border-white/30 dark:border-slate-700 shadow-sm"
          }`}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-slate-900 dark:bg-emerald-500 flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] shadow-lg shadow-slate-900/20">
              <MdFlight className="text-xl md:text-2xl text-emerald-400 dark:text-slate-900 rotate-45" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">MK Travel</p>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-600 dark:text-emerald-400">Agency</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center bg-slate-200/30 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                    active
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md translate-y-[-1px]"
                      : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  <span className={`text-sm ${active ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}`}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right — Auth */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-3">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full transition-all border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black overflow-hidden uppercase">
                      {session.user?.image
                        ? <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                        : session.user?.name?.charAt(0)
                      }
                    </div>
                    <span className="text-sm font-bold truncate max-w-[80px]">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                    {/* role badge */}
                    {(role === "admin" || role === "moderator") && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        role === "admin"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}>
                        {role}
                      </span>
                    )}
                    <MdKeyboardArrowDown className={`transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+12px)] w-64 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
                      {/* User info */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] mb-2 text-center">
                        <p className="text-sm font-black text-slate-800 dark:text-white truncate">{session.user?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate">{session.user?.email}</p>
                        <span className={`inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          role === "admin"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : role === "moderator"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {role}
                        </span>
                      </div>

                      {/* Role-based menu items */}
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                            item.highlight
                              ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                              : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600"
                          }`}
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <MdLogout size={18} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="bg-slate-900 dark:bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black px-6 py-2.5 rounded-xl shadow-lg transition-all active:scale-95">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-900 flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-slate-900/20"
            >
              {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${menuOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 ease-out p-6 flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">MENU</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400"
            >
              <MdClose size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  pathname === link.href
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <span className="text-xl">{link.icon}</span> {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
            {session ? (
              <div className="space-y-3">
                {/* User card */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {session.user?.image
                      ? <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                      : session.user?.name?.charAt(0)
                    }
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="font-black text-slate-900 dark:text-white truncate">{session.user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                    role === "admin"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {role}
                  </span>
                </div>

                {/* Role-based links */}
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      item.highlight
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}

                <button
                  onClick={() => signOut()}
                  className="w-full py-4 font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-2xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/login" className="py-4 text-center font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                  Login
                </Link>
                <Link href="/register" className="py-4 text-center font-bold text-white bg-emerald-500 rounded-2xl shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
