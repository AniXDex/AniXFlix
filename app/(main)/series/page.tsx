import MoviesRow from "@/components/movie/MoviesRow";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";

export default async function SeriesPage() {
  const topRated = await tmdb.getTopRated("tv");
  const popular = await tmdb.getPopular("tv");
  const onAir = await tmdb.getOnTheAir();

  return (
    <div className="bg-[#09090b] min-h-screen">
      <div className="pt-20 px-4 md:px-14 relative z-20 flex flex-col gap-10">
        <MoviesRow title="Popular Series" movies={popular.slice(0, 20).map(m => mapTmdbToAnix(m))} />
        <MoviesRow title="Top Rated" movies={topRated.slice(0, 20).map(m => mapTmdbToAnix(m))} />
        <MoviesRow title="On The Air" movies={onAir.slice(0, 20).map(m => mapTmdbToAnix(m))} />
      </div>
    </div>
  );
}