import { Movie } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myListQueryKey, getLocalMyList } from "./useFetchMyList";

const useRemoveFromMyList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: string) => {
      let list = getLocalMyList();
      list = list.filter((m) => m.id !== movieId);
      localStorage.setItem("anixflix_watchlist", JSON.stringify(list));
    },
    onMutate: async (movieId: string) => {
      await queryClient.cancelQueries({ queryKey: myListQueryKey });
      const previous = queryClient.getQueryData<Movie[]>(myListQueryKey);
      queryClient.setQueryData<Movie[]>(myListQueryKey, (old = []) =>
        old.filter((m) => m.id !== movieId)
      );

      return { previous };
    },
    onError: (_err, _movieId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData<Movie[]>(myListQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: myListQueryKey });
    },
  });
};

export default useRemoveFromMyList;
