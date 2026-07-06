"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, Play, Info, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { searchContent } from "@/app/actions/search";
import { Movie } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { openModal } = useGlobalContext();
  const { searchHistory, addSearchHistory, removeSearchHistory } = useStore();
  
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "anime">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        const data = await searchContent(query, filter);
        setResults(data);
        setIsSearching(false);
        addSearchHistory(query);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, filter, addSearchHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
          <h2 className="text-lg font-bold text-white">Search</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
              >
                {filter === "all" ? "Movies & TV Shows" : "Animes"} 
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  <button 
                    onClick={() => { setFilter("all"); setIsFilterOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    Movies & TV Shows
                  </button>
                  <button 
                    onClick={() => { setFilter("anime"); setIsFilterOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    Animes
                  </button>
                </div>
              )}
            </div>
            
            <button onClick={onClose} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative p-4 bg-[#0a0a0a]">
          <Search size={20} className="absolute left-7 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type here to search..."
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar bg-[#09090b]">
          {!query && searchHistory.length > 0 && (
            <div className="flex flex-col p-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider px-3 mb-2 mt-2">Recent</span>
              {searchHistory.map((histQuery) => (
                <div key={histQuery} className="flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg group cursor-pointer transition-colors" onClick={() => setQuery(histQuery)}>
                  <div className="flex items-center gap-3 text-white/60 group-hover:text-white">
                    <Clock size={16} />
                    <span className="text-sm font-medium">{histQuery}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeSearchHistory(histQuery); }}
                    className="text-white/20 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {query && results.length > 0 && (
            <div className="flex flex-col p-2 gap-1 mt-1">
              {results.map((movie) => {
                const isExpanded = expandedId === movie.publicId;
                
                return (
                  <div key={movie.publicId} className="flex flex-col bg-[#0f0f0f] hover:bg-[#1a1a1a] rounded-xl border border-transparent hover:border-white/5 transition-all overflow-hidden">
                    <div 
                      className="flex items-center p-2 gap-3 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : (movie.publicId || ""))}
                    >
                      <div className="relative w-10 h-14 rounded-md overflow-hidden bg-white/5 shrink-0">
                        <Image src={movie.thumbnailUrl || movie.backdropUrl || ""} alt={movie.title || "Poster"} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium mt-0.5">
                          <span>{movie.mediaType === "tv" ? "TV Show" : "Movie"}</span>
                          <span>&middot;</span>
                          <span>{movie.releaseYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "N/A")}</span>
                          <span>&middot;</span>
                          <span className="flex items-center gap-0.5 text-yellow-500"><Star size={10} className="fill-yellow-500" /> {movie.rating || "N/A"}</span>
                        </div>
                      </div>
                      <button className="p-2 text-white/40 shrink-0">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-xs text-white/60 mb-3 line-clamp-3 leading-relaxed">
                          {movie.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { onClose(); router.push(`/watch/${movie.publicId}`); }}
                            className="flex-1 bg-white hover:bg-white/90 text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Play size={14} fill="black" /> Play
                          </button>
                          <button 
                            onClick={() => { onClose(); openModal("movie-info", movie); }}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Info size={14} /> See more
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {query && !isSearching && results.length === 0 && (
            <div className="p-10 flex flex-col items-center justify-center text-white/40">
              <Search size={32} className="mb-3 opacity-20" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}

          {isSearching && results.length === 0 && (
            <div className="p-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
