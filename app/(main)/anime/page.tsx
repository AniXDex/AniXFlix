import Header from '@/components/Header';
import MoviesRow from '@/components/movie/MoviesRow';
import { tmdb } from '@/lib/tmdb';
import { mapTmdbToAnix } from '@/lib/mapTmdbToAnix';

export default async function animePage() {
  const popular = await tmdb.getDiscover('tv', { genreId: '16', originalLanguage: 'ja', sortBy: 'popularity.desc' });
  const topRated = await tmdb.getDiscover('tv', { genreId: '16', originalLanguage: 'ja', sortBy: 'vote_average.desc' });
  const newReleases = await tmdb.getDiscover('tv', { genreId: '16', originalLanguage: 'ja', sortBy: 'first_air_date.desc' });
  
  return (
    <div className="bg-[#09090b] min-h-screen">
      <Header />
      <div className="pt-24 px-4 md:px-14 relative z-20 flex flex-col gap-8 pb-20">
        <h1 className="text-3xl font-bold text-white mt-6 mb-2">Anime</h1>
        
        <MoviesRow title="Trending Anime" movies={popular.slice(0, 20).map(m => mapTmdbToAnix(m))} />
        <MoviesRow title="Top Rated Classics" movies={topRated.slice(0, 20).map(m => mapTmdbToAnix(m))} />
        <MoviesRow title="New Releases" movies={newReleases.slice(0, 20).map(m => mapTmdbToAnix(m))} />
      </div>
    </div>
  );
}