"use server";

import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";
import { Movie } from "@/types/types";

export async function getMoviesByProvider(providerId: string): Promise<Movie[]> {
  try {
    const data = await tmdb.getDiscover("movie", { withWatchProviders: providerId });
    return (data || []).slice(0, 20).map(m => mapTmdbToAnix(m));
  } catch (error) {
    console.error("Error fetching provider movies:", error);
    return [];
  }
}
