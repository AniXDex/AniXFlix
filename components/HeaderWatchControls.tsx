"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { getTvSeasonsAndEpisodes } from "@/app/actions/tv";
import { ChevronDown, Check } from "lucide-react";
import { PLAYBACK_KEY } from "@/lib/playback";

export default function HeaderWatchControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [seasonsCount, setSeasonsCount] = useState(1);
  const [episodesCount, setEpisodesCount] = useState(1);
  
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const [isEpisodeOpen, setIsEpisodeOpen] = useState(false);
  
  const seasonRef = useRef<HTMLDivElement>(null);
  const episodeRef = useRef<HTMLDivElement>(null);

  const movieId = pathname?.split("/").pop();
  const sParam = searchParams.get("s");
  const isTv = !!sParam;
  const season = parseInt(sParam || "1", 10);
  const episode = parseInt(searchParams.get("e") || "1", 10);

  useEffect(() => {
    if (pathname?.startsWith("/play") && isTv && movieId) {
      getTvSeasonsAndEpisodes(movieId, season).then(data => {
        setSeasonsCount(data.numberOfSeasons);
        setEpisodesCount(data.episodesCount);
      });
    }
  }, [pathname, isTv, movieId, season]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (seasonRef.current && !seasonRef.current.contains(event.target as Node)) {
        setIsSeasonOpen(false);
      }
      if (episodeRef.current && !episodeRef.current.contains(event.target as Node)) {
        setIsEpisodeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!pathname?.startsWith("/play") || !isTv) return null;

  const handleSeasonSelect = (s: number) => {
    setIsSeasonOpen(false);
    sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify({ tmdbId: movieId, mediaType: "tv", season: s, episode: 1 }));
    router.push("/play");
  };

  const handleEpisodeSelect = (e: number) => {
    setIsEpisodeOpen(false);
    sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify({ tmdbId: movieId, mediaType: "tv", season, episode: e }));
    router.push("/play");
  };

  return (
    <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 z-[150] pointer-events-auto">
      
      {/* Season Dropdown */}
      <div className="flex items-center gap-3 relative" ref={seasonRef}>
        <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">Season</span>
        <button 
          onClick={() => setIsSeasonOpen(!isSeasonOpen)}
          className={`flex items-center gap-2 bg-[#1a1a1f] hover:bg-[#2a2a2f] border border-white/5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${isSeasonOpen ? 'ring-1 ring-white/20' : ''}`}
        >
          Season {season}
          <ChevronDown size={16} className={`text-white/50 transition-transform ${isSeasonOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isSeasonOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto custom-scrollbar bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 z-[200]">
            <div className="p-2 flex flex-col gap-1">
              {Array.from({ length: seasonsCount }).map((_, i) => {
                const s = i + 1;
                const isSelected = s === season;
                return (
                  <button
                    key={`s-${s}`}
                    onClick={() => handleSeasonSelect(s)}
                    className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                      ${isSelected ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    Season {s}
                    {isSelected && <Check size={14} className="text-[#ff9d00]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Episode Dropdown */}
      <div className="flex items-center gap-3 relative" ref={episodeRef}>
        <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">Episode</span>
        <button 
          onClick={() => setIsEpisodeOpen(!isEpisodeOpen)}
          className={`flex items-center gap-2 bg-[#1a1a1f] hover:bg-[#2a2a2f] border border-white/5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${isEpisodeOpen ? 'ring-1 ring-white/20' : ''}`}
        >
          Episode {episode}
          <ChevronDown size={16} className={`text-white/50 transition-transform ${isEpisodeOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isEpisodeOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto custom-scrollbar bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 z-[200]">
            <div className="p-2 flex flex-col gap-1">
              {Array.from({ length: episodesCount }).map((_, i) => {
                const e = i + 1;
                const isSelected = e === episode;
                return (
                  <button
                    key={`e-${e}`}
                    onClick={() => handleEpisodeSelect(e)}
                    className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                      ${isSelected ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    Episode {e}
                    {isSelected && <Check size={14} className="text-[#ff9d00]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}

