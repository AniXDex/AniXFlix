"use server";

import { tmdb } from "@/lib/tmdb";

export async function getSeasonEpisodes(movieId: string, seasonNumber: number) {
  try {
    const seasonData = await tmdb.getSeasonDetails(movieId, seasonNumber);
    return seasonData?.episodes || [];
  } catch (error) {
    console.error("Failed to fetch season episodes:", error);
    return [];
  }
}
