"use client";

import React, { useState } from "react";
import { Server, Check, Link as ShareIcon, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    type: "movie" | "tv";
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tmdbData: any;
    season?: number;
    episode?: number;
    initialServer?: number;
    onSeasonChange?: (season: number) => void;
    onEpisodeChange?: (episode: number) => void;
}

const SERVERS = [
    { name: "VidSrc CC", movie: (id: string) => `https://vidsrc.cc/v2/embed/movie/${id}`, show: (id: string, s: number, e: number) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` },
    { name: "VidSrc PM", movie: (id: string) => `https://vidsrc.pm/embed/movie/${id}`, show: (id: string, s: number, e: number) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}` },
    { name: "Vidlink", movie: (id: string) => `https://vidlink.pro/movie/${id}`, show: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}` },
    { name: "Peachify", movie: (id: string) => `https://peachify.top/embed/movie/${id}`, show: (id: string, s: number, e: number) => `https://peachify.top/embed/tv/${id}/${s}/${e}` },
    { name: "Vidrock", movie: (id: string) => `https://vidrock.net/embed/movie/${id}`, show: (id: string, s: number, e: number) => `https://vidrock.net/embed/tv/${id}/${s}/${e}` },
];

export default function VideoPlayer({
    type,
    id,
    tmdbData,
    season: controlledSeason,
    episode: controlledEpisode,
    initialServer,
    onSeasonChange,
    onEpisodeChange
}: VideoPlayerProps) {
    const [internalSeason, setInternalSeason] = useState(1);
    const [internalEpisode, setInternalEpisode] = useState(1);
    const [selectedServer, setSelectedServer] = useState(initialServer ?? 0);
    const [copied, setCopied] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const isControlled = controlledSeason !== undefined && controlledEpisode !== undefined;
    const currentSeason = isControlled ? controlledSeason : internalSeason;
    const currentEpisode = isControlled ? controlledEpisode : internalEpisode;

    const handleSeasonChange = (s: number) => {
        if (isControlled) {
            onSeasonChange?.(s);
        } else {
            setInternalSeason(s);
            setInternalEpisode(1);
        }
    };

    const handleEpisodeChange = (e: number) => {
        if (isControlled) {
            onEpisodeChange?.(e);
        } else {
            setInternalEpisode(e);
        }
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/play/${id}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {});
    };

    const currentServer = SERVERS[selectedServer];
    const playerUrl = type === "movie"
        ? currentServer.movie(id)
        : currentServer.show(id, currentSeason, currentEpisode);

    const seasons = (tmdbData?.seasons as Array<{ season_number: number; name?: string; episode_count: number }>) || [];

    return (
        <div 
            className="w-screen h-screen bg-black overflow-hidden relative group"
            onMouseEnter={() => setShowOverlay(true)}
            onMouseLeave={() => setShowOverlay(false)}
        >
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setShowOverlay(!showOverlay)}
                className="absolute top-4 right-4 z-[60] md:hidden p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md"
            >
                {showOverlay ? <X size={24} /> : <Settings size={24} />}
            </button>
            {/* The Iframe Player */}
            <iframe
                key={`${selectedServer}-${currentSeason}-${currentEpisode}`}
                src={playerUrl}
                className="absolute inset-0 w-full h-full border-none z-0"
                allowFullScreen
                frameBorder="0"
                scrolling="no"
                referrerPolicy="origin"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>

            {/* Invisible hover trap to trigger overlay in corners */}
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 hover:bg-black/10 transition-colors" onMouseEnter={() => setShowOverlay(true)}></div>
            
            {/* Server and Episode Selection Overlay (Netflix Style) */}
            <div className={cn(
                "absolute top-16 md:top-4 right-4 z-50 flex flex-col items-end gap-3 transition-all duration-500",
                showOverlay ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            )}>
                
                {/* TV Controls */}
                {type === "tv" && seasons.length > 0 && (
                    <div className="bg-black/80 backdrop-blur-md rounded-md p-3 border border-white/10 shadow-2xl flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold px-1">Season</span>
                            <select
                                value={currentSeason}
                                onChange={(e) => handleSeasonChange(Number(e.target.value))}
                                className="bg-white/10 text-white text-sm py-1.5 px-3 rounded outline-none border-none cursor-pointer hover:bg-white/20 transition-colors font-medium appearance-none min-w-[120px]"
                            >
                                {seasons.map((s) => (
                                    <option key={s.season_number} value={s.season_number} className="bg-neutral-900 text-white">
                                        {s.name || `Season ${s.season_number}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold px-1">Episode</span>
                            <select
                                value={currentEpisode}
                                onChange={(e) => handleEpisodeChange(Number(e.target.value))}
                                className="bg-white/10 text-white text-sm py-1.5 px-3 rounded outline-none border-none cursor-pointer hover:bg-white/20 transition-colors font-medium appearance-none min-w-[120px]"
                            >
                                {Array.from(
                                    { length: seasons.find((s) => s.season_number === currentSeason)?.episode_count || 50 },
                                    (_, i) => (
                                        <option key={i + 1} value={i + 1} className="bg-neutral-900 text-white">
                                            Episode {i + 1}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>
                )}

                {/* Server Controls */}
                <div className="bg-black/80 backdrop-blur-md rounded-md p-3 border border-white/10 shadow-2xl flex flex-col gap-2 w-48">
                    <div className="flex items-center gap-2 px-1 mb-1">
                        <Server size={14} className="text-white/50" />
                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Source</span>
                    </div>
                    <div className="flex flex-col max-h-48 overflow-y-auto scrollbar-hide gap-1">
                        {SERVERS.map((server, idx) => (
                            <button
                                key={server.name}
                                onClick={() => setSelectedServer(idx)}
                                className={cn(
                                    "text-left px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center justify-between group",
                                    selectedServer === idx
                                        ? "bg-white text-black"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {server.name}
                                {selectedServer === idx && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={handleShare}
                        className="mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/15 rounded text-xs text-white/80 transition-colors"
                    >
                        {copied ? (
                            <><Check size={14} className="text-green-400" /> Copied!</>
                        ) : (
                            <><ShareIcon size={14} /> Share</>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
