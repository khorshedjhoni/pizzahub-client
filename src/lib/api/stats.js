import { asArray, serverSafeRequest as safeRequest } from "@/lib/api/server";

const EMPTY_STATS = {
  totalOrders: 0,
  totalRevenue: 0,
  totalMenuItems: 0,
  totalUsers: 0,
  totalCustomers: 0,
  totalVendors: 0,
  pendingItems: 0,
  premiumVendors: 0,
  activeOrders: 0,
  deliveredOrders: 0,
  cancelledOrders: 0,
  averageOrderValue: 0,
};

function normalizeStats(payload) {
  const raw = payload?.stats || payload?.data?.stats || payload?.data || payload || {};
  const stats = { ...EMPTY_STATS };
  for (const key of Object.keys(EMPTY_STATS)) {
    if (raw[key] !== undefined) stats[key] = Number(raw[key]) || 0;
  }

  const chartSource =
    payload?.chart ||
    payload?.orderChart ||
    payload?.data?.chart ||
    payload?.data?.orderChart ||
    (Array.isArray(raw.chart) ? raw.chart : []);

  const chart = asArray(chartSource).map((entry) => ({
    label: entry.label || entry.name || entry.month || entry.date || "—",
    orders: Number(entry.orders ?? entry.count ?? 0),
    revenue: Number(entry.revenue ?? entry.amount ?? 0),
  }));

  return { stats, chart };
}

/** GET /stats/customer — overview cards + order chart. */
export async function getCustomerStats(userId) {
  const suffix = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const payload = await safeRequest(
    `/stats/customer${suffix}`,
    { auth: true },
    null,
  );
  return normalizeStats(payload);
}

/** GET /stats/vendor — vendor overview cards + chart. */
export async function getVendorStats(vendorId) {
  const suffix = vendorId ? `?vendorId=${encodeURIComponent(vendorId)}` : "";
  const payload = await safeRequest(
    `/stats/vendor${suffix}`,
    { auth: true },
    null,
  );
  return normalizeStats(payload);
}

/** GET /stats/admin — platform-wide overview cards + charts. */
export async function getAdminStats() {
  const payload = await safeRequest(`/stats/admin`, { auth: true }, null);
  return normalizeStats(payload);
}

export { normalizeStats };
