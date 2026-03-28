import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const col = await connect("settings");
    // Use key field instead of _id to avoid strict mode issues
    const doc = await col.findOne({ key: "site" });
    return Response.json(doc || {});
  } catch (err) {
    console.error("Settings GET error:", err);
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
    // Remove _id from body to avoid conflicts
    const { _id, ...data } = body;

    const col = await connect("settings");
    await col.updateOne(
      { key: "site" },
      { $set: { ...data, key: "site", updatedAt: new Date() } },
      { upsert: true }
    );

    // Revalidate pages that use settings
    revalidatePath("/about",        "page");
    revalidatePath("/contact",      "page");
    revalidatePath("/destinations", "page");

    return Response.json({ success: true });
  } catch (err) {
    console.error("Settings PATCH error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
