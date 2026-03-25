import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connect } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import {
  MdPerson, MdPhone, MdLocationOn, MdBookmark, MdFavorite,
  MdArrowBack, MdEmail, MdCalendarToday,
} from "react-icons/md";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock } from "react-icons/fa";

async function getUserData(id) {
  const usersCol    = await connect("users");
  const bookingsCol = await connect("bookings");
  const packagesCol = await connect("packages");
  const wishlistCol = await connect("wishlists");

  const user = await usersCol.findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
  if (!user) return null;

  const [bookings, wishlistItems] = await Promise.all([
    bookingsCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
    wishlistCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
  ]);

  const enrichedBookings = await Promise.all(
    bookings.map(async (b) => {
      const pkg = await packagesCol.findOne(
        { _id: new ObjectId(b.packageId) },
        { projection: { title: 1, destination: 1, images: 1, price: 1 } }
      );
      return { ...b, _id: b._id.toString(), package: pkg ? { ...pkg, _id: pkg._id.toString() } : null };
    })
  );

  const enrichedWishlist = await Promise.all(
    wishlistItems.map(async (w) => {
      const pkg = await packagesCol.findOne(
        { _id: new ObjectId(w.packageId) },
        { projection: { title: 1, destination: 1, images: 1, price: 1, duration: 1 } }
      );
      return { ...w, _id: w._id.toString(), package: pkg ? { ...pkg, _id: pkg._id.toString() } : null };
    })
  );

  return {
    user:     { ...user, _id: user._id.toString() },
    bookings: enrichedBookings,
    wishlist: enrichedWishlist,
  };
}

const statusStyle = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default async function UserDetailPage({ params }) {
  const session = await auth();
  if (!["admin", "moderator"].includes(session?.user?.role)) redirect("/dashboard/home");

  const { id } = await params;

  let data = null;
  try { data = await getUserData(id); } catch {}
  if (!data) redirect("/dashboard/manage-users");

  const { user, bookings, wishlist } = data;
  const totalSpent = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);

  const roleMeta = {
    admin:     "bg-amber-500/10 text-amber-400 border-amber-500/20",
    moderator: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    user:      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Back */}
      <Link href="/dashboard/manage-users"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm mb-6 transition-colors">
        <MdArrowBack size={18} /> Back to Users
      </Link>

      {/* User card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/20 border border-emerald-500/30 overflow-hidden flex items-center justify-center text-emerald-400 font-black text-3xl shrink-0">
            {user.image
              ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              : user.name?.charAt(0)?.toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${roleMeta[user.role] || roleMeta.user}`}>
                {user.role || "user"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-slate-400 font-bold">
              <span className="flex items-center gap-2"><MdEmail className="text-emerald-500 shrink-0" /> {user.email}</span>
              {user.phone && <span className="flex items-center gap-2"><MdPhone className="text-emerald-500 shrink-0" /> {user.phone}</span>}
              {user.city && <span className="flex items-center gap-2"><MdLocationOn className="text-emerald-500 shrink-0" /> {user.city}</span>}
              {user.occupation && <span className="flex items-center gap-2"><MdPerson className="text-emerald-500 shrink-0" /> {user.occupation}</span>}
              {user.createdAt && (
                <span className="flex items-center gap-2">
                  <MdCalendarToday className="text-emerald-500 shrink-0" />
                  Joined {new Date(user.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              )}
            </div>
            {user.address && (
              <p className="text-xs text-slate-500 font-bold mt-2 flex items-start gap-1.5">
                <MdLocationOn className="text-emerald-500 shrink-0 mt-0.5" /> {user.address}
              </p>
            )}
            {user.emergencyContact && (
              <p className="text-xs text-slate-500 font-bold mt-1">
                Emergency: {user.emergencyContact} {user.emergencyPhone && `· ${user.emergencyPhone}`}
              </p>
            )}
            {user.bio && <p className="text-sm text-slate-400 mt-3 italic">"{user.bio}"</p>}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-800">
          {[
            { label: "Bookings",    value: bookings.length,           color: "text-blue-400" },
            { label: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, color: "text-emerald-400" },
            { label: "Wishlist",    value: wishlist.length,           color: "text-pink-400" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings */}
      <div className="mb-8">
        <h2 className="text-xl font-black text-white tracking-tighter mb-4 flex items-center gap-2">
          <MdBookmark className="text-blue-400" /> Bookings ({bookings.length})
        </h2>
        {bookings.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 border border-slate-800 rounded-[1.5rem]">
            <p className="text-slate-500 font-bold text-sm">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const cover = b.package?.images?.[0] || null;
              return (
                <div key={b._id} className="bg-slate-900/80 border border-slate-800 rounded-[1.5rem] p-4 flex gap-4">
                  {cover && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={cover} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <p className="font-black text-white truncate">{b.package?.title || "Package"}</p>
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusStyle[b.status]}`}>
                          {b.status}
                        </span>
                        {b.paymentStatus === "paid" && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            paid
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-bold">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-emerald-500" /> {b.package?.destination}</span>
                      <span className="flex items-center gap-1"><FaCalendarAlt className="text-emerald-500" />
                        {new Date(b.travelDate).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1"><FaUsers className="text-emerald-500" /> {b.travelers} travelers</span>
                      <span className="font-black text-emerald-400">৳{b.totalPrice?.toLocaleString()}</span>
                    </div>
                    {b.phone && <p className="text-xs text-slate-600 font-bold mt-1">📞 {b.phone}</p>}
                    {b.specialRequests && <p className="text-xs text-slate-600 italic mt-1">"{b.specialRequests}"</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Wishlist */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tighter mb-4 flex items-center gap-2">
          <MdFavorite className="text-pink-400" /> Wishlist ({wishlist.length})
        </h2>
        {wishlist.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/50 border border-slate-800 rounded-[1.5rem]">
            <p className="text-slate-500 font-bold text-sm">No wishlist items</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {wishlist.map((w) => {
              const cover = w.package?.images?.[0] || null;
              return (
                <Link key={w._id} href={`/packages/${w.packageId}`}
                  className="bg-slate-900/80 border border-slate-800 rounded-[1.5rem] p-4 flex gap-3 hover:border-emerald-500/20 transition-all">
                  {cover && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <img src={cover} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-black text-white text-sm truncate">{w.package?.title || "Package"}</p>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                      <FaMapMarkerAlt className="text-emerald-500 text-[10px]" /> {w.package?.destination}
                    </p>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <FaClock className="text-emerald-500 text-[10px]" /> {w.package?.duration}
                    </p>
                    <p className="font-black text-emerald-400 text-sm mt-1">৳{w.package?.price?.toLocaleString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
