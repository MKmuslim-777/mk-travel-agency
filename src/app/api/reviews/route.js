import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

// GET — admin/moderator সব reviews, user শুধু নিজেরটা
export async function GET() {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const col = await connect("reviews");
    const isAdminOrMod = ["admin", "moderator"].includes(session.user.role);

    const query = isAdminOrMod ? {} : { userId: session.user.id };
    const reviews = await col.find(query).sort({ createdAt: -1 }).toArray();

    return Response.json(reviews);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — user নতুন review দেবে
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { packageId, rating, comment } = await request.json();
    if (!packageId || !comment) {
      return Response.json({ error: "packageId and comment required" }, { status: 400 });
    }

    const review = {
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image || null,
      packageId,
      rating: rating || 5,
      comment,
      published: false,
      createdAt: new Date(),
    };

    const col = await connect("reviews");
    const result = await col.insertOne(review);

    revalidatePath("/moderator", "page");

    return Response.json({ _id: result.insertedId, ...review }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH — moderator/admin review publish করবে
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const isAdminOrMod = ["admin", "moderator"].includes(session.user.role);
    if (!isAdminOrMod) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { id, published } = await request.json();
    const col = await connect("reviews");
    await col.updateOne({ _id: new ObjectId(id) }, { $set: { published } });

    revalidatePath("/moderator", "page");

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
