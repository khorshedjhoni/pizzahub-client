import { headers } from "next/headers";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api/config";
import OverviewStats from "@/components/dashboard/shared/OverviewStats";
import OverviewChart from "@/components/dashboard/shared/OverviewChart";

async function getVendorOverview() {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/stats/overview`, {
      headers: { ...authHeaders, Cookie: (await headers()).toString() },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function VendorOverviewPage() {
  const data = await getVendorOverview();
  const stats = data?.stats || {
    totalMenuItems: 0,
    activeMenuItems: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    subscriptionPlan: "free",
  };

  const cards = [
    { title: "Total Menu Items", value: stats.totalMenuItems },
    { title: "Active Approved Items", value: stats.activeMenuItems },
    { title: "Pending Orders", value: stats.pendingOrders },
    { title: "Accepted Orders", value: stats.acceptedOrders },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Overview</h1>
          <p className="text-sm text-muted-foreground">
            Manage your pizzeria menu, incoming orders, and subscription plan
          </p>
        </div>
        <span className="rounded-full border bg-card px-3 py-1 text-xs font-semibold uppercase">
          Current Plan: {stats.subscriptionPlan}
        </span>
      </div>

      <OverviewStats cards={cards} />
      <OverviewChart title="Incoming Order Summary" data={data?.chart || []} />
    </div>
  );
}