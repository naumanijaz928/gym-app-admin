import { useAuthStore } from "@/stores/authStore";

export async function apiFetch<T>(url: string, options: RequestInit = {}) {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("No access token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API error");
  }
  return res.json() as Promise<T>;
}
