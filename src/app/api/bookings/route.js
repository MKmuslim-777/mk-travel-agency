import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");

    // packageId filter — admin/mod only
    if (packageId) {
      if (!["admin", "moderator"].includes(session.user.role)) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      const bookingsCol = await connect("bookings");
      const bookings = await bookingsCol.find({ packageId }).sort({ createdAt: -1 }).toArray();
      return Response.json(bookings.map((b) => ({ ...b, _id: b._id.toString() })));
    }

    const query = ["admin", "moderator"].includes(session.user.role) ? {} : { userId: session.user.id };
    const bookingsCol = await connect("bookings");
    const bookings = await bookingsCol.find(query).sort({ createdAt: -1 }).toArray();

    const packagesCol = await connect("packages");
    const withPackages = await Promise.all(
      bookings.map(async (b) => {
        const pkg = await packagesCol.findOne(
          { _id: new ObjectId(b.packageId) },
          { projection: { title: 1, destination: 1, image: 1, price: 1 } }
        );
        return { ...b, package: pkg };
      })
    );

    return Response.json(withPackages);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { packageId, travelers, travelDate, phone, specialRequests } = await request.json();

    const packagesCol = await connect("packages");
    const pkg = await packagesCol.findOne({ _id: new ObjectId(packageId) });
    if (!pkg) return Response.json({ error: "Package not found" }, { status: 404 });

    const booking = {
      userId: session.user.id,
      packageId,
      travelers,
      travelDate,
      totalPrice: pkg.price * travelers,
      phone,
      specialRequests,
      status: "pending",
      createdAt: new Date(),
    };

    const bookingsCol = await connect("bookings");
    const result = await bookingsCol.insertOne(booking);

    // dashboard ও admin revalidate করো
    revalidatePath("/dashboard", "page");
    revalidatePath("/admin", "page");

    return Response.json({ _id: result.insertedId, ...booking }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
