import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connect } from "@/lib/mongodb";
import ReviewManagement from "@/app/moderator/ReviewManagement";

export const metadata = { title: "Manage Reviews | Dashboard" };

export default async function ManageReviewsPage() {
  const session = await auth();
  if (!["admin", "moderator"].includes(session?.user?.role)) redirect("/dashboard/home");

  let reviews = [];
  try {
    const col = await connect("reviews");
    const raw = await col.find({}).sort({ createdAt: -1 }).toArray();
    reviews = raw.map((r) => ({ ...r, _id: r._id.toString() }));
  } catch {}

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <span className="text-purple-400 font-black text-xs uppercase tracking-[0.3em]">Reviews</span>
        <h1 className="text-4xl font-black text-white tracking-tighter mt-1">Manage Reviews</h1>
        <p className="text-slate-500 font-bold mt-1 text-sm">
          {reviews.filter((r) => !r.published).length} pending · {reviews.length} total
        </p>
      </div>
      <ReviewManagement initialReviews={reviews} />
    </div>
  );
}
