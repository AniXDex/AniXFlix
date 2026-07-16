"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Clock, Star, Play } from "lucide-react";
import { useStore } from "@/store/useStore";
import { searchContent } from "@/app/actions/search";
import { Movie } from "@/types/types";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { searchHistory, addSearchHistory, removeSearchHistory, clearSearchHistory } = useStore();

  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<"all" | "movie" | "tv" | "anime">("all");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q: string, f: typeof filter) => {
    if (q.trim().length > 1) {
      setIsSearching(true);
      setHasSearched(true);
      const data = await searchContent(q, f);
      setResults(data);
      setIsSearching(false);
      addSearchHistory(q);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [addSearchHistory]);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, filter);
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
      doSearch(query, filter);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFilterChange = (f: typeof filter) => {
    setFilter(f);
    if (query.trim().length > 1) {
      doSearch(query, f);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 px-4 md:px-14 xl:px-20 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Search</h1>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative w-full mb-6">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for movies, TV shows, or anime..."
            className="w-full bg-[#111111] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); setHasSearched(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </form>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8">
          {(["all", "movie", "tv", "anime"] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === f
                  ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  : "bg-[#111111] border border-white/10 text-white/60 hover:bg-[#1a1a1a] hover:text-white/90"
              }`}
            >
              {f === "all" ? "All" : f === "movie" ? "Movies" : f === "tv" ? "TV Shows" : "Anime"}
            </button>
          ))}
        </div>

        {/* Search History (when no query) */}
        {!query && !hasSearched && searchHistory.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Recent Searches</h2>
              <button onClick={clearSearchHistory} className="text-xs font-medium text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((histQuery) => (
                <button
                  key={histQuery}
                  onClick={() => { setQuery(histQuery); router.push(`/search?q=${encodeURIComponent(histQuery)}`, { scroll: false }); doSearch(histQuery, filter); }}
                  className="flex items-center gap-2 px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:bg-[#1a1a1a] transition-all group"
                >
                  <Clock size={14} className="text-white/30" />
                  <span>{histQuery}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSearchHistory(histQuery); }}
                    className="ml-1 text-white/20 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={12} />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <>
            {isSearching ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-sm text-white/40 mb-4">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {results.map((movie) => (
                    <Link
                      key={movie.publicId}
                      href={`/detail/${movie.publicId}?v=${movie.mediaType === "tv" ? 2 : 1}`}
                      className="group relative flex flex-col bg-[#111111] rounded-xl overflow-hidden border border-white/5 hover:border-red-500/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-[#0a0a0a]">
                        <SafeImage
                          src={(movie.thumbnailUrl || movie.backdropUrl)?.replace("/w500/", "/w342/").replace("/w780/", "/w342/")}
                          alt={movie.title || ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <span className="flex items-center gap-1.5 text-white text-xs font-bold bg-red-600 px-3 py-1.5 rounded-lg shadow-lg">
                            <Play size={12} fill="currentColor" /> Play
                          </span>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col gap-1.5">
                        <h3 className="text-sm font-bold text-white truncate leading-tight">{movie.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium">
                          <span>{movie.mediaType === "tv" ? "TV Show" : "Movie"}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span>{movie.releaseYear || "N/A"}</span>
                          {movie.rating && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="flex items-center gap-0.5 text-yellow-500">
                                <Star size={10} className="fill-yellow-500" /> {movie.rating}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-white/30">
                <Search size={40} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs mt-1 text-white/20">Try a different search term or filter</p>
              </div>
            )}
          </>
        )}

        {/* Empty state - no query and no history */}
        {!query && !hasSearched && searchHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-white/20">
            <Search size={48} className="mb-4 opacity-10" />
            <p className="text-sm font-medium text-white/30">Search for your favorite movies, TV shows, and anime</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black pt-24 px-4 md:px-14 xl:px-20 pb-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
