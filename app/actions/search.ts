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
