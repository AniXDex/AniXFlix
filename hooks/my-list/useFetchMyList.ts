import { Movie } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const myListQueryKey = ["my-list"] as const;

export const getLocalMyList = (): Movie[] => {
  if (typeof window === "undefined") return [];
  try {
    const list = localStorage.getItem("anixflix_watchlist");
    return list ? JSON.parse(list) : [];
  } catch {
    return [];
  }
};

const useFetchMyList = () => {
  return useQuery({
    queryKey: myListQueryKey,
    queryFn: async () => getLocalMyList(),
    select: (movies) => movies.map((m) => m.id),
  });
};

export default useFetchMyList;
