"use client";
import React, { useState, useEffect, useRef } from "react";
import { Server, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
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

const SERVERS = [
  { name: "Alok", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${s}&e=${e}&lan=eng` : `https://screenscape.me/embed?tmdb=${id}&type=movie&lan=eng` }, // ScreenScape
  { name: "Chrono", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://player.videasy.net/tv/${id}/${s}/${e}` : `https://player.videasy.net/movie/${id}` }, // Videasy
  { name: "Hayato", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidsrc.pm/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pm/embed/movie/${id}` }, // VidSrc PM
  { name: "Kelly", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://peachify.top/embed/tv/${id}/${s}/${e}` : `https://peachify.top/embed/movie/${id}` }, // Peachify
  { name: "Moco", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidlink.pro/tv/${id}/${s}/${e}` : `https://vidlink.pro/movie/${id}` }, // Vidlink
  { name: "Jota", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidfast.net/tv/${id}/${s}/${e}` : `https://vidfast.net/movie/${id}` }, // Vidfast
  { name: "Dimitri", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://primesrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}` : `https://primesrc.me/embed/movie?tmdb=${id}` }, // PrimeSRC
  { name: "Wukong", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidsrc-embed.ru/embed/tv/${id}/${s}/${e}` : `https://vidsrc-embed.ru/embed/movie/${id}` }, // VidSrc Embed
  { name: "Miguel", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidrock.net/embed/tv/${id}/${s}/${e}` : `https://vidrock.net/embed/movie/${id}` }, // Vidrock
  { name: "Caroline", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}` }, // VidSrc CC
  { name: "Shirou", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidify.to/embed/tv/${id}/${s}/${e}` : `https://vidify.to/embed/movie/${id}` }, // Vidify
  { name: "Laura", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidzee.to/embed/tv/${id}/${s}/${e}` : `https://vidzee.to/embed/movie/${id}` }, // Vidzee
  { name: "Kapella", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` : `https://www.2embed.cc/embed/${id}` }, // 2Embed
  { name: "Maro", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://hnembed.cc/embed/tv/${id}/${s}/${e}` : `https://hnembed.cc/embed/movie/${id}` }, // HNEmbed
  { name: "Xayne", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://www.vidking.net/embed/tv/${id}/${s}/${e}` : `https://www.vidking.net/embed/movie/${id}` } // Vidking
];

function MyPlayer({ src, title, thumbnails, tmdbId, mediaType, season = 1, episode = 1 }: MyPlayerProps) {
  const [selectedServer, setSelectedServer] = useState(0);
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

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
            <p className="text-white/50 text-xs font-medium">Loading {SERVERS[selectedServer].name}...</p>
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
          loading="eager"
          allow="autoplay; encrypted-media; picture-in-picture"
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
                  {server.name}
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
