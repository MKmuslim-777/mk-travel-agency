import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const query = session.user.role === "admin" ? {} : { user: session.user.id };
    const bookings = await Booking.find(query)
      .populate("package", "title destination image price")
      .sort({ createdAt: -1 });

    return Response.json(bookings);
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { packageId, travelers, travelDate, phone, specialRequests } = await request.json();

    const pkg = await Package.findById(packageId);
    if (!pkg) return Response.json({ error: "Package not found" }, { status: 404 });

    const totalPrice = pkg.price * travelers;

    const booking = await Booking.create({
      user: session.user.id,
      package: packageId,
      travelers,
      travelDate,
      totalPrice,
      phone,
      specialRequests,
    });

    return Response.json(booking, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
