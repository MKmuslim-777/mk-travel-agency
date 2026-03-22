import { connectDB } from "@/lib/mongodb";
import Package from "@/models/Package";
import { auth } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const query = {};
    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const packages = await Package.find(query).sort({ createdAt: -1 });
    return Response.json(packages);
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const pkg = await Package.create(data);
    return Response.json(pkg, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
