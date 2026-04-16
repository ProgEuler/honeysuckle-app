import { authenticatedApiRequest } from "./authenticatedClient";

export type CheckinPayload = {
  assesment: string;
  time: string;
  journal: string;
};

export type CheckinResponse = {
  status?: boolean;
  message?: string;
  [key: string]: unknown;
};

export const createCheckin = (payload: CheckinPayload) =>
  authenticatedApiRequest<CheckinResponse>("/api/checkin/", {
    method: "POST",
    body: payload,
  });
