import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";
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

  // 401 on an authenticated request → try one silent refresh, then retry.
  if (response.status === 401 && token) {
    const refreshed = await tryRefreshAndRetry({
      path,
      method,
      body,
      headers,
      signal,
      isFormDataBody,
    });
    if (refreshed) return refreshed as T;
    // Refresh failed (or we decided not to retry). Fall through to the
    // normal error path so the original 401 is still surfaced to the
    // caller if anything else needs it.
  }

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

// ---------------------------------------------------------------------------
// Refresh-and-retry machinery
// ---------------------------------------------------------------------------

type RetryArgs = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body: unknown;
  headers: HeadersInit | undefined;
  signal: AbortSignal | undefined;
  isFormDataBody: boolean;
};

// Single-flight: if multiple authenticated calls 401 at the same time,
// they all share one refresh round-trip rather than each firing one.
let inflightRefresh: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return null;

    try {
      const requestUrl = buildRequestUrl("/api/auth/token/refresh/");
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!response.ok) return null;

      const data = (await response.json()) as { access?: string; refresh?: string };
      if (!data.access) return null;

      // Persist the rotated tokens back into the store. We keep the
      // existing user object — only the tokens changed.
      useAuthStore.getState().setTokens({
        access: data.access,
        refresh: data.refresh,
      });

      return data.access;
    } catch {
      return null;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
}

function forceSignOut() {
  useAuthStore.getState().clearAuthSession();
  try {
    router.replace("/auth");
  } catch {
    try {
      router.replace("/welcome");
    } catch {
      // give up silently — the next render of any auth-gated screen
      // will fail-fast because the store is empty.
    }
  }
}

async function tryRefreshAndRetry(args: RetryArgs): Promise<unknown | null> {
  // If we don't have a refresh token, we can't help — but we DO want to
  // sign the user out so they aren't trapped on a screen showing 401 toasts.
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    // Don't forceSignOut on the very first call (could be a stale token
    // from before the user signed out). Only force if the user object is
    // still in the store, meaning the app believes the user is signed in.
    if (useAuthStore.getState().user) {
      forceSignOut();
    }
    return null;
  }

  const newAccessToken = await refreshAccessToken();
  if (!newAccessToken) {
    forceSignOut();
    return null;
  }

  // Retry the original request once with the new token.
  const requestUrl = buildRequestUrl(args.path);
  const retryResponse = await fetch(requestUrl, {
    method: args.method,
    headers: {
      Accept: "application/json",
      ...(!args.isFormDataBody && args.body
        ? { "Content-Type": "application/json" }
        : {}),
      Authorization: `Bearer ${newAccessToken}`,
      ...(args.headers ?? {}),
    },
    ...(args.body
      ? {
          body: args.isFormDataBody
            ? (args.body as BodyInit)
            : JSON.stringify(args.body),
        }
      : {}),
    signal: args.signal,
  });

  const contentType = retryResponse.headers.get("content-type") ?? "";
  const hasJsonBody = contentType.includes("application/json");

  let payload: unknown = null;
  if (hasJsonBody) {
    payload = await retryResponse.json();
  } else {
    const text = await retryResponse.text();
    payload = text.length > 0 ? text : null;
  }

  if (!retryResponse.ok) {
    throw new ApiError(
      getErrorMessage(payload, "Request failed"),
      retryResponse.status,
      payload,
    );
  }
  return payload;
}
