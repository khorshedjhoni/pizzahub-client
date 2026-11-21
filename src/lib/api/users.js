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

/** GET /users — searchable user directory for admins. */
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

/** GET /users/:id — a single profile. */
export async function getProfile(userId) {
  const payload = await safeRequest(
    `/users/${encodeURIComponent(userId)}`,
    { auth: true },
    null,
  );
  return normalizeUser(payload?.data || payload?.user || payload);
}

/** GET /users/vendors — vendor directory used by admin screens. */
export async function getVendors(params = {}) {
  return getUsers({ ...params, role: "vendor" });
}
