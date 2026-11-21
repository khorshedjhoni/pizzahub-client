// src/app/(dashboard)/dashboard/customer/orders/page.jsx
import { headers } from "next/headers";
import { API_BASE_URL, getAuthHeaders } from "@/lib/api/config";
import OrdersTable from "@/components/dashboard/customer/OrdersTable";

async function getMyOrders() {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/orders/my`, {
      headers: { ...authHeaders, Cookie: (await headers()).toString() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function CustomerOrdersPage() {
  const orders = await getMyOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          View order details, track status history, or cancel pending orders
        </p>
      </div>
      <OrdersTable initialOrders={orders} />
    </div>
  );
}