import { Movie } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myListQueryKey, getLocalMyList } from "./useFetchMyList";

const useAddToMyList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movie: Movie) => {
      const list = getLocalMyList();
      if (!list.find((m) => m.id === movie.id)) {
        list.unshift(movie);
        localStorage.setItem("anixflix_watchlist", JSON.stringify(list));
      }
    },
    onMutate: async (movie: Movie) => {
      await queryClient.cancelQueries({ queryKey: myListQueryKey });
      const previous = queryClient.getQueryData<Movie[]>(myListQueryKey);
      queryClient.setQueryData<Movie[]>(myListQueryKey, (old = []) => [movie, ...old]);

      return { previous };
    },
    onError: (_err, _movie, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData<Movie[]>(myListQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: myListQueryKey });
    },
  });
};

export default useAddToMyList;
