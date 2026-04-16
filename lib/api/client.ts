import { Platform } from "react-native";

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim() ?? "";
const API_URL = rawApiUrl.replace(/\/+$/, "");

const normalizePath = (path: string) => {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path;
};

const buildRequestUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = normalizePath(path);

  if (!API_URL) {
    return normalizedPath;
  }

  // Avoid /api/api/... when API_URL already includes /api.
  if (API_URL.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${API_URL}${normalizedPath.slice(4)}`;
  }

  return `${API_URL}${normalizedPath}`;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (Array.isArray(payload)) {
    const firstString = payload.find(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );

    if (firstString) {
      return firstString;
    }
  }

  if (
    payload &&
    typeof payload === "object" &&
    "detail" in payload &&
    typeof payload.detail === "string"
  ) {
    return payload.detail;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "log" in payload &&
    typeof payload.log === "string"
  ) {
    return payload.log;
  }

  if (payload && typeof payload === "object") {
    for (const value of Object.values(payload as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }

      if (Array.isArray(value)) {
        const firstString = value.find(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        );

        if (firstString) {
          return firstString;
        }
      }
    }
  }

  return fallback;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token, headers, signal }: ApiRequestOptions = {},
): Promise<T> {
  const requestUrl = buildRequestUrl(path);
  const isFormDataBody =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (!API_URL && Platform.OS !== "web") {
    throw new Error(
      "Missing EXPO_PUBLIC_API_URL in your environment. Set it in .env.local to call the API from native builds.",
    );
  }

  const response = await fetch(requestUrl, {
    method,
    headers: {
      Accept: "application/json",
      ...(!isFormDataBody && body
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body
      ? {
          body: isFormDataBody ? (body as BodyInit) : JSON.stringify(body),
        }
      : {}),
    signal,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const hasJsonBody = contentType.includes("application/json");

  let payload: unknown = null;

  if (hasJsonBody) {
    payload = await response.json();
  } else {
    const textResponse = await response.text();
    payload = textResponse.length > 0 ? textResponse : null;
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, "Request failed"),
      response.status,
      payload,
    );
  }

  return payload as T;
}
