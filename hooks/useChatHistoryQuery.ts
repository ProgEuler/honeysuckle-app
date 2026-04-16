import { getChatHistory } from "@/lib/api/chat";
import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";

const getPageFromUrl = (url: string | null) => {
  if (!url) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(url);
    const page = parsedUrl.searchParams.get("page");
    if (!page) {
      return undefined;
    }

    const pageNumber = Number(page);
    return Number.isNaN(pageNumber) ? undefined : pageNumber;
  } catch {
    return undefined;
  }
};

export const chatHistoryQueryKey = (pageSize: number) =>
  ["chat", "history", pageSize] as const;

export const useChatHistoryQuery = (pageSize = 20) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useInfiniteQuery({
    queryKey: chatHistoryQueryKey(pageSize),
    queryFn: ({ pageParam = 1 }) =>
      getChatHistory({
        page: pageParam,
        page_size: pageSize,
      }),
    enabled: Boolean(accessToken),
    getNextPageParam: (lastPage) => getPageFromUrl(lastPage.next),
    initialPageParam: 1,
    staleTime: 1000 * 30,
    retry: 1,
  });
};
