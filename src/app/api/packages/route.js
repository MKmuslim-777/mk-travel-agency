import { connect } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q");

    const query = {};
    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { destination: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const col = await connect("packages");
    const packages = await col.find(query).sort({ createdAt: -1 }).toArray();
    return Response.json(packages);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !["admin", "moderator"].includes(session.user.role)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const col = await connect("packages");
    const result = await col.insertOne({ ...data, createdAt: new Date() });

    // সব package-related page revalidate করো
    revalidatePath("/packages", "page");
    revalidatePath("/admin", "page");
    revalidatePath("/", "page");

    return Response.json({ _id: result.insertedId, ...data }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
