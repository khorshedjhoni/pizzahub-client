import { headers } from "next/headers";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api/config";
import OverviewStats from "@/components/dashboard/shared/OverviewStats";
import OverviewChart from "@/components/dashboard/shared/OverviewChart";

async function getCustomerOverview() {
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

export default async function CustomerOverviewPage() {
  const data = await getCustomerOverview();
  const stats = data?.stats || {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  };

  const cards = [
    { title: "Total Orders", value: stats.total },
    { title: "Pending Orders", value: stats.pending },
    { title: "Accepted Orders", value: stats.accepted },
    { title: "Rejected Orders", value: stats.rejected },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Overview</h1>
        <p className="text-sm text-muted-foreground">
          Track your pizza orders and status breakdown
        </p>
      </div>

      <OverviewStats cards={cards} />
      <OverviewChart title="Order Status Breakdown" data={data?.chart || []} />
    </div>
  );
}