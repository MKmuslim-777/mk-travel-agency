import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connect } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import BookingManagement from "./BookingManagement";
import ReviewManagement from "./ReviewManagement";
import { MdBookmark, MdRateReview, MdSupervisorAccount } from "react-icons/md";

async function getAllBookings() {
  const bookingsCol = await connect("bookings");
  const bookings = await bookingsCol.find({}).sort({ createdAt: -1 }).toArray();

  const usersCol = await connect("users");
  const packagesCol = await connect("packages");

  const enriched = await Promise.all(
    bookings.map(async (b) => {
      const [pkg, user] = await Promise.all([
        packagesCol.findOne(
          { _id: new ObjectId(b.packageId) },
          { projection: { title: 1, destination: 1 } }
        ),
        usersCol.findOne(
          { _id: new ObjectId(b.userId) },
          { projection: { name: 1, email: 1 } }
        ),
      ]);
      return {
        ...b,
        _id: b._id.toString(),
        package: pkg ? { ...pkg, _id: pkg._id.toString() } : null,
        userName: user?.name || "Unknown",
        userEmail: user?.email || "",
      };
    })
  );

  return enriched;
}

async function getAllReviews() {
  const col = await connect("reviews");
  const reviews = await col.find({}).sort({ createdAt: -1 }).toArray();
  return reviews.map((r) => ({ ...r, _id: r._id.toString() }));
}

export const metadata = { title: "Moderator Panel | MK Travel" };

export default async function ModeratorPage() {
  const session = await auth();
  if (!session || !["admin", "moderator"].includes(session.user.role)) redirect("/");

  let bookings = [];
  let reviews = [];
  try {
    [bookings, reviews] = await Promise.all([getAllBookings(), getAllReviews()]);
  } catch (e) {
    console.error("Moderator DB error:", e);
  }

  const pendingReviews = reviews.filter((r) => !r.published).length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em]">
            Moderator
          </span>
          <h1 className="text-5xl font-black text-white tracking-tighter mt-2 flex items-center gap-4">
            <MdSupervisorAccount className="text-blue-400" />
            Moderator Panel
          </h1>
          <p className="text-slate-500 font-bold mt-1 text-sm">
            Manage bookings & reviews
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-blue-500/20 rounded-[2rem] p-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <MdBookmark className="text-2xl text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">{bookings.length}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Bookings</p>
          </div>
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-[2rem] p-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <MdBookmark className="text-2xl text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Pending Bookings</p>
          </div>
          <div className="bg-slate-900/80 border border-purple-500/20 rounded-[2rem] p-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <MdRateReview className="text-2xl text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">{pendingReviews}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Pending Reviews</p>
          </div>
        </div>

        {/* Booking Management */}
        <div id="bookings">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
              <MdBookmark className="text-blue-400" /> Booking Management
            </h2>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              {bookings.length} total
            </span>
          </div>
          <BookingManagement initialBookings={bookings} />
        </div>

        {/* Review Management */}
        <div id="reviews">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
              <MdRateReview className="text-purple-400" /> Review Management
            </h2>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              {reviews.length} total · {pendingReviews} pending
            </span>
          </div>
          <ReviewManagement initialReviews={reviews} />
        </div>
      </div>
    </div>
  );
}
