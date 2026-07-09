"use client";
import React, { useState, useEffect, useRef } from "react";
import { Server, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ThumbnailEntry {
  url: string;
  startTime: number;
  endTime: number;
}

interface MyPlayerProps {
  src: string;
  title: string;
  thumbnails: ThumbnailEntry[];
  tmdbId?: string;
  mediaType?: "tv" | "movie";
  season?: number;
  episode?: number;
}

const ALL_SERVERS = [
  // 1 - cinevibe.site
  { name: "CineVibe", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://cinevibe.site/api/stream/fetch?server=cinebox&type=show&mediaId=${id}&season_episode=${s}%2F${e}&autoplay=1&muted=0` : `https://cinevibe.site/api/stream/fetch?server=cinebox&type=movie&mediaId=${id}&autoplay=1&muted=0` },
  // 2 - cinemaos.tech
  { name: "CinemaOS", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://cinemaos.tech/player/${id}/${s}/${e}?autoplay=1&muted=0` : `https://cinemaos.tech/player/${id}?autoplay=1&muted=0` },
  // 3 - player.cinezo.live
  { name: "Cinezo", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://player.cinezo.live/embed/tv/${id}/${s}/${e}?autoplay=true&muted=0` : `https://player.cinezo.live/embed/movie/${id}?autoplay=true&muted=0` },
  // 4 - screenscape.me
  { name: "ScreenScape", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${s}&e=${e}&autoplay=1&muted=0` : `https://screenscape.me/embed?tmdb=${id}&type=movie&autoplay=1&muted=0` },
  // 5 - rozgarlelo.modiplay.xyz
  { name: "razor[Hindi]", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://rozgarlelo.modiplay.xyz/embed/tmdb/tv?id=${id}&s=${s}&e=${e}&autoplay=1&muted=0` : `https://rozgarlelo.modiplay.xyz/embed/tmdb/movie?id=${id}&autoplay=1&muted=0` },
  // 6 - embed.filmu.in
  { name: "FilmU", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://embed.filmu.in/embed/tv/${id}/${s}/${e}?autoplay=1&muted=0` : `https://embed.filmu.in/embed/movie/${id}?autoplay=1&muted=0` },
  // 7 - player.videasy.net
  { name: "Videasy", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://player.videasy.net/tv/${id}/${s}/${e}?autoplay=1&muted=0` : `https://player.videasy.net/movie/${id}?autoplay=1&muted=0` },
  // 8 - peachify.top
  { name: "Peachify", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://peachify.top/embed/tv/${id}/${s}/${e}?autoplay=1&muted=0` : `https://peachify.top/embed/movie/${id}?autoplay=1&muted=0` }
];

function MyPlayer({ src, title, thumbnails, tmdbId, mediaType, season = 1, episode = 1 }: MyPlayerProps) {
  const [selectedServer, setSelectedServer] = useState(0);
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  const SERVERS = ALL_SERVERS;

  useEffect(() => {
    setIsLoading(true);
  }, [selectedServer]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setIsMouseIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMouseIdle(true), 3000);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full flex-1 relative bg-black">
      
      {/* Player Frame */}
      <div className="relative w-full flex-1 min-h-[40vh] md:min-h-[85vh] bg-black overflow-hidden group">
        
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-3" />
            <p className="text-white/50 text-xs font-medium">Loading Server {selectedServer + 1}...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={tmdbId ? SERVERS[selectedServer].url(tmdbId, mediaType === "tv", season, episode) : ""}
          onLoad={() => setIsLoading(false)}
          className="absolute inset-0 w-full h-full border-none z-10"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
          referrerPolicy="origin"
        ></iframe>
      </div>

      {/* Control Bar (Servers & Details) */}
      <div className="bg-[#0f0f0f] border-t border-white/5 w-full flex flex-col justify-center px-4 md:px-8 py-3 z-20">
        
        {/* Top Row: Sources & Share */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide w-full md:w-auto pr-8">
            <div className="flex items-center text-white/50 shrink-0 font-medium">
              <Server className="h-4 w-4 mr-2" />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider">Server</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 pr-4">
              {SERVERS.map((server, idx) => (
                <button
                  key={server.name}
                  onClick={() => setSelectedServer(idx)}
                  className={`px-4 py-1.5 rounded-lg text-xs md:text-[13px] font-bold transition-all whitespace-nowrap ${
                    selectedServer === idx
                      ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                      : "bg-transparent text-white/60 hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Scroll Indicator for Mobile */}
          <div className="absolute right-0 top-0 bottom-0 md:hidden pointer-events-none bg-gradient-to-l from-[#0f0f0f] to-transparent w-16 flex items-center justify-end text-white/60">
             <ChevronRight className="w-5 h-5 animate-pulse text-red-500" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyPlayer;
