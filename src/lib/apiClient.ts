export interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export class ApiError extends Error {
  status: number;
  success: false;
  stack?: string;

  constructor(message: string, status: number, stack?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.success = false;
    this.stack = stack;
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Retrieve token from localStorage if available (standard for auth)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: ErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        success: false,
        message: response.statusText || "An unexpected error occurred",
      };
    }
    
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }

    throw new ApiError(
      errorData.message || "API request failed",
      response.status,
      errorData.stack
    );
  }

  // For endpoints that might not return JSON (e.g., redirects, though fetch handles redirects)
  // Or empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return {} as Promise<T>;
}
