import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function VendorRoleLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/signin");

  const role = session.user.role || "customer";
  if (role !== "vendor") redirect("/dashboard");

  return <>{children}</>;
}