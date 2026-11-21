const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function updateProfile(payload) {
  try {
    const authHeader = await getBearerHeader();
    const res = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Failed to update profile",
      };
    }

    return { success: true, data: json.data };
  } catch (err) {
    return {
      success: false,
      error: err?.message || "Network error while updating profile",
    };
  }
}