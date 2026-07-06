"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MovieCard from "@/components/movie/MovieCard";
import { Play } from "lucide-react";

export default function PlayerTabs({ 
  type, 
  episodes, 
  currentEpisodeData, 
  season, 
  episode, 
  mappedSimilar, 
  tmdbId, 
  details 
}: any) {
  const [activeTab, setActiveTab] = useState(type === "tv" ? "Episodes" : "Related");

  return (
    <div className="flex flex-col gap-8 w-full pb-20">
      {/* Tabs */}
      <div className="flex items-center gap-6 md:gap-10 border-b border-white/5 pb-2 overflow-x-auto scrollbar-hide pt-4">
        {type === "tv" && (
          <button 
            onClick={() => setActiveTab("Episodes")}
            className={`${activeTab === "Episodes" ? 'text-[#ff9d00] border-b-2 border-[#ff9d00] font-bold' : 'text-white/50 hover:text-white font-semibold'} pb-2 transition-colors whitespace-nowrap`}
          >
            Episodes
          </button>
        )}
        <button 
          onClick={() => setActiveTab("Related")}
          className={`${activeTab === "Related" ? 'text-[#ff9d00] border-b-2 border-[#ff9d00] font-bold' : 'text-white/50 hover:text-white font-semibold'} pb-2 transition-colors whitespace-nowrap`}
        >
          Related
        </button>
        <button 
          onClick={() => setActiveTab("Details")}
          className={`${activeTab === "Details" ? 'text-[#ff9d00] border-b-2 border-[#ff9d00] font-bold' : 'text-white/50 hover:text-white font-semibold'} pb-2 transition-colors whitespace-nowrap`}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab("Clips")}
          className={`${activeTab === "Clips" ? 'text-[#ff9d00] border-b-2 border-[#ff9d00] font-bold' : 'text-white/50 hover:text-white font-semibold'} pb-2 transition-colors whitespace-nowrap`}
        >
          Clips
        </button>
        <button 
          onClick={() => setActiveTab("Photos")}
          className={`${activeTab === "Photos" ? 'text-[#ff9d00] border-b-2 border-[#ff9d00] font-bold' : 'text-white/50 hover:text-white font-semibold'} pb-2 transition-colors whitespace-nowrap`}
        >
          Photos
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "Episodes" && type === "tv" && episodes.length > 0 && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {currentEpisodeData && (
              <div className="bg-[#141417] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6 border border-white/5 shadow-xl">
                <div className="relative w-full md:w-[350px] aspect-video shrink-0 rounded-xl overflow-hidden bg-black/50">
                  {currentEpisodeData.still_path ? (
                    <Image 
                      src={`https://image.tmdb.org/t/p/w780${currentEpisodeData.still_path}`} 
                      alt={currentEpisodeData.name || "Episode image"} 
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
                        href={`/play/${tmdbId}?s=${season}&e=${currentEpisodeData.episode_number - 1}`}
                        className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Previous Episode
                      </Link>
                    )}
                    {currentEpisodeData.episode_number < episodes.length && (
                      <Link 
                        href={`/play/${tmdbId}?s=${season}&e=${currentEpisodeData.episode_number + 1}`}
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

            <div className="mt-4">
              <h3 className="text-lg font-bold mb-6">Season Episodes <span className="text-white/40 text-sm font-normal ml-2">({episodes.length} total)</span></h3>
              <div className="flex flex-col gap-3">
                {episodes.map((ep: any) => (
                  <Link 
                    href={`/play/${tmdbId}?s=${season}&e=${ep.episode_number}`}
                    key={ep.id}
                    className={`flex flex-col md:flex-row items-center gap-6 p-3 rounded-xl transition-all border border-transparent hover:bg-[#141417] hover:border-white/5 ${ep.episode_number === episode ? 'bg-[#141417] border-white/5' : ''}`}
                  >
                    <div className="relative w-full md:w-48 aspect-video shrink-0 rounded-lg overflow-hidden bg-black/50">
                      {ep.still_path ? (
                        <Image 
                          src={`https://image.tmdb.org/t/p/w500${ep.still_path}`} 
                          alt={ep.name || "Episode Image"} 
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

        {activeTab === "Related" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold">Related {type === "tv" ? "Shows" : "Movies"}</h3>
            {mappedSimilar.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mappedSimilar.map((movie: any) => (
                  <MovieCard key={movie.publicId} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-sm">No related content found.</p>
            )}
          </div>
        )}

        {activeTab === "Details" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-4xl">
            <h3 className="text-2xl font-bold">{details?.title || details?.name}</h3>
            <p className="text-white/70 text-lg leading-relaxed">{details?.overview}</p>
            <div className="grid grid-cols-2 gap-8 mt-4">
              <div>
                <h4 className="text-white/40 font-bold uppercase text-xs tracking-wider mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {details?.genres?.map((g: any) => (
                    <span key={g.id} className="bg-white/5 px-3 py-1 rounded-full text-sm">{g.name}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white/40 font-bold uppercase text-xs tracking-wider mb-2">Status</h4>
                <p className="text-white/90">{details?.status}</p>
              </div>
              {details?.networks && (
                <div>
                  <h4 className="text-white/40 font-bold uppercase text-xs tracking-wider mb-2">Network</h4>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
                    {details.networks.map((n: any) => (
                      n.logo_path ? (
                        <Image key={n.id} src={`https://image.tmdb.org/t/p/w200${n.logo_path}`} alt={n.name} width={60} height={30} className="invert opacity-70" />
                      ) : (
                        <span key={n.id} className="font-bold">{n.name}</span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Clips" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold">Clips & Trailers</h3>
            {details?.videos?.results?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {details.videos.results.slice(0, 4).map((video: any) => (
                  <div key={video.id} className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe 
                      src={`https://www.youtube.com/embed/${video.key}`} 
                      className="w-full h-full" 
                      allowFullScreen 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-sm">No clips available.</p>
            )}
          </div>
        )}

        {activeTab === "Photos" && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold">Photos</h3>
            {details?.images?.backdrops?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.images.backdrops.slice(0, 6).map((img: any, i: number) => (
                  <div key={i} className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/50">
                    <Image src={`https://image.tmdb.org/t/p/w780${img.file_path}`} alt="Backdrop" fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-sm">No photos available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
