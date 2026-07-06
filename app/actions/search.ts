"use server";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";
import { Movie } from "@/types/types";

export async function searchContent(query: string, filter: "all" | "anime" = "all"): Promise<Movie[]> {
  if (!query) return [];
  
  const results = await tmdb.search(query);
  
  if (filter === "anime") {
    // Filter for TV shows that are likely anime (Japanese language or animation genre)
    return results
      .filter((item: any) => 
        item.media_type === "tv" && 
        (item.original_language === "ja" || (item.genre_ids && item.genre_ids.includes(16)))
      )
      .map((item: any) => mapTmdbToAnix(item));
  }
  
  // Exclude people/companies, only return watchable content
  return results
    .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: any) => mapTmdbToAnix(item));
}
