import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.isBlocked) {
    redirect("/?error=blocked");
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      <DashboardSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={session.user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}