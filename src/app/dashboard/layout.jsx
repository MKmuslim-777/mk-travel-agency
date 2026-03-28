import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import AdminChatNotifier from "@/components/AdminChatNotifier";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard | MK Travel" };

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <DashboardSidebar
        role={session.user.role ?? "user"}
        userName={session.user.name}
        userImage={session.user.image ?? null}
      />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
      <AdminChatNotifier />
    </div>
  );
}
