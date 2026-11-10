import { authenticatedApiRequest } from "./authenticatedClient";

export type InsightSummary = {
  assesment: string;
  count: number;
  percentage: number;
};

export type InsightDay = {
  date: string; // YYYY-MM-DD, user's timezone
  mood: number | null;
  anxiety: number | null;
  sleep: number | null;
};

export type InsightsResponse = {
  entries: number;
  average_mood: string;
  // Optional: older backends don't send these.
  average_anxiety?: number | null;
  average_sleep?: number | null;
  mood_trend: string;
  best_day: {
    day: string | null;
    avg: number;
  };
  summary: InsightSummary[];
  daily?: InsightDay[];
  top_factors?: { factor: string; count: number }[];
};

export const getInsights = () =>
  authenticatedApiRequest<InsightsResponse>("/api/insights/", {
    method: "GET",
  });
