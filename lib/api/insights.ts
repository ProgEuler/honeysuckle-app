import { authenticatedApiRequest } from "./authenticatedClient";

export type InsightSummary = {
  assesment: string;
  count: number;
  percentage: number;
};

export type InsightsResponse = {
  entries: number;
  average_mood: string;
  mood_trend: string;
  best_day: {
    day: string;
    avg: number;
  };
  summary: InsightSummary[];
};

export const getInsights = () =>
  authenticatedApiRequest<InsightsResponse>("/api/insights/", {
    method: "GET",
  });
