import {
  getQuestionnaire,
  getQuestionnaireResults,
  getQuestionnaireTrends,
  getQuestionnaires,
  submitQuestionnaire,
} from "@/lib/api/questionnaires";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const questionnairesQueryKey = ["assessments"] as const;

export const useQuestionnaires = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: questionnairesQueryKey,
    queryFn: getQuestionnaires,
    enabled: Boolean(accessToken),
  });
};

export const useQuestionnaire = (key: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: [...questionnairesQueryKey, key],
    queryFn: () => getQuestionnaire(key),
    enabled: Boolean(accessToken && key),
    staleTime: 1000 * 60 * 10,
  });
};

export const useQuestionnaireResults = (key: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: [...questionnairesQueryKey, key, "results"],
    queryFn: () => getQuestionnaireResults(key),
    enabled: Boolean(accessToken && key),
  });
};

export const useQuestionnaireTrends = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: [...questionnairesQueryKey, "trends"],
    queryFn: getQuestionnaireTrends,
    enabled: Boolean(accessToken),
  });
};

export const useSubmitQuestionnaire = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitQuestionnaire,
    onSuccess: () => {
      // Due dates and result history both change.
      queryClient.invalidateQueries({ queryKey: questionnairesQueryKey });
    },
  });
};
