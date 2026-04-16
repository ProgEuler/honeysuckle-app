import { authenticatedApiRequest } from "./authenticatedClient";

export type ReportLevelItem = {
  week: string;
  top_assesment: string | null;
  percentage: number;
};

export type ReportEmotionItem = {
  assesment: string;
  count: number;
  percentage: number;
};

export type ReportResponse = {
  level: ReportLevelItem[];
  top_emotions: ReportEmotionItem[];
  streak: number;
  average_mood: string;
  entries: number;
};

export const getReport = () =>
  authenticatedApiRequest<ReportResponse>("/api/report/", {
    method: "GET",
  });
