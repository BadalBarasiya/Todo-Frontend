const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:9000/api";

const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

// helper function
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: token }),
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Something went wrong");
  }

  return data;
};