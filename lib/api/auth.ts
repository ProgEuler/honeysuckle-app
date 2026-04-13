import { authenticatedApiRequest } from "./authenticatedClient";
import { apiRequest } from "./client";

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
  notify: boolean;
  checkin_time: string;
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
  [key: string]: unknown;
};

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

export const getMe = () =>
  authenticatedApiRequest<GetMeResponse>("/api/auth/user/", {
    method: "GET",
  });
