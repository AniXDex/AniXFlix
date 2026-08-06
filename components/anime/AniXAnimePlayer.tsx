"use client";

import React, { useState, useEffect, useRef } from "react";
import { Server, Play, Volume2, ShieldCheck, ChevronRight, ChevronLeft, Search, Loader2, Sparkles, AlertCircle, Share2, Sun, Monitor, X, Check } from "lucide-react";
import { Anime } from "@/types/anime";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";

interface AniXAnimePlayerProps {
  anilistId: number;
  anime: Anime;
  initialEpisode?: number;
  similarAnime?: Anime[];
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

export default function AniXAnimePlayer({ anilistId, anime, initialEpisode = 1, similarAnime = [] }: AniXAnimePlayerProps) {
  const [episodesData, setEpisodesData] = useState<any>(null);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(true);

  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
  const [audio, setAudio] = useState<"sub" | "dub">("sub");
  const [selectedProvider, setSelectedProvider] = useState<string>("allmanga");

  const [watchData, setWatchData] = useState<any>(null);
  const [isLoadingWatch, setIsLoadingWatch] = useState(false);
  const [watchError, setWatchError] = useState<string | null>(null);

  // Toggles
  const [autoNext, setAutoNext] = useState(true);
  const [autoSkip, setAutoSkip] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [theatreMode, setTheatreMode] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [showServerDropdown, setShowServerDropdown] = useState(false);

  const [episodeSearch, setEpisodeSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync initial episode
  useEffect(() => {
    if (initialEpisode && initialEpisode !== selectedEpisode) {
      setSelectedEpisode(initialEpisode);
    }
  }, [initialEpisode]);

  // 1. Load Episode & Provider Map from AniXAnime Server
  useEffect(() => {
    let isMounted = true;
    setIsLoadingEpisodes(true);

    fetch(`/api/anixanime/episodes/${anilistId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load AniXAnime server data");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setEpisodesData(data);
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
        setWatchError(err.message || "Failed to load stream from selected server");
        setIsLoadingWatch(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProvider, anilistId, selectedEpisode, audio]);

  const availableProviders = episodesData
    ? Object.keys(episodesData).filter(
        (k) => !["page", "type", "mappings", "_unknownProviders"].includes(k) && episodesData[k]?.episodes
      )
    : ["allmanga", "reanime", "anikoto", "animegg", "kaa"];

  const totalEpisodes = anime.episodes || 24;
  const episodeList = Array.from({ length: totalEpisodes }, (_, i) => i + 1).filter((ep) =>
    episodeSearch.trim() === "" || ep.toString().includes(episodeSearch.trim())
  );

  const streamEmbedUrl =
    watchData?.stream_url ||
    watchData?.streamUrl ||
    watchData?.url ||
    watchData?.embed ||
    watchData?.stream ||
    watchData?.sources?.[0]?.url ||
    watchData?.streams?.[0]?.url ||
    null;

  const isDirectVideo =
    streamEmbedUrl &&
    (streamEmbedUrl.includes(".m3u8") ||
      streamEmbedUrl.includes(".mp4") ||
      watchData?.hls ||
      watchData?.isM3U8);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`w-full ${lightMode ? "bg-white text-black" : "bg-[#09090b] text-white"} transition-colors duration-300`}>
      <div className={`max-w-[1700px] mx-auto px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-6 ${theatreMode ? "lg:flex-col" : ""}`}>
        
        {/* MAIN VIDEO PLAYER & CONTROLS COLUMN (LEFT/CENTER) */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          
          {/* THEATRE ASPECT PLAYER CONTAINER */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            {isLoadingWatch && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                <p className="text-white text-sm font-bold tracking-wide">
                  Connecting to {PROVIDER_NAMES[selectedProvider] || selectedProvider}...
                </p>
                <p className="text-white/40 text-xs mt-1">
                  Episode {selectedEpisode} &bull; {audio.toUpperCase()}
                </p>
              </div>
            )}

            {watchError && !isLoadingWatch && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3 animate-bounce" />
                <h3 className="text-lg font-bold text-white mb-1">Server Unavailable</h3>
                <p className="text-sm text-white/60 max-w-md mb-4">{watchError}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
                  {availableProviders.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProvider(p)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedProvider === p ? "bg-purple-600 text-white" : "bg-white/10 hover:bg-white/20 text-white/90"
                      }`}
                    >
                      Switch to {PROVIDER_NAMES[p] || p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {streamEmbedUrl ? (
              isDirectVideo ? (
                <video
                  src={streamEmbedUrl}
                  controls
                  autoPlay
                  onCanPlay={() => setIsLoadingWatch(false)}
                  className="absolute inset-0 w-full h-full object-contain z-10"
                />
              ) : (
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
              )
            ) : (
              !isLoadingWatch && !watchError && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/95 p-6 text-center">
                  <Sparkles className="w-10 h-10 text-purple-500 mb-2" />
                  <h3 className="text-base font-bold text-white">Initiating Stream...</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-md">
                    Select an episode or server below to play.
                  </p>
                </div>
              )
            )}
          </div>

          {/* QUICK TOGGLES ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141417] p-3 md:p-4 rounded-xl border border-white/5 text-xs font-semibold">
            <div className="flex flex-wrap items-center gap-6">
              {/* Auto Next */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-white/70">Auto Next</span>
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => setAutoNext(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-checked:bg-purple-600 rounded-full relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform peer-checked:after:translate-x-4"></div>
              </label>

              {/* Auto Skip Intro/Outro */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-white/70">Auto Skip Intro/Outro</span>
                <input
                  type="checkbox"
                  checked={autoSkip}
                  onChange={(e) => setAutoSkip(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-checked:bg-purple-600 rounded-full relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform peer-checked:after:translate-x-4"></div>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {/* Light */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Sun size={14} className="text-amber-400" />
                <span className="text-white/70">Light</span>
                <input
                  type="checkbox"
                  checked={lightMode}
                  onChange={(e) => setLightMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-checked:bg-amber-500 rounded-full relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform peer-checked:after:translate-x-4"></div>
              </label>

              {/* Theatre */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Monitor size={14} className="text-purple-400" />
                <span className="text-white/70">Theatre</span>
                <input
                  type="checkbox"
                  checked={theatreMode}
                  onChange={(e) => setTheatreMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-checked:bg-purple-600 rounded-full relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-transform peer-checked:after:translate-x-4"></div>
              </label>
            </div>
          </div>

          {/* WARNING DISCLAIMER ALERT */}
          {showWarning && (
            <div className="flex items-center justify-between gap-3 bg-amber-950/30 border border-amber-500/20 text-amber-300 px-4 py-3 rounded-xl text-xs font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-amber-400" />
                <span>If the current server doesn't work, feel free to try the other available servers.</span>
              </div>
              <button onClick={() => setShowWarning(false)} className="text-amber-400/60 hover:text-amber-300">
                <X size={14} />
              </button>
            </div>
          )}

          {/* EPISODE TITLE HEADER */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              EPISODE {selectedEpisode}
            </span>
            <h1 className="text-2xl font-black tracking-tight">{anime.title}</h1>
          </div>

          {/* ANIME INFO & CONTROLS ROW */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141417] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10">
                <img src={anime.coverImage || anime.coverMedium} alt={anime.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold line-clamp-1">{anime.title}</h3>
                <span className="text-xs text-white/50">
                  {anime.format || "TV"} &bull; {anime.year || "2026"} &bull; {anime.episodes ? `${anime.episodes} eps` : "Ongoing"}
                </span>
              </div>
            </div>

            {/* CONTROL BUTTONS (SUB/DUB, SERVER DROPDOWN, SHARE) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* SUB / DUB Toggle */}
              <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setAudio("sub")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    audio === "sub" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40" : "text-white/60 hover:text-white"
                  }`}
                >
                  SUB
                </button>
                <button
                  onClick={() => setAudio("dub")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    audio === "dub" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40" : "text-white/60 hover:text-white"
                  }`}
                >
                  DUB
                </button>
              </div>

              {/* Server Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowServerDropdown(!showServerDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
                >
                  <Server size={14} />
                  <span>Server: {PROVIDER_NAMES[selectedProvider] || selectedProvider}</span>
                  <ChevronRight size={14} className={`transition-transform ${showServerDropdown ? "rotate-90" : ""}`} />
                </button>

                {showServerDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 py-1">Available Servers</span>
                    {availableProviders.map((prov) => (
                      <button
                        key={prov}
                        onClick={() => {
                          setSelectedProvider(prov);
                          setShowServerDropdown(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          selectedProvider === prov ? "bg-purple-600 text-white" : "text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <span>{PROVIDER_NAMES[prov] || prov}</span>
                        {selectedProvider === prov && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors border border-white/5"
              >
                <Share2 size={14} />
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (EPISODE LIST & MORE LIKE THIS) */}
        <div className={`w-full ${theatreMode ? "lg:w-full" : "lg:w-96"} flex flex-col gap-6 shrink-0`}>
          
          {/* EPISODE LIST SIDEBAR */}
          <div className="bg-[#141417] rounded-2xl p-4 border border-white/5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-extrabold text-white line-clamp-1">{anime.title}</h3>
              <p className="text-xs text-white/50">Playing &bull; Episode {selectedEpisode}</p>
            </div>

            {/* Episode Search Bar */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search episode number..."
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 focus:border-purple-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                EPISODES 1-{totalEpisodes}
              </span>
            </div>

            {/* Scrollable Episode Cards List */}
            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {episodeList.map((epNum) => (
                <button
                  key={epNum}
                  onClick={() => setSelectedEpisode(epNum)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group ${
                    selectedEpisode === epNum
                      ? "bg-purple-950/50 border-purple-500/50 text-white"
                      : "bg-[#09090b]/60 border-white/5 hover:bg-white/5 text-white/80"
                  }`}
                >
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                    <img src={anime.coverImage || anime.coverMedium} alt={`Ep ${epNum}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.2 rounded text-[9px] font-black text-purple-400">
                      EP {epNum}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="text-xs font-bold line-clamp-1 group-hover:text-purple-400 transition-colors">
                      Episode {epNum}
                    </h4>
                    <span className="text-[10px] text-white/40">{anime.year || "2026"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* MORE LIKE THIS SIDEBAR */}
          {similarAnime.length > 0 && (
            <div className="bg-[#141417] rounded-2xl p-4 border border-white/5 flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white border-b border-white/5 pb-3">More like this</h3>
              <div className="flex flex-col gap-3">
                {similarAnime.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={`/anime/detail/${item.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl bg-[#09090b]/60 hover:bg-white/5 border border-white/5 transition-all group"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative border border-white/10">
                      <img src={item.coverImage || item.coverMedium} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-white/50">
                        <span>{item.format || "TV"}</span>
                        <span>&bull;</span>
                        <span>{item.episodes ? `${item.episodes} eps` : "Ongoing"}</span>
                        {item.averageScore && (
                          <>
                            <span>&bull;</span>
                            <span className="text-yellow-400 font-bold">★ {(item.averageScore / 10).toFixed(1)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
