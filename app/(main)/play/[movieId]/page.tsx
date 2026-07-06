import MyPlayer from "@/components/player";
import PlayerDetails from "@/components/player/PlayerDetails";
import { Suspense } from "react";
import HistoryTracker from "@/components/HistoryTracker";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";

interface Props {
  params: Promise<{ movieId: string }>;
  searchParams: Promise<{ s?: string, e?: string }>;
}

// Separate component for the HistoryTracker to avoid blocking MyPlayer
async function WatchHistoryUpdater({ movieId, type }: { movieId: string, type: "movie" | "tv" }) {
  const tmdbData = await tmdb.getDetails(type, movieId);
  if (!tmdbData || tmdbData.success === false) return null;
  const mappedMovie = mapTmdbToAnix(tmdbData);
  return <HistoryTracker movie={mappedMovie} />;
}

// Skeleton loader for PlayerDetails
function PlayerDetailsSkeleton() {
  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen pt-8 px-4 md:px-8 pb-20 flex flex-col gap-8 animate-pulse">
      <div className="flex gap-10 border-b border-white/5 pb-2">
        <div className="w-24 h-6 bg-white/5 rounded"></div>
        <div className="w-24 h-6 bg-white/5 rounded"></div>
        <div className="w-24 h-6 bg-white/5 rounded hidden md:block"></div>
      </div>
      <div className="w-full h-[300px] bg-[#141417] rounded-2xl border border-white/5"></div>
      <div className="flex flex-col gap-4 mt-8">
        <div className="w-48 h-8 bg-white/5 rounded mb-4"></div>
        <div className="w-full h-32 bg-[#141417] rounded-xl border border-white/5"></div>
        <div className="w-full h-32 bg-[#141417] rounded-xl border border-white/5"></div>
        <div className="w-full h-32 bg-[#141417] rounded-xl border border-white/5"></div>
      </div>
    </div>
  );
}

export default async function Page({ params, searchParams }: Props) {
  const { movieId } = await params;
  const { s, e } = await searchParams;

  const parsedSeason = s ? parseInt(s, 10) : 1;
  const parsedEpisode = e ? parseInt(e, 10) : 1;
  
  // Implicitly determine media type based on the presence of season/episode params
  const mediaType = (s && e) ? "tv" : "movie";

  // Render MyPlayer immediately without waiting for TMDB data
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] relative pt-20">
      
      {/* Background history update */}
      <Suspense fallback={null}>
        <WatchHistoryUpdater movieId={movieId} type={mediaType} />
      </Suspense>

      {/* Instant Video Player */}
      <MyPlayer src={""} title="" thumbnails={[]} tmdbId={movieId} mediaType={mediaType} season={parsedSeason} episode={parsedEpisode} />
      
      {/* Heavy Details Data loaded underneath */}
      <Suspense fallback={<PlayerDetailsSkeleton />}>
        <PlayerDetails tmdbId={movieId} type={mediaType} season={parsedSeason} episode={parsedEpisode} />
      </Suspense>
    </div>
  );
}
