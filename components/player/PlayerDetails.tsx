import React from "react";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";
import Image from "next/image";
import Link from "next/link";
import MovieCard from "@/components/movie/MovieCard";
import PlayerTabs from "./PlayerTabs";

export default async function PlayerDetails({ tmdbId, type, season, episode }: { tmdbId: string, type: "tv" | "movie", season: number, episode: number }) {
  const tmdbData = await tmdb.getDetails(type, tmdbId);
  if (!tmdbData || tmdbData.success === false) return null;
  
  const mappedMovie = mapTmdbToAnix(tmdbData);
  let episodes: any[] = [];
  let currentEpisodeData = null;
  
  if (type === "tv") {
    const seasonData = await tmdb.getSeasonDetails(tmdbId, season);
    episodes = seasonData?.episodes || [];
    currentEpisodeData = episodes.find((ep: any) => ep.episode_number === episode) || episodes[0];
  }

  const similar = tmdbData.recommendations?.results?.length > 0 
    ? tmdbData.recommendations.results 
    : (tmdbData.similar?.results || []);
  const mappedSimilar = similar.slice(0, 10).map((m: any) => mapTmdbToAnix(m));

  return (
    <div id="episodes" className="w-full bg-[#0a0a0a] min-h-screen text-white pt-8 px-4 md:px-8">
      <PlayerTabs 
        type={type} 
        episodes={episodes} 
        currentEpisodeData={currentEpisodeData}
        season={season}
        episode={episode}
        mappedSimilar={mappedSimilar}
        tmdbId={tmdbId}
        details={tmdbData}
      />
    </div>
  );
}
