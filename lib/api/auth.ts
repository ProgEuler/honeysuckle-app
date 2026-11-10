import { useAuthStore } from "@/store/useAuthStore";
import { authenticatedApiRequest } from "./authenticatedClient";
import { ApiError, apiRequest } from "./client";

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  confirm_password: string;
};

export type GetOtpRequest = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp_code: string;
};

export type AuthUserLog = {
  id: string;
  last_login: string | null;
  uid: string | null;
  email: string;
  name: string;
  bio: string | null;
  cover: string | null;
  image: string | null;
  role: string;
  dob: string | null;
  gender: string | null;
  location: string | null;
  notify: boolean;
  policy: boolean;
  checkin_time: string;
  streak?: number;
  total_checkin?: number;
};

export type GetMeResponse = AuthUserLog;

export type SignInResponse = {
  status: boolean;
  log: AuthUserLog;
  refresh: string;
  access: string;
};

export type SignUpResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type GetOtpResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type VerifyOtpResponse = {
  status?: boolean;
  message?: string;
  log?: AuthUserLog;
  refresh?: string;
  access?: string;
  [key: string]: unknown;
};

export type ResetPasswordRequest = {
  email: string;
  new_password: string;
};

export type ResetPasswordResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type ChangePasswordRequest = {
  old_password: string;
  password: string;
};

export type ChangePasswordResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export type UpdateMeRequest = Partial<{
  name: string;
  bio: string | null;
  cover: string | null;
  image: string | null;
  role: string;
  dob: string | null;
  gender: string | null;
  location: string | null;
  notify: boolean;
  policy: boolean;
  checkin_time: string;
}>;

export const signIn = (payload: SignInRequest) =>
  apiRequest<SignInResponse>("/api/auth/signin/", {
    method: "POST",
    body: payload,
  });

export const signUp = (payload: SignUpRequest) =>
  apiRequest<SignUpResponse>("/api/auth/signup/", {
    method: "POST",
    body: payload,
  });

export const socialLogin = async (firebaseToken: string) => {
  const path = `/api/auth/?token=${encodeURIComponent(firebaseToken)}`;
  try {
    return await apiRequest<SignInResponse>(path, { method: "POST" });
  } catch (error) {
    if (
      !(error instanceof ApiError) ||
      error.status !== 400 ||
      !(
        error.payload &&
        typeof error.payload === "object" &&
        "log" in error.payload &&
        typeof error.payload.log === "string" &&
        error.payload.log.toLowerCase().includes("token used too early")
      )
    ) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return apiRequest<SignInResponse>(path, { method: "POST" });
  }
};

export const getOtp = (payload: GetOtpRequest) =>
  apiRequest<GetOtpResponse>("/api/auth/get-otp/", {
    method: "POST",
    body: payload,
  });

export const verifyOtp = (payload: VerifyOtpRequest) =>
  apiRequest<VerifyOtpResponse>("/api/auth/verify-otp/", {
    method: "POST",
    body: payload,
  });

export const resetPassword = (payload: ResetPasswordRequest) =>
  authenticatedApiRequest<ResetPasswordResponse>("/api/auth/reset-password/", {
    method: "POST",
    body: payload,
  });

export const getMe = () =>
  authenticatedApiRequest<GetMeResponse>("/api/auth/user/", {
    method: "GET",
  });

export const updateMe = (payload: UpdateMeRequest | FormData) =>
  authenticatedApiRequest<GetMeResponse>("/api/auth/user/", {
    method: "PATCH",
    body: payload,
  });

/** Permanently deletes the account and everything stored for it. */
export const deleteMe = () =>
  authenticatedApiRequest<null>("/api/auth/user/", {
    method: "DELETE",
  });

export const changePassword = (payload: ChangePasswordRequest) =>
  authenticatedApiRequest<ChangePasswordResponse>("/api/auth/user/", {
    method: "PATCH",
    body: payload,
  });

// SimpleJWT refresh endpoint. The backend at
// https://api.thehoneysucklecompany.com/api exposes this path; the body
// is { refresh: "<refresh-token>" } and the response is at minimum
// { access: "<new-access-token>" }, optionally with a rotated
// { refresh: "<new-refresh-token>" }.
export type RefreshTokensRequest = {
  refresh: string;
};

export type RefreshTokensResponse = {
  access: string;
  refresh?: string;
};

export const refreshTokens = (refresh: string) =>
  apiRequest<RefreshTokensResponse>("/api/auth/token/refresh/", {
    method: "POST",
    body: { refresh } satisfies RefreshTokensRequest,
  });

/**
 * Validate the persisted auth session at app launch.
 *
 * Returns:
 *   { ok: true }                              — tokens are valid (or were just refreshed)
 *   { ok: false, reason: "no-session" }      — nothing persisted; route to /welcome
 *   { ok: false, reason: "expired" }         — both access AND refresh are dead; cleared
 *   { ok: false, reason: "incomplete" }      — partial persisted state; cleared
 *
 * Side effects on failure: clears the auth store and routes to /auth.
 */
export type BootstrapResult =
  | { ok: true }
  | { ok: false; reason: "no-session" | "expired" | "incomplete" };

export async function bootstrapSession(): Promise<BootstrapResult> {
  const { accessToken, refreshToken, user } = useAuthStore.getState();

  if (!user && !accessToken && !refreshToken) {
    return { ok: false, reason: "no-session" };
  }

  // Partial state — should never happen, but never enter the app with a
  // mismatched user/token pair.
  if (!user || !accessToken) {
    useAuthStore.getState().clearAuthSession();
    return { ok: false, reason: "incomplete" };
  }

  // 1. Try the current access token.
  try {
    await getMe();
    return { ok: true };
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      // Network or server error — be permissive: keep the user in. The
      // next authenticated call will surface the real problem.
      return { ok: true };
    }
  }

  // 2. Access token is dead. Try the refresh token.
  if (!refreshToken) {
    useAuthStore.getState().clearAuthSession();
    return { ok: false, reason: "expired" };
  }

  try {
    const next = await refreshTokens(refreshToken);
    useAuthStore.getState().setTokens({
      access: next.access,
      refresh: next.refresh ?? refreshToken,
    });
    return { ok: true };
  } catch (error) {
    // 3. Refresh also dead. Force a clean sign-in.
    useAuthStore.getState().clearAuthSession();
    return { ok: false, reason: "expired" };
  }
}
