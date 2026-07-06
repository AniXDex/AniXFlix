import HomeClient from "./HomeClient";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";

// Next.js config to revalidate homepage data every hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch multiple rows in parallel for speed
  const [
    trendingMovieData,
    trendingTvData,
    topRatedMovieData,
    topRatedTvData,
    actionMovieData,
    actionTvData,
    comedyMovieData,
    comedyTvData,
    animationMovieData,
    animationTvData,
    netflixData,
  ] = await Promise.all([
    tmdb.getTrending("movie"),
    tmdb.getTrending("tv"),
    tmdb.getTopRated("movie"),
    tmdb.getTopRated("tv"),
    tmdb.getDiscover("movie", { genreId: "28" }), // Action Movie
    tmdb.getDiscover("tv", { genreId: "10759" }), // Action & Adventure TV
    tmdb.getDiscover("movie", { genreId: "35" }), // Comedy Movie
    tmdb.getDiscover("tv", { genreId: "35" }), // Comedy TV
    tmdb.getDiscover("movie", { genreId: "878" }), // Sci-Fi Movie
    tmdb.getDiscover("tv", { genreId: "10765" }), // Sci-Fi & Fantasy TV
    tmdb.getDiscover("movie", { withWatchProviders: "8" }), // Netflix
  ]);

  // Map to AniXFlix internal format
  const baseTrendingMovies = trendingMovieData.slice(0, 20).map((m) => mapTmdbToAnix(m, true, true));
  
  // For the Hero Banner (top 10 trending movies), fetch their detailed images to guarantee titled English backdrops!
  const top10Details = await Promise.all(
    baseTrendingMovies.slice(0, 10).map(m => tmdb.getDetails("movie", m.publicId))
  );
  
  const trendingMovies = baseTrendingMovies.map((movie, index) => {
    if (index < 10 && top10Details[index]?.images?.backdrops) {
      const backdrops = top10Details[index].images.backdrops;
      const bestBackdrop = backdrops
        .filter((b: any) => b.iso_639_1 === "en")
        .sort((a: any, b: any) => b.vote_average - a.vote_average)[0]
        ?? backdrops[0];
      
      if (bestBackdrop) {
        movie.backdropUrl = `https://image.tmdb.org/t/p/original${bestBackdrop.file_path}`;
      }
    }
    return movie;
  });
  const trendingSeries = trendingTvData.slice(0, 20).map((m) => mapTmdbToAnix(m, true, true));
  
  const topRatedMovies = topRatedMovieData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  const topRatedSeries = topRatedTvData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  
  const actionMovies = actionMovieData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  const actionSeries = actionTvData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  
  const comedyMovies = comedyMovieData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  const comedySeries = comedyTvData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  
  const animationMovies = animationMovieData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  const animationSeries = animationTvData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  
  const netflix = netflixData.slice(0, 20).map((m) => mapTmdbToAnix(m));

  return (
    <HomeClient 
      trendingMovies={trendingMovies}
      trendingSeries={trendingSeries}
      topRatedMovies={topRatedMovies}
      topRatedSeries={topRatedSeries}
      actionMovies={actionMovies}
      actionSeries={actionSeries}
      comedyMovies={comedyMovies}
      comedySeries={comedySeries}
      animationMovies={animationMovies}
      animationSeries={animationSeries}
      netflix={netflix}
    />
  );
}
