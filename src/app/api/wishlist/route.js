import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const wishlistCol = await connect("wishlists");
    const items = await wishlistCol.find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray();

    const packagesCol = await connect("packages");
    const enriched = await Promise.all(
      items.map(async (item) => {
        const pkg = await packagesCol.findOne(
          { _id: new ObjectId(item.packageId) },
          { projection: { title: 1, destination: 1, images: 1, price: 1, duration: 1 } }
        );
        return { ...item, _id: item._id.toString(), package: pkg ? { ...pkg, _id: pkg._id.toString() } : null };
      })
    );
    return Response.json(enriched);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { packageId } = await request.json();
    const col = await connect("wishlists");

    // Toggle — already exists? remove it
    const existing = await col.findOne({ userId: session.user.id, packageId });
    if (existing) {
      await col.deleteOne({ _id: existing._id });
      revalidatePath("/dashboard/my-wishlist");
      return Response.json({ removed: true });
    }

    await col.insertOne({ userId: session.user.id, packageId, createdAt: new Date() });
    revalidatePath("/dashboard/my-wishlist");
    return Response.json({ added: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
