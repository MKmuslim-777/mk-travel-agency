import { auth } from "@/lib/auth";
import { connect } from "@/lib/mongodb";
import {
  MdFlight, MdConfirmationNumber, MdPending, MdAttachMoney,
  MdRateReview, MdFavorite, MdInventory, MdPeople, MdBookmark,
} from "react-icons/md";
import Link from "next/link";
import AdminCharts from "./AdminCharts";

async function getUserStats(userId) {
  const [bookingsCol, reviewsCol, wishlistCol] = await Promise.all([
    connect("bookings"), connect("reviews"), connect("wishlists"),
  ]);
  const [bookings, reviews, wishlist] = await Promise.all([
    bookingsCol.find({ userId }).toArray(),
    reviewsCol.find({ userId }).toArray(),
    wishlistCol.find({ userId }).toArray(),
  ]);
  const totalSpent = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  return {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    totalSpent,
    reviews:  reviews.length,
    wishlist: wishlist.length,
  };
}

async function getSiteStats() {
  const [pkgCol, bookingCol, userCol] = await Promise.all([
    connect("packages"), connect("bookings"), connect("users"),
  ]);
  const [pkgCount, bookings, userCount] = await Promise.all([
    pkgCol.countDocuments(),
    bookingCol.find({}).toArray(),
    userCol.countDocuments(),
  ]);
  const revenue  = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const pending  = bookings.filter((b) => b.status === "pending").length;
  return { packages: pkgCount, bookings: bookings.length, users: userCount, revenue, pending, rawBookings: bookings };
}

export const metadata = { title: "Overview | Dashboard" };

export default async function DashboardHomePage() {
  const session = await auth();
  const role    = session?.user?.role ?? "user";
  const isStaff = role === "admin" || role === "moderator";

  let userStats = { total: 0, confirmed: 0, pending: 0, totalSpent: 0, reviews: 0, wishlist: 0 };
  let siteStats = { packages: 0, bookings: 0, users: 0, revenue: 0, pending: 0 };

  try {
    userStats = await getUserStats(session.user.id);
    if (isStaff) siteStats = await getSiteStats();
  } catch {}

  const personalCards = [
    { icon: <MdFlight className="text-2xl text-emerald-400" />,          label: "My Trips",     value: userStats.total,                             bg: "bg-emerald-500/10 border-emerald-500/20", href: "/dashboard/my-bookings" },
    { icon: <MdConfirmationNumber className="text-2xl text-blue-400" />, label: "Confirmed",    value: userStats.confirmed,                         bg: "bg-blue-500/10 border-blue-500/20",       href: "/dashboard/my-bookings" },
    { icon: <MdPending className="text-2xl text-amber-400" />,           label: "Pending",      value: userStats.pending,                           bg: "bg-amber-500/10 border-amber-500/20",     href: "/dashboard/my-bookings" },
    { icon: <MdAttachMoney className="text-2xl text-purple-400" />,      label: "Total Spent",  value: `৳${userStats.totalSpent.toLocaleString()}`, bg: "bg-purple-500/10 border-purple-500/20",   href: "/dashboard/my-bookings" },
    { icon: <MdRateReview className="text-2xl text-rose-400" />,         label: "My Reviews",   value: userStats.reviews,                           bg: "bg-rose-500/10 border-rose-500/20",       href: "/dashboard/add-review" },
    { icon: <MdFavorite className="text-2xl text-pink-400" />,           label: "Wishlist",     value: userStats.wishlist,                          bg: "bg-pink-500/10 border-pink-500/20",       href: "/dashboard/my-wishlist" },
  ];

  const siteCards = [
    { icon: <MdInventory className="text-2xl text-emerald-400" />,  label: "Total Packages", value: siteStats.packages,                        bg: "bg-emerald-500/10 border-emerald-500/20", href: "/dashboard/manage-packages" },
    { icon: <MdBookmark className="text-2xl text-blue-400" />,      label: "Total Bookings", value: siteStats.bookings,                        bg: "bg-blue-500/10 border-blue-500/20",       href: "/dashboard/all-bookings" },
    { icon: <MdPending className="text-2xl text-amber-400" />,      label: "Pending",        value: siteStats.pending,                         bg: "bg-amber-500/10 border-amber-500/20",     href: "/dashboard/all-bookings" },
    { icon: <MdAttachMoney className="text-2xl text-purple-400" />, label: "Total Revenue",  value: `৳${siteStats.revenue.toLocaleString()}`,  bg: "bg-purple-500/10 border-purple-500/20",   href: "/dashboard/all-bookings" },
    { icon: <MdPeople className="text-2xl text-rose-400" />,        label: "Total Users",    value: siteStats.users,                           bg: "bg-rose-500/10 border-rose-500/20",       href: role === "admin" ? "/dashboard/manage-users" : "/dashboard/home" },
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Overview</span>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mt-1">
          Welcome back, <span className="text-emerald-400">{session.user.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-slate-500 font-bold mt-1 text-sm">এখানে আপনার সব তথ্য একনজরে দেখুন।</p>
      </div>

      {/* Charts — admin only */}
      {role === "admin" && (
        <div className="mb-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">
            Analytics
          </p>
          <AdminCharts
            bookings={siteStats.rawBookings || []}
            userName={session.user.name}
            userImage={session.user.image ?? null}
            role={role}
          />
        </div>
      )}

      {/* Site stats — admin/mod only */}
      {isStaff && (
        <div className="mb-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">
            Site Statistics
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {siteCards.map((c) => (
              <Link key={c.label} href={c.href}
                className={`bg-slate-900/80 border rounded-2xl p-4 hover:scale-[1.02] transition-transform ${c.bg}`}>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${c.bg}`}>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-white">{c.value}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{c.label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Personal stats */}
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3">
          My Activity
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {personalCards.map((c) => (
            <Link key={c.label} href={c.href}
              className={`bg-slate-900/80 border rounded-2xl p-5 hover:scale-[1.02] transition-transform ${c.bg}`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${c.bg}`}>
                {c.icon}
              </div>
              <p className="text-2xl font-black text-white">{c.value}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{c.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
