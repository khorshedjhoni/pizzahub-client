import "server-only";

import { getServerToken } from "@/lib/auth";
import { API_BASE_URL, apiRequest, asArray, getAuthHeaders } from "@/lib/api/config";

export { API_BASE_URL, asArray, getAuthHeaders };


export async function getRequestToken() {
  try {
    return await getServerToken();
  } catch {
    return null;
  }
}


export async function serverRequest(path, options = {}) {
  const token =
    options.token || (options.auth ? await getRequestToken() : null);
  return apiRequest(path, { ...options, token });
}


export async function serverSafeRequest(path, options, fallback = null) {
  try {
    return await serverRequest(path, options);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[PizzaHub API] ${options?.method || "GET"} ${path}:`,
        error?.message,
      );
    }
    return fallback;
  }
}
