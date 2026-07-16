"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Clock, Star, Play, TrendingUp, Film, Tv, Sparkles, Loader2, ChevronRight, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { searchContent, getTrendingContent } from "@/app/actions/search";
import { Movie } from "@/types/types";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";

const PROVIDERS = [
  { id: "8", name: "Netflix", color: "#E50914", short: "N" },
  { id: "9", name: "Prime Video", color: "#00A8E1", short: "P" },
  { id: "1899", name: "Max", color: "#000000", short: "M", border: true },
  { id: "337", name: "Disney+", color: "#113CCF", short: "D+" },
  { id: "350", name: "Apple TV+", color: "#000000", short: "tv", border: true },
  { id: "531", name: "Paramount+", color: "#0064FF", short: "P+" },
  { id: "15", name: "Hulu", color: "#1CE783", short: "H" },
];

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
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTv, setTrendingTv] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTv, setPopularTv] = useState<Movie[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!initialQuery) {
      getTrendingContent().then((data) => {
        setTrendingMovies(data.trendingMovies);
        setTrendingTv(data.trendingTv);
        setPopularMovies(data.popularMovies);
        setPopularTv(data.popularTv);
        setIsLoadingTrending(false);
      });
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, filter);
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    clearTimeout(debounceRef.current);

    if (val.trim().length > 1) {
      debounceRef.current = setTimeout(() => {
        doSearch(val, filter);
        router.push(`/search?q=${encodeURIComponent(val.trim())}`, { scroll: false });
      }, 400);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  };

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

  const isInitial = !query && !hasSearched;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      {/* Hero Search Section */}
      <div className="relative pt-28 pb-12 md:pb-16 px-4 md:px-14 xl:px-20">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-2">
              What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">watch</span>?
            </h1>
            <p className="text-white/40 text-sm md:text-base font-medium">Search movies, TV shows, and anime across every platform</p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <form onSubmit={handleSearch}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl opacity-20 group-focus-within:opacity-40 blur-xl transition-all duration-500" />
              <div className="relative flex items-center bg-[#0f0f0f] border-2 border-white/10 group-focus-within:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl shadow-red-900/10">
                <div className="flex items-center justify-center pl-5">
                  <Search size={22} className="text-white/30 group-focus-within:text-red-400 transition-colors duration-300" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for movies, TV shows, or anime..."
                  className="w-full bg-transparent py-4 md:py-5 pl-3 pr-12 text-base md:text-lg text-white placeholder:text-white/20 focus:outline-none font-medium"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setResults([]); setHasSearched(false); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-xl transition-all"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            </form>
          </div>

          {/* Filters */}
          {hasSearched && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {(["all", "movie", "tv", "anime"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-4 md:px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 ${
                    filter === f
                      ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-105"
                      : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  {f === "all" ? "All" : f === "movie" ? "Movies" : f === "tv" ? "TV Shows" : "Anime"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 md:px-14 xl:px-20 pb-16">
        <div className="max-w-7xl mx-auto">

          {/* OTT Platforms */}
          {isInitial && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-red-600 rounded-full" />
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">Browse by Platform</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {PROVIDERS.map((provider) => (
                  <Link
                    key={provider.id}
                    href={`/search?provider=${provider.id}`}
                    className="group relative flex flex-col items-center justify-center gap-3 p-5 md:p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-red-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-red-900/5 overflow-hidden"
                  >
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-base md:text-lg font-black text-white shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        provider.border ? 'border-2 border-white/20' : ''
                      }`}
                      style={{ backgroundColor: provider.color }}
                    >
                      {provider.short}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-white/70 group-hover:text-white transition-colors text-center leading-tight">
                      {provider.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {isInitial && searchHistory.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-white/30" />
                  <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Recent Searches</h2>
                </div>
                <button onClick={clearSearchHistory} className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">Clear all</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((histQuery) => (
                  <button
                    key={histQuery}
                    onClick={() => { setQuery(histQuery); router.push(`/search?q=${encodeURIComponent(histQuery)}`, { scroll: false }); doSearch(histQuery, filter); }}
                    className="group flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] border border-white/5 hover:border-white/20 rounded-xl text-sm text-white/50 hover:text-white transition-all"
                  >
                    <Clock size={13} className="text-white/20 group-hover:text-white/40" />
                    <span>{histQuery}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSearchHistory(histQuery); }}
                      className="ml-1 text-white/10 hover:text-white/50 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending / Popular Pre-loaded Content */}
          {isInitial && !isLoadingTrending && (
            <div className="space-y-10">
              {/* Trending Movies */}
              {trendingMovies.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={18} className="text-red-500" />
                      <h2 className="text-lg md:text-xl font-bold text-white">Trending Movies</h2>
                    </div>
                    <Link href="/movies" className="flex items-center gap-1 text-xs font-semibold text-white/40 hover:text-red-400 transition-colors">
                      View all <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-3">
                    {trendingMovies.slice(0, 6).map((movie) => (
                      <TrendingCard key={movie.publicId} movie={movie} />
                    ))}
                  </div>
                </section>
              )}

              {/* Trending TV */}
              {trendingTv.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Tv size={18} className="text-red-500" />
                      <h2 className="text-lg md:text-xl font-bold text-white">Trending TV Shows</h2>
                    </div>
                    <Link href="/series" className="flex items-center gap-1 text-xs font-semibold text-white/40 hover:text-red-400 transition-colors">
                      View all <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-3">
                    {trendingTv.slice(0, 6).map((movie) => (
                      <TrendingCard key={movie.publicId} movie={movie} />
                    ))}
                  </div>
                </section>
              )}

              {/* Popular section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {popularMovies.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Film size={16} className="text-white/30" />
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Popular Movies</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {popularMovies.slice(0, 6).map((movie) => (
                        <MiniCard key={movie.publicId} movie={movie} />
                      ))}
                    </div>
                  </section>
                )}
                {popularTv.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Tv size={16} className="text-white/30" />
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Popular TV Shows</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {popularTv.slice(0, 6).map((movie) => (
                        <MiniCard key={movie.publicId} movie={movie} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}

          {/* Loading skeleton for trending */}
          {isInitial && isLoadingTrending && (
            <div className="space-y-8">
              {[1, 2].map((row) => (
                <div key={row}>
                  <div className="h-6 w-48 bg-white/5 rounded-lg mb-4 animate-pulse" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search Results */}
          {hasSearched && (
            <>
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="relative">
                    <div className="w-12 h-12 border-[3px] border-white/10 border-t-red-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Search size={16} className="text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-sm text-white/30 mt-4 font-medium">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-white/40 font-medium">
                      <span className="text-white/80 font-bold">{results.length}</span> result{results.length !== 1 ? "s" : ""} found
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/20 font-medium">Showing for</span>
                      <span className="text-xs font-bold text-white/60 bg-white/5 px-2.5 py-1 rounded-lg">&ldquo;{query}&rdquo;</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-3">
                    {results.map((movie) => (
                      <Link
                        key={movie.publicId}
                        href={`/detail/${movie.publicId}?v=${movie.mediaType === "tv" ? 2 : 1}`}
                        className="group relative flex flex-col bg-[#0f0f0f] rounded-xl overflow-hidden border border-white/[0.04] hover:border-red-500/25 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-900/10"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden bg-[#0a0a0a]">
                          <SafeImage
                            src={(movie.thumbnailUrl || movie.backdropUrl)?.replace("/w500/", "/w342/").replace("/w780/", "/w342/")}
                            alt={movie.title || ""}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-5">
                            <span className="flex items-center gap-1.5 text-white text-xs font-bold bg-red-600 px-4 py-2 rounded-lg shadow-lg shadow-red-900/30 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              <Play size={12} fill="currentColor" /> Play
                            </span>
                          </div>
                          {/* Rating Badge */}
                          {movie.rating && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Star size={10} className="fill-yellow-500 text-yellow-500" />
                              <span className="text-[10px] font-bold text-white">{movie.rating}</span>
                            </div>
                          )}
                          {/* Type Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="text-[9px] font-bold text-white/80 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                              {movie.mediaType === "tv" ? "TV" : "MOVIE"}
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 md:p-3 flex flex-col gap-1">
                          <h3 className="text-xs md:text-sm font-bold text-white/90 truncate leading-tight group-hover:text-white transition-colors">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-white/40 font-medium">
                            <span>{movie.releaseYear || "N/A"}</span>
                            {movie.rating && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="flex items-center gap-0.5 text-yellow-500/80">
                                  <Star size={8} className="fill-yellow-500" /> {movie.rating}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-white/30">
                  <div className="relative mb-6">
                    <Search size={48} className="opacity-10" />
                    <X size={20} className="absolute -top-1 -right-1 text-red-500/30" />
                  </div>
                  <p className="text-base font-bold text-white/40 mb-1">No results found</p>
                  <p className="text-sm text-white/20">Try a different search term or filter</p>
                </div>
              )}
            </>
          )}

          {/* Empty state - no query and no history */}
          {isInitial && searchHistory.length === 0 && !isLoadingTrending && (
            <div className="text-center py-16">
              <Sparkles size={24} className="mx-auto mb-3 text-white/10" />
              <p className="text-sm text-white/20 font-medium">Discover something new above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrendingCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/detail/${movie.publicId}?v=${movie.mediaType === "tv" ? 2 : 1}`}
      className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0f0f0f] border border-white/[0.03] hover:border-red-500/20 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-red-900/10"
    >
      <SafeImage
        src={(movie.thumbnailUrl || movie.backdropUrl)?.replace("/w500/", "/w342/").replace("/w780/", "/w342/")}
        alt={movie.title || ""}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-xs md:text-sm font-bold text-white drop-shadow-lg truncate">{movie.title}</h3>
        <div className="flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play size={10} className="text-red-500" fill="currentColor" />
          <span className="text-[9px] font-semibold text-white/80">Play now</span>
        </div>
      </div>
    </Link>
  );
}

function MiniCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/detail/${movie.publicId}?v=${movie.mediaType === "tv" ? 2 : 1}`}
      className="group flex items-center gap-2.5 p-2 rounded-xl bg-[#0f0f0f] border border-white/[0.03] hover:border-white/10 hover:bg-[#141414] transition-all duration-300"
    >
      <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-[#0a0a0a] shrink-0">
        <SafeImage
          src={(movie.thumbnailUrl || movie.backdropUrl)?.replace("/w500/", "/w92/").replace("/w780/", "/w92/")}
          alt={movie.title || ""}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-bold text-white/80 truncate group-hover:text-white transition-colors">{movie.title}</span>
        <span className="text-[9px] text-white/40 font-medium">{movie.releaseYear || "N/A"} · {movie.rating || "N/A"}</span>
      </div>
      <ChevronRight size={14} className="text-white/20 group-hover:text-red-400 transition-colors shrink-0" />
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-white/10 border-t-red-600 rounded-full animate-spin" />
          <p className="text-sm text-white/30 font-medium">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
