import { asArray, serverSafeRequest as safeRequest } from "@/lib/api/server";
import { itemId, itemPrice } from "@/lib/utils";

const STATUS_ALIASES = {
  placed: "pending",
  waiting: "pending",
  accepted: "confirmed",
  in_progress: "preparing",
  cooking: "preparing",
  out_for_delivery: "delivering",
  on_the_way: "delivering",
  completed: "delivered",
  done: "delivered",
  declined: "rejected",
  canceled: "cancelled",
};

export function normalizeOrder(order) {
  if (!order) return null;
  const rawStatus = String(order.status || "pending").toLowerCase();
  const items = Array.isArray(order.items)
    ? order.items.map((entry) => ({
        ...entry,
        id: itemId(entry),
        name: entry.name || entry.menuItem?.name || "Pizza",
        price: Number(entry.price ?? entry.menuItem?.price ?? 0),
        quantity: Number(entry.quantity ?? 1),
      }))
    : [];

  return {
    ...order,
    id: itemId(order),
    status: STATUS_ALIASES[rawStatus] || rawStatus,
    total: Number(order.total ?? order.totalAmount ?? order.amount ?? 0),
    items,
    itemCount:
      order.itemCount ??
      (items.reduce((sum, entry) => sum + (entry.quantity || 1), 0) || 1),
    customerName:
      order.customerName ||
      order.customer?.name ||
      order.user?.name ||
      "Customer",
    customerEmail: order.customerEmail || order.customer?.email || order.user?.email,
    vendorName:
      order.vendorName ||
      order.vendor?.restaurantName ||
      order.vendor?.name ||
      "PizzaHub vendor",
    deliveryAddress:
      order.deliveryAddress || order.address || order.shippingAddress || "—",
    deliveryDate: order.deliveryDate || order.createdAt,
    createdAt: order.createdAt || order.date,
    specialInstructions:
      order.specialInstructions || order.notes || order.instructions || "",
  };
}


export async function getCustomerOrders(userId) {
  const suffix = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const payload = await safeRequest(
    `/orders/customer${suffix}`,
    { auth: true },
    null,
  );
  return asArray(payload, ["orders"]).map(normalizeOrder);
}


export async function getVendorOrders(vendorId) {
  const suffix = vendorId ? `?vendorId=${encodeURIComponent(vendorId)}` : "";
  const payload = await safeRequest(
    `/orders/vendor${suffix}`,
    { auth: true },
    null,
  );
  return asArray(payload, ["orders"]).map(normalizeOrder);
}


export async function getAllOrders(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  const payload = await safeRequest(`/orders${suffix}`, { auth: true }, null);
  return asArray(payload, ["orders"]).map(normalizeOrder);
}

export { itemPrice };
