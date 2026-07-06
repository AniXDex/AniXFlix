import { useQuery } from "@tanstack/react-query";
import { getLocalMyList, myListQueryKey } from "./useFetchMyList";
import { Movie } from "@/types/types";

const useFetchMyListMovies = () => {
  return useQuery<Movie[]>({
    queryKey: myListQueryKey,
    queryFn: async () => getLocalMyList(),
  });
};

export default useFetchMyListMovies;
