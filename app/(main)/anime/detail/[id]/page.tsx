import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAnimeDetail, getAnimeList } from "@/lib/anilist";
import AnimeCard from "@/components/anime/AnimeCard";
import { Star, Play, Calendar, Film, Clock, Sparkles, ChevronRight, Share2, Heart, ListPlus } from "lucide-react";

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anilistId = Number(id);

  if (isNaN(anilistId)) {
    notFound();
  }

  const [anime, popularAnime] = await Promise.all([
    getAnimeDetail(anilistId),
    getAnimeList("POPULARITY_DESC", {}, 12).catch(() => []),
  ]);

  if (!anime) {
    notFound();
  }

  const totalEpisodes = anime.episodes || 24;
  const episodeList = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return (
    <div className="bg-[#09090b] min-h-screen text-white flex flex-col">
      <Header />

      {/* HERO BANNER SECTION */}
      <div className="relative pt-24 pb-16 px-4 md:px-14 xl:px-20 overflow-hidden border-b border-white/5">
        {anime.bannerImage ? (
          <div className="absolute inset-0 z-0">
            <img src={anime.bannerImage} alt={anime.title} className="w-full h-full object-cover opacity-20 blur-md scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"></div>
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-950/20 via-[#09090b] to-[#09090b]"></div>
        )}

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-start">
          
          {/* Cover Poster */}
          <div className="relative w-44 md:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <img src={anime.coverImage || anime.coverMedium} alt={anime.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Link
                href={`/anime/watch/${anime.id}?ep=1`}
                className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
              >
                <Play size={24} className="fill-white ml-1" />
              </Link>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                {anime.format || "ANIME"}
              </span>
              {anime.status && (
                <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {anime.status}
                </span>
              )}
              <span className="bg-white/5 text-white/60 px-3 py-1 rounded-full text-xs font-medium">
                AniList #{anime.id}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              {anime.title}
            </h1>
            {anime.english && anime.english !== anime.title && (
              <p className="text-base text-white/50 font-medium -mt-2">{anime.english}</p>
            )}

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/70 py-1">
              {anime.averageScore && (
                <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-xl">
                  <Star size={14} className="fill-yellow-400" />
                  <span>{(anime.averageScore / 10).toFixed(1)} / 10</span>
                </div>
              )}
              {anime.year && (
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Calendar size={14} className="text-red-500" />
                  <span>{anime.year}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Film size={14} className="text-red-500" />
                  <span>{anime.episodes} Episodes</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Clock size={14} className="text-red-500" />
                  <span>{anime.duration} min/ep</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/anime/watch/${anime.id}?ep=1`}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-xl shadow-red-600/30 active:scale-95 transition-all text-sm"
              >
                <Play size={18} className="fill-white" />
                <span>Watch Episode 1</span>
              </Link>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 pt-2">
              {anime.genres.map((genre) => (
                <span key={genre} className="bg-[#141417] border border-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-lg">
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            {anime.description && (
              <div className="mt-2 bg-[#141417]/80 p-4 rounded-xl border border-white/5">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Synopsis</h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed max-h-40 overflow-y-auto pr-2">
                  {anime.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EPISODE SELECTION SECTION */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-14 xl:px-20 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
            <h2 className="text-xl font-extrabold text-white">Episodes ({totalEpisodes})</h2>
          </div>
          <span className="text-xs font-semibold text-white/40">Select episode to play</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2.5">
          {episodeList.map((ep) => (
            <Link
              key={ep}
              href={`/anime/watch/${anime.id}?ep=${ep}`}
              className="flex flex-col items-center justify-center py-3 rounded-xl bg-[#141417] hover:bg-red-600 text-white/80 hover:text-white border border-white/5 font-extrabold text-xs transition-all active:scale-95 group"
            >
              <span>EP {ep}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* RECOMMENDED ANIME ROW */}
      {popularAnime.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-14 xl:px-20 py-10 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
            <h2 className="text-xl font-extrabold text-white">You Might Also Like</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularAnime.map((item) => (
              <AnimeCard key={item.id} anime={item} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
