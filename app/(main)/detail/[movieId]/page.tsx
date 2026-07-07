import React from "react";
import Header from "@/components/Header";
import { tmdb } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles, Star } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";
import WatchlistButton from "../../../../components/movie/WatchlistButton";
import SeasonEpisodesClient from "@/components/movie/SeasonEpisodesClient";

export default async function TitlePage({ params, searchParams }: { params: Promise<{ movieId: string }>, searchParams: Promise<{ v?: string }> }) {
  const { movieId } = await params;
  const { v } = await searchParams;

  let isTv = v === "2";
  let details = null;

  if (v === "2") {
    details = await tmdb.getDetails("tv", movieId);
  } else if (v === "1") {
    details = await tmdb.getDetails("movie", movieId);
  } else {
    // Fallback if no v provided
    details = await tmdb.getDetails("movie", movieId);
    if (!details || details.success === false) {
      details = await tmdb.getDetails("tv", movieId);
      isTv = true;
    }
  }

  if (!details || details.success === false) {
    notFound();
  }

  const mappedMovie = mapTmdbToAnix(details);

  // Logo fetching
  const logos = details.images?.logos || [];
  const enLogo = logos.find((l: any) => l.iso_639_1 === 'en') || logos[0];
  const logoUrl = enLogo ? `https://image.tmdb.org/t/p/w500${enLogo.file_path}` : null;

  // Actors
  const cast = details.credits?.cast?.slice(0, 10) || [];

  // Recommendations
  const similar = details.recommendations?.results?.length > 0 
    ? details.recommendations.results 
    : (details.similar?.results || []);
  const mappedSimilar = similar.slice(0, 12).map((m: any) => mapTmdbToAnix(m));

  // Episodes
  let episodes: any[] = [];
  if (isTv && details.seasons) {
    const defaultSeason = details.seasons.find((s: any) => s.season_number > 0) || details.seasons[0];
    if (defaultSeason) {
      const seasonData = await tmdb.getSeasonDetails(movieId, defaultSeason.season_number);
      episodes = seasonData?.episodes || [];
    }
  }

  // Backdrop fetching (using sorting logic for titled english backdrops)
  const backdrops = details.images?.backdrops || [];
  const bestBackdrop = backdrops
    .filter((b: any) => b.iso_639_1 === "en")
    .sort((a: any, b: any) => b.vote_average - a.vote_average)[0]
    ?? backdrops[0];
    
  const heroBackdropUrl = bestBackdrop 
    ? `https://image.tmdb.org/t/p/original${bestBackdrop.file_path}` 
    : mappedMovie.backdropUrl || mappedMovie.thumbnailUrl || "";

  return (
    <div className="bg-[#09090b] min-h-screen pb-20">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[70vh] md:h-[90vh] -mt-20 overflow-hidden bg-[#09090b]">
        <Image
          src={heroBackdropUrl}
          alt={mappedMovie.title || "Backdrop"}
          fill
          className="object-cover object-top opacity-50 md:opacity-70"
          priority
        />
        
        {/* Gradients for blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/60 to-transparent"></div>

        <div className="absolute left-4 md:left-14 bottom-[12%] md:bottom-[15%] max-w-[90%] md:max-w-4xl z-10 flex flex-col items-start">
          
          {logoUrl ? (
            <Image 
              src={logoUrl} 
              alt={mappedMovie.title || "Logo"} 
              width={400} 
              height={150}
              className="w-48 md:w-80 h-auto max-h-[100px] md:max-h-[150px] object-contain object-left mb-6 drop-shadow-2xl" 
            />
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg uppercase leading-[0.95] line-clamp-3 md:line-clamp-2">
              {mappedMovie.title}
            </h1>
          )}

          <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-white/70 mb-4">
            <span className="flex items-center gap-1 text-red-500 font-bold">
              <Star size={14} className="fill-red-500" /> 
              {mappedMovie.rating || "N/A"}
            </span>
            <span>&middot;</span>
            <span>{mappedMovie.releaseYear || "2026"}</span>
            <span>&middot;</span>
            <span className="border border-white/20 px-1.5 py-0.5 rounded-sm">{isTv ? "TV Show" : "Movie"}</span>
            {details.genres?.slice(0,2).map((g: any) => (
              <React.Fragment key={g.id}>
                <span>&middot;</span>
                <span>{g.name}</span>
              </React.Fragment>
            ))}
          </div>

          <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4 max-w-2xl mb-8 drop-shadow-md">
            {mappedMovie.description}
          </p>

          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <Link 
              href={`/play/${movieId}${isTv ? '?s=1&e=1' : ''}`}
              className="bg-white hover:bg-white/90 text-black px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Play size={18} fill="black" /> Play
            </Link>
            
            <WatchlistButton movie={mappedMovie} />
            
            <a href="#similar" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full font-semibold border border-white/10 flex items-center gap-2 transition-colors">
              <Sparkles size={18} /> Similars
            </a>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-14 flex flex-col gap-16 md:gap-20 mt-4 md:mt-8 relative z-20">
        
        {/* Episodes Section */}
        {isTv && details.seasons && details.seasons.length > 0 && (
          <SeasonEpisodesClient 
            movieId={movieId} 
            seasons={details.seasons} 
            initialEpisodes={episodes} 
          />
        )}

        {/* Actors Section */}
        {cast.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Actors</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cast.map((actor: any) => (
                <div key={actor.id} className="flex items-center gap-4 bg-[#141414] p-3 rounded-2xl border border-white/5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/5 shrink-0">
                    {actor.profile_path ? (
                      <Image 
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                        alt={actor.name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20">?</div>
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-white truncate">{actor.name}</span>
                    <span className="text-xs text-white/50 truncate">{actor.character}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similars Section */}
        {mappedSimilar.length > 0 && (
          <section id="similar" className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">You may like</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mappedSimilar.map((movie: any) => (
                <MovieCard key={movie.publicId} movie={movie} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
