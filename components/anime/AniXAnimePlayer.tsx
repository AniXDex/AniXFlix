"use client";

import React, { useState, useEffect, useRef } from "react";
import { Server, Play, Volume2, ShieldCheck, ChevronRight, ChevronLeft, Search, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Anime } from "@/types/anime";
import SafeImage from "@/components/SafeImage";

interface AniXAnimePlayerProps {
  anilistId: number;
  anime: Anime;
}

const PROVIDER_NAMES: Record<string, string> = {
  allmanga: "AllManga",
  reanime: "ReAnime",
  anikoto: "AniKoto",
  animegg: "AnimeGG",
  kaa: "KickAssAnime",
  anineko: "AniNeko",
  "2dhive": "2DHive",
  animenosub: "AnimeNoSub",
  anizone: "AniZone",
  anibd: "AniBD",
};

export default function AniXAnimePlayer({ anilistId, anime }: AniXAnimePlayerProps) {
  const [episodesData, setEpisodesData] = useState<any>(null);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);
  const [episodeError, setEpisodeError] = useState(false);

  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [audio, setAudio] = useState<"sub" | "dub">("sub");
  const [selectedProvider, setSelectedProvider] = useState<string>("allmanga");

  const [watchData, setWatchData] = useState<any>(null);
  const [isLoadingWatch, setIsLoadingWatch] = useState(false);
  const [watchError, setWatchError] = useState<string | null>(null);

  const [episodeSearch, setEpisodeSearch] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Load Episode & Provider Map from AniXAnime Server
  useEffect(() => {
    let isMounted = true;
    setIsLoadingEpisodes(true);
    setEpisodeError(false);

    fetch(`/api/anixanime/episodes/${anilistId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load AniXAnime server data");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setEpisodesData(data);
        // Find first valid provider from keys
        const validProviders = Object.keys(data).filter(
          (k) => !["page", "type", "mappings", "_unknownProviders"].includes(k) && data[k]?.episodes
        );
        if (validProviders.length > 0 && !validProviders.includes(selectedProvider)) {
          setSelectedProvider(validProviders[0]);
        }
        setIsLoadingEpisodes(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("AniXAnime episodes error:", err);
        setEpisodeError(true);
        setIsLoadingEpisodes(false);
      });

    return () => {
      isMounted = false;
    };
  }, [anilistId]);

  // 2. Fetch Watch Source URL when provider, episode, or audio changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedProvider || !anilistId) return;

    setIsLoadingWatch(true);
    setWatchError(null);
    setWatchData(null);

    const watchUrl = `/api/anixanime/watch/${selectedProvider}/${anilistId}/${audio}/${selectedProvider}-${selectedEpisode}`;

    fetch(watchUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Server ${selectedProvider} returned status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setWatchData(data);
        setIsLoadingWatch(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("AniXAnime watch error:", err);
        setWatchError(err.message || "Failed to load video stream from selected server");
        setIsLoadingWatch(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProvider, anilistId, selectedEpisode, audio]);

  // Available Providers in AniXAnime response
  const availableProviders = episodesData
    ? Object.keys(episodesData).filter(
        (k) => !["page", "type", "mappings", "_unknownProviders"].includes(k) && episodesData[k]?.episodes
      )
    : ["allmanga", "reanime", "anikoto", "animegg", "kaa"];

  // Total Episode Count (from anime or server mappings)
  const totalEpisodes = anime.episodes || 100;
  const episodeList = Array.from({ length: totalEpisodes }, (_, i) => i + 1).filter((ep) =>
    episodeSearch.trim() === "" || ep.toString() === episodeSearch.trim()
  );

  // Extract embed/stream URL from watchData
  const streamEmbedUrl =
    watchData?.url ||
    watchData?.embed ||
    watchData?.stream ||
    watchData?.sources?.[0]?.url ||
    watchData?.streamUrl ||
    null;

  return (
    <div className="flex flex-col w-full bg-[#09090b]">
      {/* PLAYER CONTAINER */}
      <div className="relative w-full aspect-video md:h-[80vh] bg-black overflow-hidden group shadow-2xl border-b border-white/10">
        {isLoadingWatch && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-3" />
            <p className="text-white text-sm font-bold tracking-wide">
              Loading AniXAnime Server ({PROVIDER_NAMES[selectedProvider] || selectedProvider})...
            </p>
            <p className="text-white/40 text-xs mt-1">
              Episode {selectedEpisode} &bull; {audio.toUpperCase()}
            </p>
          </div>
        )}

        {watchError && !isLoadingWatch && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-1">Stream Load Error</h3>
            <p className="text-sm text-white/60 max-w-md mb-4">{watchError}</p>
            <div className="flex items-center gap-3">
              {availableProviders.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProvider(p)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Try {PROVIDER_NAMES[p] || p}
                </button>
              ))}
            </div>
          </div>
        )}

        {streamEmbedUrl ? (
          <iframe
            ref={iframeRef}
            src={streamEmbedUrl}
            onLoad={() => setIsLoadingWatch(false)}
            className="absolute inset-0 w-full h-full border-none z-10"
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
          />
        ) : (
          !isLoadingWatch && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/95 p-6 text-center">
              <Sparkles className="w-10 h-10 text-red-500 mb-2" />
              <h3 className="text-base font-bold text-white">Connecting to AniXAnime Stream...</h3>
              <p className="text-xs text-white/50 mt-1 max-w-md">
                Select an episode or server below to initiate direct multi-provider streaming.
              </p>
            </div>
          )
        )}
      </div>

      {/* SERVER CONTROL BAR */}
      <div className="bg-[#141417] border-b border-white/5 px-4 md:px-14 py-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Server Providers */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
            <div className="flex items-center gap-1.5 text-white/50 shrink-0">
              <Server className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider">AniXAnime Server:</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {availableProviders.map((prov) => (
                <button
                  key={prov}
                  onClick={() => setSelectedProvider(prov)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedProvider === prov
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                      : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                  }`}
                >
                  {PROVIDER_NAMES[prov] || prov}
                </button>
              ))}
            </div>
          </div>

          {/* Sub / Dub Audio Toggle */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setAudio("sub")}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                audio === "sub" ? "bg-red-600 text-white shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => setAudio("dub")}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                audio === "dub" ? "bg-red-600 text-white shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              DUB
            </button>
          </div>
        </div>
      </div>

      {/* ANIXANIME EPISODES SELECTOR */}
      <div className="px-4 md:px-14 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-red-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Episodes</h2>
            <span className="text-xs font-semibold text-white/40 bg-white/5 px-2.5 py-1 rounded-full">
              Ep {selectedEpisode} of {totalEpisodes}
            </span>
          </div>

          {/* Episode Search & Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedEpisode((prev) => Math.max(1, prev - 1))}
              disabled={selectedEpisode <= 1}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setSelectedEpisode((prev) => Math.min(totalEpisodes, prev + 1))}
              disabled={selectedEpisode >= totalEpisodes}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            <div className="relative w-44">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Find episode #..."
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
                className="w-full bg-[#141417] border border-white/10 focus:border-red-500 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Episode Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2 max-h-[350px] overflow-y-auto pr-1">
          {episodeList.map((epNum) => (
            <button
              key={epNum}
              onClick={() => setSelectedEpisode(epNum)}
              className={`py-2.5 rounded-xl font-black text-xs transition-all ${
                selectedEpisode === epNum
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105"
                  : "bg-[#141417] hover:bg-white/10 text-white/70 hover:text-white border border-white/5"
              }`}
            >
              {epNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
