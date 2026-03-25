import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const col = await connect("packages");
    const pkg = await col.findOne({ _id: new ObjectId(id) });
    if (!pkg) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(pkg);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || !["admin", "moderator"].includes(session.user.role)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const data = await request.json();
    const col = await connect("packages");
    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );

    revalidatePath(`/packages/${id}`);
    revalidatePath("/packages", "page");
    revalidatePath("/admin", "page");
    revalidatePath("/", "page");

    return Response.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const col = await connect("packages");
    await col.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/packages", "page");
    revalidatePath("/admin", "page");
    revalidatePath("/", "page");

    return Response.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
