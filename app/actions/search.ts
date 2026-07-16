"use server";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";
import { Movie } from "@/types/types";

export async function searchContent(query: string, filter: "all" | "movie" | "tv" | "anime" = "all"): Promise<Movie[]> {
  if (!query) return [];

  const results = await tmdb.search(query);

  const mapped = results
    .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: any) => mapTmdbToAnix(item));

  if (filter === "all") return mapped;

  if (filter === "anime") {
    return mapped.filter(
      (item: Movie) =>
        item.mediaType === "tv" &&
        results.find(
          (r: any) => r.id.toString() === item.id &&
          (r.original_language === "ja" || (r.genre_ids && r.genre_ids.includes(16)))
        )
    );
  }

  return mapped.filter((item: Movie) => item.mediaType === filter);
}

export async function getTrendingContent(): Promise<{ trendingMovies: Movie[]; trendingTv: Movie[]; popularMovies: Movie[]; popularTv: Movie[] }> {
  const [trendingMovieData, trendingTvData, popularMovieData, popularTvData] = await Promise.all([
    tmdb.getTrending("movie"),
    tmdb.getTrending("tv"),
    tmdb.getPopular("movie"),
    tmdb.getPopular("tv"),
  ]);

  return {
    trendingMovies: (trendingMovieData || []).slice(0, 12).map((m: any) => mapTmdbToAnix(m, true, true)),
    trendingTv: (trendingTvData || []).slice(0, 12).map((m: any) => mapTmdbToAnix(m, true, true)),
    popularMovies: (popularMovieData || []).slice(0, 12).map((m: any) => mapTmdbToAnix(m)),
    popularTv: (popularTvData || []).slice(0, 12).map((m: any) => mapTmdbToAnix(m)),
  };
}

export async function getSuggestions(query: string): Promise<Movie[]> {
  if (!query || query.trim().length < 2) return [];
  const results = await tmdb.search(query);
  return (results || [])
    .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 6)
    .map((item: any) => mapTmdbToAnix(item));
}

export async function getProviderContent(providerId: string, type: "movie" | "tv"): Promise<Movie[]> {
  try {
    const data = await tmdb.getDiscover(type, { withWatchProviders: providerId });
    return (data || []).slice(0, 12).map((m: any) => mapTmdbToAnix(m));
  } catch {
    return [];
  }
}
