import { useAuthStore } from "@/store/useAuthStore";
import { apiRequest } from "./client";

type AuthenticatedRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export function authenticatedApiRequest<T>(
  path: string,
  options: AuthenticatedRequestOptions = {},
) {
  const accessToken = useAuthStore.getState().accessToken;

  return apiRequest<T>(path, {
    ...options,
    token: accessToken,
  });
}
