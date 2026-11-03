import { getAssessmentQuestions } from "@/lib/api/assessment";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const assessmentQuestionsQueryKey = ["assessment", "questions"] as const;

export const useAssessmentQuestions = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: assessmentQuestionsQueryKey,
    queryFn: getAssessmentQuestions,
    enabled: Boolean(accessToken),
    // Questions change rarely; refetch at most every 10 minutes.
    staleTime: 1000 * 60 * 10,
  });
};
