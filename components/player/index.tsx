"use client";
import React, { useState } from "react";
import React, { useState } from "react";
import { Server } from "lucide-react";

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
}

const SERVERS = [
  { name: "Videasy", url: (id: string) => `https://player.videasy.net/movie/${id}` },
  { name: "Vidking", url: (id: string) => `https://www.vidking.net/embed/movie/${id}` },
  { name: "VidSrc PM", url: (id: string) => `https://vidsrc.pm/embed/movie/${id}` },
  { name: "Peachify", url: (id: string) => `https://peachify.top/embed/movie/${id}` },
  { name: "Vidlink", url: (id: string) => `https://vidlink.pro/movie/${id}` },
  { name: "Vidfast", url: (id: string) => `https://vidfast.net/movie/${id}` },
  { name: "PrimeSRC", url: (id: string) => `https://primesrc.me/embed/movie?tmdb=${id}` },
  { name: "VidSrc Embed", url: (id: string) => `https://vidsrc-embed.ru/embed/movie/${id}` },
  { name: "Vidrock", url: (id: string) => `https://vidrock.net/embed/movie/${id}` },
  { name: "VidSrc CC", url: (id: string) => `https://vidsrc.cc/v2/embed/movie/${id}` }
];

function MyPlayer({ src, title, thumbnails, tmdbId }: MyPlayerProps) {
  const [selectedServer, setSelectedServer] = useState(0);

  return (
    <div className="flex flex-col w-full h-full flex-1">
      
      {/* Player Frame */}
      <div className="relative w-full flex-1 min-h-[50vh] md:min-h-[85vh] bg-black">
        <iframe
          src={tmdbId ? SERVERS[selectedServer].url(tmdbId) : ""}
          className="absolute inset-0 w-full h-full border-none"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
          referrerPolicy="origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      {/* Control Bar (Servers) */}
      <div className="bg-[#141414] p-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide py-1 max-w-full">
          <div className="flex items-center text-white/50 mr-2 shrink-0">
            <Server className="h-4 w-4 mr-1" />
            <span className="text-xs font-bold uppercase whitespace-nowrap">Source</span>
          </div>
          <div className="flex items-center bg-white/5 rounded-lg p-1 shrink-0">
            {SERVERS.map((server, idx) => (
              <button
                key={server.name}
                onClick={() => setSelectedServer(idx)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  selectedServer === idx
                    ? "bg-red-600 text-white shadow-md"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPlayer;
