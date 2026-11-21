import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardRedirectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const role = session.user.role || "customer";
  if (role === "admin") redirect("/dashboard/admin");
  if (role === "vendor") redirect("/dashboard/vendor");
  redirect("/dashboard/customer");
}