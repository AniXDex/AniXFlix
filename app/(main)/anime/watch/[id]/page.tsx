import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAnimeDetail, getAnimeList } from "@/lib/anilist";
import { notFound } from "next/navigation";
import AniXAnimePlayer from "@/components/anime/AniXAnimePlayer";
import AnimeCard from "@/components/anime/AnimeCard";
import { Star, ShieldCheck, Sparkles, Film, Calendar, Clock } from "lucide-react";

export default async function AniXAnimeWatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const anilistId = Number(id);
  const initialEp = sParams.ep ? Math.max(1, Number(sParams.ep)) : 1;

  if (isNaN(anilistId)) {
    notFound();
  }

  const [anime, similarAnime] = await Promise.all([
    getAnimeDetail(anilistId),
    getAnimeList("POPULARITY_DESC", {}, 12).catch(() => []),
  ]);

  if (!anime) {
    notFound();
  }

  return (
    <div className="bg-[#09090b] min-h-screen text-white flex flex-col">
      <Header />

      {/* ANIXANIME PLAYER WATCH INTERFACE */}
      <div className="pt-20">
        <AniXAnimePlayer
          anilistId={anilistId}
          anime={anime}
          initialEpisode={initialEp}
          similarAnime={similarAnime}
        />
      </div>

      {/* ANIME DETAILS SECTION */}
      <div className="px-4 md:px-14 xl:px-20 py-10 flex flex-col gap-12 max-w-7xl mx-auto">
        
        {/* Banner / Title Row */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-[#141417] p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
          {anime.bannerImage && (
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <img src={anime.bannerImage} alt={anime.title} className="w-full h-full object-cover blur-sm" />
            </div>
          )}

          <div className="relative w-36 md:w-48 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <img src={anime.coverImage || anime.coverMedium} alt={anime.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col gap-4 relative z-10 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-black uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AniXAnime Engine Stream
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md text-xs font-bold text-white/80">
                AniList ID: {anime.id}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{anime.title}</h1>
            {anime.english && anime.english !== anime.title && (
              <p className="text-sm text-white/50 -mt-2 font-medium">{anime.english}</p>
            )}

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70">
              {anime.averageScore && (
                <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-2.5 py-1 rounded-md border border-yellow-400/20">
                  <Star size={13} className="fill-yellow-400" /> {(anime.averageScore / 10).toFixed(1)} / 10
                </span>
              )}
              {anime.year && (
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md">
                  <Calendar size={13} /> {anime.year}
                </span>
              )}
              {anime.episodes && (
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md">
                  <Film size={13} /> {anime.episodes} Episodes
                </span>
              )}
              {anime.duration && (
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md">
                  <Clock size={13} /> {anime.duration} min/ep
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {anime.genres.map((g) => (
                <span key={g} className="bg-white/5 hover:bg-white/10 text-white/80 text-xs px-3 py-1 rounded-lg border border-white/5 font-medium">
                  {g}
                </span>
              ))}
            </div>

            {/* Overview */}
            {anime.description && (
              <p className="text-xs md:text-sm text-white/70 leading-relaxed mt-2 line-clamp-6">
                {anime.description}
              </p>
            )}
          </div>
        </div>

        {/* SIMILAR ANIME ROW */}
        {similarAnime.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-600 rounded-full"></div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Trending AniXAnime Hits</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarAnime.map((item) => (
                <AnimeCard key={item.id} anime={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
