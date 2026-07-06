"use client";
import Header from "@/components/Header";
import MoviesRow from "@/components/movie/MoviesRow";
import useFetchMyListMovies from "@/hooks/my-list/useFetchMyListMovies";

export default function MyListPage() {
  const { data: movies = [], isLoading } = useFetchMyListMovies();

  return (
    <div>
      <Header />
      <div className="pt-24 px-4 md:px-14 relative z-20 flex flex-col gap-10 min-h-screen">
        <h1 className="text-3xl font-bold">My List</h1>
        
        {isLoading ? (
          <p className="text-white/60">Loading...</p>
        ) : movies.length > 0 ? (
          <MoviesRow title="Saved Content" movies={movies} />
        ) : (
          <p className="text-white/60">Your list is empty. Add movies and TV shows you want to watch later!</p>
        )}
      </div>
    </div>
  );
}