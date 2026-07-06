import React from "react";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";
import Image from "next/image";
import Link from "next/link";
import MovieCard from "@/components/movie/MovieCard";

export default async function PlayerDetails({ tmdbId, type, season, episode }: { tmdbId: string, type: "tv" | "movie", season: number, episode: number }) {
  const tmdbData = await tmdb.getDetails(type, tmdbId);
  if (!tmdbData || tmdbData.success === false) return null;
  
  const mappedMovie = mapTmdbToAnix(tmdbData);
  let episodes: any[] = [];
  let currentEpisodeData = null;
  
  if (type === "tv") {
    const seasonData = await tmdb.getSeasonDetails(tmdbId, season);
    episodes = seasonData?.episodes || [];
    currentEpisodeData = episodes.find((ep: any) => ep.episode_number === episode) || episodes[0];
  }

  const similar = tmdbData.recommendations?.results?.length > 0 
    ? tmdbData.recommendations.results 
    : (tmdbData.similar?.results || []);
  const mappedSimilar = similar.slice(0, 10).map((m: any) => mapTmdbToAnix(m));

  return (
    <div id="episodes" className="w-full bg-[#0a0a0a] min-h-screen text-white pt-8 px-4 md:px-8 pb-20">
      
      {/* Tabs */}
      <div className="flex items-center gap-6 md:gap-10 border-b border-white/5 pb-2 mb-8 overflow-x-auto scrollbar-hide">
        {type === "tv" && (
          <button className="text-[#ff9d00] font-bold pb-2 border-b-2 border-[#ff9d00] whitespace-nowrap">
            Episodes
          </button>
        )}
        <button className={`${type !== "tv" ? 'text-[#ff9d00] border-b-2 border-[#ff9d00] pb-2 font-bold' : 'text-white/50 hover:text-white font-semibold pb-2'} transition-colors whitespace-nowrap`}>
          Related
        </button>
        <button className="text-white/50 hover:text-white font-semibold pb-2 transition-colors whitespace-nowrap">Details</button>
        <button className="text-white/50 hover:text-white font-semibold pb-2 transition-colors whitespace-nowrap">Clips</button>
        <button className="text-white/50 hover:text-white font-semibold pb-2 transition-colors whitespace-nowrap">Photos</button>
        <button className="text-white/50 hover:text-white font-semibold pb-2 transition-colors whitespace-nowrap">Reviews</button>
      </div>

      <div className="flex flex-col gap-12">
        {type === "tv" && episodes.length > 0 && (
          <div className="flex flex-col gap-8">
            
            {/* Now Playing Card */}
            {currentEpisodeData && (
              <div className="bg-[#141417] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6 border border-white/5 shadow-xl">
                <div className="relative w-full md:w-[350px] aspect-video shrink-0 rounded-xl overflow-hidden bg-black/50">
                  {currentEpisodeData.still_path ? (
                    <Image 
                      src={`https://image.tmdb.org/t/p/w780${currentEpisodeData.still_path}`} 
                      alt={currentEpisodeData.name} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">No Image</div>
                  )}
                  <div className="absolute top-3 left-3 bg-[#ff9d00] text-black text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Now Playing
                  </div>
                </div>

                <div className="flex flex-col justify-center flex-1 py-2">
                  <div className="flex items-center gap-3 text-[#ff9d00] text-xs font-bold tracking-widest uppercase mb-2">
                    <span>Season {season}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff9d00]/50"></span>
                    <span>Episode {currentEpisodeData.episode_number}</span>
                    <span className="text-white/30 tracking-normal capitalize flex items-center gap-3 ml-2">
                      <span>•</span> {currentEpisodeData.air_date} <span>•</span> {currentEpisodeData.runtime || '45'} mins
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentEpisodeData.name}</h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">
                    {currentEpisodeData.overview || "No description available for this episode."}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    {currentEpisodeData.episode_number > 1 && (
                      <Link 
                        href={`/watch/${tmdbId}?type=tv&season=${season}&episode=${currentEpisodeData.episode_number - 1}`}
                        className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Previous Episode
                      </Link>
                    )}
                    {currentEpisodeData.episode_number < episodes.length && (
                      <Link 
                        href={`/watch/${tmdbId}?type=tv&season=${season}&episode=${currentEpisodeData.episode_number + 1}`}
                        className="bg-[#ff9d00] hover:bg-[#ffaa22] text-black px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(255,157,0,0.2)] flex items-center gap-2"
                      >
                        Next Episode
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Season Episodes List */}
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-6">Season Episodes <span className="text-white/40 text-sm font-normal ml-2">({episodes.length} total)</span></h3>
              <div className="flex flex-col gap-3">
                {episodes.map((ep: any) => (
                  <Link 
                    href={`/watch/${tmdbId}?type=tv&season=${season}&episode=${ep.episode_number}`}
                    key={ep.id}
                    className={`flex flex-col md:flex-row items-center gap-6 p-3 rounded-xl transition-all border border-transparent hover:bg-[#141417] hover:border-white/5 ${ep.episode_number === episode ? 'bg-[#141417] border-white/5' : ''}`}
                  >
                    <div className="relative w-full md:w-48 aspect-video shrink-0 rounded-lg overflow-hidden bg-black/50">
                      {ep.still_path ? (
                        <Image 
                          src={`https://image.tmdb.org/t/p/w500${ep.still_path}`} 
                          alt={ep.name} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20">No Image</div>
                      )}
                      {ep.episode_number === episode && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="text-[#ff9d00] text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full shadow-lg border border-[#ff9d00]/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            Playing
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-center flex-1 py-1">
                      <h4 className={`text-base font-bold mb-1 ${ep.episode_number === episode ? 'text-[#ff9d00]' : 'text-white'}`}>
                        Episode {ep.episode_number}: {ep.name}
                      </h4>
                      <div className="text-xs text-white/40 mb-2 font-medium">
                        {ep.air_date} <span className="mx-1.5">•</span> {ep.runtime || '45'} mins
                      </div>
                      <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                        {ep.overview || "No description available."}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Section */}
        {mappedSimilar.length > 0 && (
          <div className="flex flex-col gap-6 mt-8">
            <h3 className="text-lg font-bold">Related {type === "tv" ? "Shows" : "Movies"}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mappedSimilar.map((movie: any) => (
                <MovieCard key={movie.publicId} movie={movie} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
