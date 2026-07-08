export const PLAYBACK_KEY = "anixflix_playback";

export interface PlaybackData {
  tmdbId: string;
  mediaType: "movie" | "tv";
  season: number;
  episode: number;
}
