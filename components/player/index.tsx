"use client";
import React, { useState, useEffect } from "react";
import { Server, ArrowLeft } from "lucide-react";
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
  { name: "Videasy", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://player.videasy.net/tv/${id}/${s}/${e}` : `https://player.videasy.net/movie/${id}` },
  { name: "Vidking", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://www.vidking.net/embed/tv/${id}/${s}/${e}` : `https://www.vidking.net/embed/movie/${id}` },
  { name: "VidSrc PM", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidsrc.pm/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pm/embed/movie/${id}` },
  { name: "Peachify", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://peachify.top/embed/tv/${id}/${s}/${e}` : `https://peachify.top/embed/movie/${id}` },
  { name: "Vidlink", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidlink.pro/tv/${id}/${s}/${e}` : `https://vidlink.pro/movie/${id}` },
  { name: "Vidfast", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidfast.net/tv/${id}/${s}/${e}` : `https://vidfast.net/movie/${id}` },
  { name: "PrimeSRC", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://primesrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}` : `https://primesrc.me/embed/movie?tmdb=${id}` },
  { name: "VidSrc Embed", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidsrc-embed.ru/embed/tv/${id}/${s}/${e}` : `https://vidsrc-embed.ru/embed/movie/${id}` },
  { name: "Vidrock", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidrock.net/embed/tv/${id}/${s}/${e}` : `https://vidrock.net/embed/movie/${id}` },
  { name: "VidSrc CC", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: "Vidify", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidify.to/embed/tv/${id}/${s}/${e}` : `https://vidify.to/embed/movie/${id}` },
  { name: "Vidzee", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://vidzee.to/embed/tv/${id}/${s}/${e}` : `https://vidzee.to/embed/movie/${id}` },
  { name: "2Embed", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` : `https://www.2embed.cc/embed/${id}` },
  { name: "HNEmbed", url: (id: string, isTv: boolean, s = 1, e = 1) => isTv ? `https://hnembed.cc/embed/tv/${id}/${s}/${e}` : `https://hnembed.cc/embed/movie/${id}` }
];

function MyPlayer({ src, title, thumbnails, tmdbId, mediaType, season = 1, episode = 1 }: MyPlayerProps) {
  const [selectedServer, setSelectedServer] = useState(0);
  const [isMouseIdle, setIsMouseIdle] = useState(false);
  const router = useRouter();

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
        
        <iframe
          src={tmdbId ? SERVERS[selectedServer].url(tmdbId, mediaType === "tv", season, episode) : ""}
          className="absolute inset-0 w-full h-full border-none z-10"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
          referrerPolicy="origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      {/* Control Bar (Servers & Details) */}
      <div className="bg-[#0f0f0f] border-t border-white/5 w-full flex flex-col justify-center px-4 md:px-8 py-3 z-20">
        
        {/* Top Row: Sources & Share */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide w-full md:w-auto">
            <div className="flex items-center text-white/50 shrink-0 font-medium">
              <Server className="h-4 w-4 mr-2" />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider">Source</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 pr-4">
              {SERVERS.map((server, idx) => (
                <button
                  key={server.name}
                  onClick={() => setSelectedServer(idx)}
                  className={`px-4 py-1.5 rounded-lg text-xs md:text-[13px] font-bold transition-all whitespace-nowrap ${
                    selectedServer === idx
                      ? "bg-[#ff9d00] text-black shadow-[0_0_15px_rgba(255,157,0,0.15)]"
                      : "bg-transparent text-white/60 hover:text-white"
                  }`}
                >
                  {server.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyPlayer;
