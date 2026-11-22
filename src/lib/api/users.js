import { asArray, serverSafeRequest as safeRequest } from "@/lib/api/server";
import { itemId } from "@/lib/utils";

export function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: itemId(user),
    name: user.name || "Unnamed user",
    email: user.email || "—",
    role: user.role || "customer",
    plan: user.plan || "free",
    isBlocked: Boolean(user.isBlocked ?? user.blocked),
    createdAt: user.createdAt || user.created_at,
    image: user.image || null,
  };
}


export async function getUsers(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  const payload = await safeRequest(`/users${suffix}`, { auth: true }, null);
  return asArray(payload, ["users"]).map(normalizeUser);
}


export async function getProfile(userId) {
  const payload = await safeRequest(
    `/users/${encodeURIComponent(userId)}`,
    { auth: true },
    null,
  );
  return normalizeUser(payload?.data || payload?.user || payload);
}


export async function getVendors(params = {}) {
  return getUsers({ ...params, role: "vendor" });
}
