import { authenticatedApiRequest } from "./authenticatedClient";
import { apiRequest } from "./client";

export type SignInRequest = {
  email: string;
  password: string;
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

export const signIn = (payload: SignInRequest) =>
  apiRequest<SignInResponse>("/api/auth/signin/", {
    method: "POST",
    body: payload,
  });

export const getMe = () =>
  authenticatedApiRequest<GetMeResponse>("/api/auth/user/", {
    method: "GET",
  });
