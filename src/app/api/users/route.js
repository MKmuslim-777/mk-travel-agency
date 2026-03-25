import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const col = await connect("users");
    const users = await col
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return Response.json(users.map((u) => ({ ...u, _id: u._id.toString() })));
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId, role } = await request.json();
    const validRoles = ["admin", "moderator", "user"];
    if (!validRoles.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }
    const col = await connect("users");
    await col.updateOne({ _id: new ObjectId(userId) }, { $set: { role } });

    revalidatePath("/admin", "page");

    return Response.json({ message: "Role updated" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
