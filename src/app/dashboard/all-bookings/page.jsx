import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connect } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import BookingManagement from "@/app/moderator/BookingManagement";

async function getAllBookings() {
  const bookingsCol  = await connect("bookings");
  const bookings     = await bookingsCol.find({}).sort({ createdAt: -1 }).toArray();
  const usersCol     = await connect("users");
  const packagesCol  = await connect("packages");

  return Promise.all(
    bookings.map(async (b) => {
      const [pkg, user] = await Promise.all([
        packagesCol.findOne({ _id: new ObjectId(b.packageId) }, { projection: { title: 1, destination: 1 } }),
        usersCol.findOne({ _id: new ObjectId(b.userId) }, { projection: { name: 1, email: 1 } }),
      ]);
      return {
        ...b,
        _id: b._id.toString(),
        package:   pkg  ? { ...pkg,  _id: pkg._id.toString()  } : null,
        userName:  user?.name  || "Unknown",
        userEmail: user?.email || "",
      };
    })
  );
}

export const metadata = { title: "All Bookings | Dashboard" };

export default async function AllBookingsPage() {
  const session = await auth();
  if (!["admin", "moderator"].includes(session?.user?.role)) redirect("/dashboard/home");

  let bookings = [];
  try { bookings = await getAllBookings(); } catch {}

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em]">
          {session.user.role === "admin" ? "Admin" : "Moderator"}
        </span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">All Bookings</h1>
        <p className="text-slate-500 font-bold mt-1 text-sm">
          {bookings.length} total · {bookings.filter((b) => b.status === "pending").length} pending
        </p>
      </div>
      <BookingManagement initialBookings={bookings} />
    </div>
  );
}
