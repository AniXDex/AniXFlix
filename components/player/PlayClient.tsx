"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MyPlayer from "./index";
import PlayerTabs from "./PlayerTabs";
import HistoryTracker from "@/components/HistoryTracker";
import { PLAYBACK_KEY, PlaybackData } from "@/lib/playback";
import { getPlayPageData } from "@/app/actions/play";

export default function PlayClient() {
  const router = useRouter();
  const [data, setData] = useState<PlaybackData | null>(null);
  const [ready, setReady] = useState(false);
  const handled = useRef(false);
  const [details, setDetails] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisodeData, setCurrentEpisodeData] = useState<any>(null);
  const [mappedSimilar, setMappedSimilar] = useState<any[]>([]);
  const [mappedMovie, setMappedMovie] = useState<any>(null);
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [detailsError, setDetailsError] = useState(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    let isMounted = true;

    const raw = sessionStorage.getItem(PLAYBACK_KEY);
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      const parsed: PlaybackData = JSON.parse(raw);
      setData(parsed);

      getPlayPageData(parsed.tmdbId, parsed.mediaType, parsed.season, parsed.episode)
        .then((result) => {
          if (!isMounted) return;
          if (result) {
            setDetails(result.tmdbData);
            setEpisodes(result.episodes);
            setCurrentEpisodeData(result.currentEpisodeData);
            setMappedSimilar(result.mappedSimilar);
            setMappedMovie(result.mappedMovie);
          } else {
            setDetailsError(true);
          }
          setDetailsLoaded(true);
        })
        .catch(() => {
          if (!isMounted) return;
          setDetailsError(true);
          setDetailsLoaded(true);
        });
    } catch {
      router.replace("/");
      return;
    }
    setReady(true);
    return () => { isMounted = false; };
  }, []);

  if (!ready || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#09090b] items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] relative pt-20">
      {mappedMovie && <HistoryTracker movie={mappedMovie} />}
      <MyPlayer
        src=""
        title=""
        thumbnails={[]}
        tmdbId={data.tmdbId}
        mediaType={data.mediaType}
        season={data.season}
        episode={data.episode}
      />
      {detailsLoaded && !detailsError && details && (
        <div id="episodes" className="w-full bg-[#0a0a0a] text-white pt-8 px-4 md:px-14">
          <PlayerTabs
            type={data.mediaType}
            episodes={episodes}
            currentEpisodeData={currentEpisodeData}
            season={data.season}
            episode={data.episode}
            mappedSimilar={mappedSimilar}
            tmdbId={data.tmdbId}
            details={details}
          />
        </div>
      )}
      {detailsLoaded && detailsError && (
        <div id="episodes" className="w-full bg-[#0a0a0a] text-white pt-8 px-4 md:px-14">
          <p className="text-white/50 text-sm py-8">Failed to load details.</p>
        </div>
      )}
    </div>
  );
}
