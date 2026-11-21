import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminRoleLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/signin");

  const role = session.user.role || "customer";
  if (role !== "admin") redirect("/dashboard");

  return <>{children}</>;
}