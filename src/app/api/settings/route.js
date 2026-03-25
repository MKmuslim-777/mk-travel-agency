import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const col = await connect("settings");
    const doc = await col.findOne({ _id: "site" });
    return Response.json(doc || {});
  } catch (err) {
    console.error(err);
    return Response.json({}, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const col = await connect("settings");
    await col.updateOne(
      { _id: "site" },
      { $set: { ...body, updatedAt: new Date() } },
      { upsert: true }
    );
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
