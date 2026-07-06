import Header from "@/components/Header";
import MoviesRow from "@/components/movie/MoviesRow";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";
import SearchInput from "@/components/SearchInput";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q;
  let results: any[] = [];
  if (query) {
    results = await tmdb.search(query);
  }

  const movies = results.filter(r => r.media_type === "movie" || r.media_type === "tv").map(m => mapTmdbToAnix(m));

  return (
    <div>
      <Header />
      <div className="pt-24 px-4 md:px-14 relative z-20 flex flex-col gap-10 min-h-screen">
        <h1 className="text-3xl font-bold">Search</h1>
        <SearchInput />
        
        {query && movies.length > 0 && (
          <MoviesRow title={`Results for "${query}"`} movies={movies} />
        )}
        {query && movies.length === 0 && (
          <p className="text-white/60">No results found for "{query}".</p>
        )}
      </div>
    </div>
  );
}