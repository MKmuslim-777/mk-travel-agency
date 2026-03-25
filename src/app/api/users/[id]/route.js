import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || !["admin", "moderator"].includes(session.user.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const usersCol = await connect("users");
    const user = await usersCol.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    // Get their bookings
    const bookingsCol  = await connect("bookings");
    const packagesCol  = await connect("packages");
    const wishlistCol  = await connect("wishlists");

    const [bookings, wishlistItems] = await Promise.all([
      bookingsCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
      wishlistCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
    ]);

    // Enrich bookings with package info
    const enrichedBookings = await Promise.all(
      bookings.map(async (b) => {
        const pkg = await packagesCol.findOne(
          { _id: new ObjectId(b.packageId) },
          { projection: { title: 1, destination: 1, images: 1, price: 1 } }
        );
        return { ...b, _id: b._id.toString(), package: pkg ? { ...pkg, _id: pkg._id.toString() } : null };
      })
    );

    // Enrich wishlist with package info
    const enrichedWishlist = await Promise.all(
      wishlistItems.map(async (w) => {
        const pkg = await packagesCol.findOne(
          { _id: new ObjectId(w.packageId) },
          { projection: { title: 1, destination: 1, images: 1, price: 1, duration: 1 } }
        );
        return { ...w, _id: w._id.toString(), package: pkg ? { ...pkg, _id: pkg._id.toString() } : null };
      })
    );

    return Response.json({
      user:     { ...user, _id: user._id.toString() },
      bookings: enrichedBookings,
      wishlist: enrichedWishlist,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
