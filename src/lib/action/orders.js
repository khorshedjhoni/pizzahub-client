"use server";

import { revalidatePath } from "next/cache";
import { serverRequest as apiRequest } from "@/lib/api/server";
import { requireSession } from "@/lib/auth";

function revalidateOrders() {
  revalidatePath("/dashboard/customer");
  revalidatePath("/dashboard/customer/orders");
  revalidatePath("/dashboard/vendor");
  revalidatePath("/dashboard/vendor/orders");
  revalidatePath("/dashboard/admin");
}

export async function placeOrder(payload) {
  try {
    const session = await requireSession();
    const body = {
      ...payload,
      customerId: session.user.id,
      customerName: session.user.name,
      customerEmail: session.user.email,
    };
    const data = await apiRequest("/orders", {
      method: "POST",
      body,
      auth: true,
    });
    revalidateOrders();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function cancelOrder(orderId) {
  try {
    await requireSession();
    const data = await apiRequest(
      `/orders/${encodeURIComponent(orderId)}/cancel`,
      { method: "PATCH", auth: true },
    );
    revalidateOrders();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    await requireSession(["vendor", "admin"]);
    const data = await apiRequest(
      `/orders/${encodeURIComponent(orderId)}/status`,
      { method: "PATCH", body: { status }, auth: true },
    );
    revalidateOrders();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function acceptOrder(orderId) {
  return updateOrderStatus(orderId, "confirmed");
}

export async function rejectOrder(orderId) {
  return updateOrderStatus(orderId, "rejected");
}
