import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Link from "next/link";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import { MdFlight, MdConfirmationNumber, MdPending, MdAttachMoney } from "react-icons/md";

async function getUserBookings(userId) {
  await connectDB();
  const bookings = await Booking.find({ user: userId })
    .populate("package", "title destination image price duration")
    .sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(bookings));
}

const statusMap = {
  pending:   { label: "Pending",   cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  cancelled: { label: "Cancelled", cls: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
};

export const metadata = { title: "Dashboard | MK Travel" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  let bookings = [];
  try { bookings = await getUserBookings(session.user.id); } catch { /* DB */ }

  const totalSpent = bookings.reduce((s, b) => s + b.totalPrice, 0);

  const stats = [
    { icon: <MdFlight className="text-2xl text-emerald-400" />, label: "Total Trips", value: bookings.length, bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: <MdConfirmationNumber className="text-2xl text-blue-400" />, label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: <MdPending className="text-2xl text-amber-400" />, label: "Pending", value: bookings.filter(b => b.status === "pending").length, bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: <MdAttachMoney className="text-2xl text-purple-400" />, label: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, bg: "bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Dashboard</span>
          <h1 className="text-5xl font-black text-white tracking-tighter mt-2">My Bookings</h1>
          <p className="text-slate-400 font-bold mt-2">
            Welcome back, <span className="text-emerald-400">{session.user.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-24">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className={`bg-slate-900/80 border rounded-[2rem] p-6 ${s.bg}`}>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${s.bg}`}>
                {s.icon}
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <h2 className="text-2xl font-black text-white tracking-tighter mb-6">Recent Bookings</h2>

        {bookings.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/50 border border-slate-800 rounded-[2.5rem]">
            <p className="text-6xl mb-6">✈️</p>
            <p className="text-2xl font-black text-slate-400 tracking-tighter">No Bookings Yet</p>
            <p className="text-slate-600 font-bold mt-2 text-sm">আমাদের প্যাকেজ দেখুন এবং ভ্রমণ শুরু করুন!</p>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all"
            >
              Explore Packages <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-5 hover:border-emerald-500/20 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-32 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={booking.package?.image} alt={booking.package?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <h3 className="font-black text-white text-lg tracking-tight truncate">{booking.package?.title}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shrink-0 ${statusMap[booking.status]?.cls}`}>
                        {statusMap[booking.status]?.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 mb-3">
                      <FaMapMarkerAlt className="text-emerald-500 text-xs" />
                      {booking.package?.destination}
                    </p>
                    <div className="flex flex-wrap gap-5 text-xs text-slate-500 font-bold">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-emerald-500" />
                        {new Date(booking.travelDate).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaUsers className="text-emerald-500" />
                        {booking.travelers} Travelers
                      </span>
                      <span className="font-black text-emerald-400 text-sm">
                        ৳{booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
