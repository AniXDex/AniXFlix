import Header from '@/components/Header';
import MoviesRow from '@/components/movie/MoviesRow';
import { tmdb } from '@/lib/tmdb';
import { mapTmdbToAnix } from '@/lib/mapTmdbToAnix';

export default async function kPage() {
  const popular = await tmdb.getPopular('movie');
  
  return (
    <div>
      <Header />
      <div className="pt-20 px-4 md:px-14 relative z-20 flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-white mt-10 mb-4 capitalize">4k</h1>
        <MoviesRow title="Trending" movies={popular.slice(0, 20).map(m => mapTmdbToAnix(m))} />
      </div>
    </div>
  );
}