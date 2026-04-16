import { authenticatedApiRequest } from "./authenticatedClient";

export type Notification = {
  id: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  user: string;
};

export type NotificationsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
};

export const getNotifications = () =>
  authenticatedApiRequest<NotificationsResponse>("/api/notifications/", {
    method: "GET",
  });

export const markNotificationRead = (id: string) =>
  authenticatedApiRequest<Notification>(`/api/notifications/${id}/read/`, {
    method: "PATCH",
  });
