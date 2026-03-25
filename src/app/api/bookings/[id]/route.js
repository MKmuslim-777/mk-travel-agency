import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    const col = await connect("bookings");
    const booking = await col.findOne({ _id: new ObjectId(id) });
    if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });

    const isAdminOrMod = ["admin", "moderator"].includes(session.user.role);
    const isOwner = booking.userId === session.user.id;

    if (!isAdminOrMod && !isOwner) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const update = {};

    // User নিজে শুধু paid করতে পারবে
    if (isOwner && !isAdminOrMod) {
      if (paymentStatus === "paid") {
        update.paymentStatus = "paid";
        update.status = "confirmed";
      } else {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      // Admin/Moderator যেকোনো status বা paymentStatus পরিবর্তন করতে পারবে
      if (status) update.status = status;
      if (paymentStatus) update.paymentStatus = paymentStatus;
    }

    await col.updateOne({ _id: new ObjectId(id) }, { $set: update });

    revalidatePath("/dashboard", "page");
    revalidatePath("/admin", "page");
    revalidatePath("/moderator", "page");

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
