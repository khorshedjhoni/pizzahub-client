import { cookies } from "next/headers";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const tokenRes = await fetch(
    `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/token`,
    {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    }
  );

  if (!tokenRes.ok) return {};
  const { token } = await tokenRes.json();

  return token ? { Authorization: `Bearer ${token}` } : {};
}