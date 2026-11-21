"use server";

import { revalidatePath } from "next/cache";
import { serverRequest as apiRequest } from "@/lib/api/server";
import { requireSession } from "@/lib/auth";

function revalidateMenu() {
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/dashboard/vendor/menu");
  revalidatePath("/dashboard/admin/menu");
}

export async function createMenuItem(payload) {
  try {
    const session = await requireSession(["vendor", "admin"]);
    const body = {
      ...payload,
      vendorId: session.user.id,
      vendorName: session.user.restaurantName || session.user.name,
      status: session.user.role === "admin" ? "approved" : "pending",
    };
    const data = await apiRequest("/menu", {
      method: "POST",
      body,
      auth: true,
    });
    revalidateMenu();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateMenuItem(id, payload) {
  try {
    await requireSession(["vendor", "admin"]);
    const data = await apiRequest(`/menu/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: payload,
      auth: true,
    });
    revalidateMenu();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteMenuItem(id) {
  try {
    await requireSession(["vendor", "admin"]);
    await apiRequest(`/menu/${encodeURIComponent(id)}`, {
      method: "DELETE",
      auth: true,
    });
    revalidateMenu();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateMenuItemStatus(id, status) {
  try {
    await requireSession(["vendor", "admin"]);
    const data = await apiRequest(
      `/menu/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: { status },
        auth: true,
      },
    );
    revalidateMenu();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function approveMenuItem(id) {
  return updateMenuItemStatus(id, "approved");
}

export async function rejectMenuItem(id) {
  return updateMenuItemStatus(id, "rejected");
}
