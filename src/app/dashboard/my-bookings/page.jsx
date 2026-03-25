import { auth } from "@/lib/auth";
import { connect } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Link from "next/link";
import DashboardBookings from "../DashboardBookings";

async function getUserBookings(userId) {
  const bookingsCol = await connect("bookings");
  const bookings = await bookingsCol.find({ userId }).sort({ createdAt: -1 }).toArray();
  const packagesCol = await connect("packages");
  return Promise.all(
    bookings.map(async (b) => {
      const pkg = await packagesCol.findOne(
        { _id: new ObjectId(b.packageId) },
        { projection: { title: 1, destination: 1, images: 1, price: 1 } }
      );
      return { ...b, _id: b._id.toString(), package: pkg ? { ...pkg, _id: pkg._id.toString() } : null };
    })
  );
}

export const metadata = { title: "My Bookings | Dashboard" };

export default async function MyBookingsPage() {
  const session = await auth();
  let bookings = [];
  try { bookings = await getUserBookings(session.user.id); } catch {}

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Bookings</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/50 border border-slate-800 rounded-[2.5rem]">
          <p className="text-6xl mb-6">✈️</p>
          <p className="text-2xl font-black text-slate-400 tracking-tighter">No Bookings Yet</p>
          <p className="text-slate-600 font-bold mt-2 text-sm">আমাদের প্যাকেজ দেখুন এবং ভ্রমণ শুরু করুন!</p>
          <Link href="/packages"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all">
            Explore Packages
          </Link>
        </div>
      ) : (
        <DashboardBookings initialBookings={bookings} />
      )}
    </div>
  );
}
