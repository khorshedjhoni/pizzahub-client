import { headers } from "next/headers";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api/config";
import OverviewStats from "@/components/dashboard/shared/OverviewStats";
import OverviewChart from "@/components/dashboard/shared/OverviewChart";

async function getAdminOverview() {
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

export default async function AdminOverviewPage() {
  const data = await getAdminOverview();
  const stats = data?.stats || {
    totalUsers: 0,
    totalVendors: 0,
    totalMenuItems: 0,
    pendingMenuItems: 0,
  };

  const cards = [
    { title: "Total Users", value: stats.totalUsers },
    { title: "Total Vendors", value: stats.totalVendors },
    { title: "Total Menu Items", value: stats.totalMenuItems },
    { title: "Pending Approvals", value: stats.pendingMenuItems },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide summary of users, vendors, menu items, and moderation queue
        </p>
      </div>

      <OverviewStats cards={cards} />
      <OverviewChart title="Platform Overview Chart" data={data?.chart || []} />
    </div>
  );
}