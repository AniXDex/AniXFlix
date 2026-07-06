import Header from "@/components/Header";
import MoviesRow from "@/components/movie/MoviesRow";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";

export default async function NewPopularPage() {
  const trending = await tmdb.getTrending("all");
  const nowPlaying = await tmdb.getNowPlaying();

  return (
    <div>
      <Header />
      <div className="pt-20 px-4 md:px-14 relative z-20 flex flex-col gap-10">
        <MoviesRow title="Trending Worldwide" movies={trending.slice(0, 20).map(m => mapTmdbToAnix(m))} />
        <MoviesRow title="Now Playing in Theaters" movies={nowPlaying.slice(0, 20).map(m => mapTmdbToAnix(m))} />
      </div>
    </div>
  );
}