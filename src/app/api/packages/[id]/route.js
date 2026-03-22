import { connectDB } from "@/lib/mongodb";
import Package from "@/models/Package";
import { auth } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    await Package.findByIdAndDelete(id);
    return Response.json({ message: "Deleted" });
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const pkg = await Package.findById(id).lean();
    if (!pkg) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(pkg);
  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
