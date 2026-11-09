import { backend_url } from "../main";

export interface ApiKeyItem {
  api_key: string;
  nickname: string;
  date_created: string;
}

export default async function LoadAPIs(): Promise<ApiKeyItem[]> {
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  if (!id || !token) {
    throw new Error("Missing credentials");
  }

  const response = await fetch(`${backend_url}/load_apis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: Number(id) }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to load API keys";
    try {
      const errorData = await response.json();
      errorMessage = errorData.reason || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const apiKeys: ApiKeyItem[] = Array.isArray(data) ? data : [];

  localStorage.setItem("api_keys", JSON.stringify(apiKeys));
  window.dispatchEvent(new Event("api_keys_updated"));

  return apiKeys;
}