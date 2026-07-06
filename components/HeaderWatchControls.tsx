"use client";
import React from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function HeaderWatchControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pathname?.startsWith("/watch")) return null;
  
  const type = searchParams.get("type");
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";

  if (type !== "tv") return null;

  return (
    <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">Season</span>
        <button 
          onClick={() => document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 bg-[#1a1a1f] hover:bg-[#2a2a2f] border border-white/5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-lg"
        >
          Season {season}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">Episode</span>
        <button 
          onClick={() => document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 bg-[#1a1a1f] hover:bg-[#2a2a2f] border border-white/5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-lg"
        >
          Episode {episode}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
