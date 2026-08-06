import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAnimeList } from "@/lib/anilist";
import AnimeCard from "@/components/anime/AnimeCard";
import { IconsClubLogo } from "@/components/ui/IconsClubLogo";
import { ShieldCheck, Flame, Award, Sparkles, Film } from "lucide-react";

export const revalidate = 3600;

export default async function AnimeBrowsePage() {
  const [trending, topRated, trendingNow, movies] = await Promise.all([
    getAnimeList("POPULARITY_DESC", {}, 18).catch(() => []),
    getAnimeList("SCORE_DESC", {}, 18).catch(() => []),
    getAnimeList("TRENDING_DESC", {}, 18).catch(() => []),
    getAnimeList("POPULARITY_DESC", { format: "MOVIE" }, 18).catch(() => []),
  ]);

  const ANIME_PROVIDERS = [
    { name: "crunchyroll", label: "Crunchyroll" },
    { name: "allmanga", label: "AllManga" },
    { name: "reanime", label: "ReAnime" },
    { name: "anikoto", label: "AniKoto" },
    { name: "kickassanime", label: "KickAssAnime" },
    { name: "animegg", label: "AnimeGG" },
  ];

  return (
    <div className="bg-[#09090b] min-h-screen text-white">
      <Header />
      <div className="pt-24 px-4 md:px-14 xl:px-20 relative z-20 flex flex-col gap-12 pb-20 max-w-[1600px] mx-auto">
        
        {/* AniXAnime Server Banner */}
        <div className="mt-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-[#141417] to-[#09090b] border border-red-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-red-600/20 text-red-400 border border-red-500/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AniXAnime Engine Active
                </span>
                <span className="text-xs text-white/60 font-medium flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-400" /> 10 Direct Server Providers
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-center gap-3">
                AniXAnime <span className="text-red-500 text-xl md:text-2xl font-bold">&bull; Dedicated Anime Hub</span>
              </h1>
              
              <p className="text-xs md:text-sm text-white/70 max-w-2xl leading-relaxed">
                Stream full anime episodes powered directly by the AniXAnime multi-provider engine (AniList IDs, Sub & Dub audio, multi-server fallbacks).
              </p>
            </div>

            {/* Provider Badges */}
            <div className="flex flex-wrap items-center gap-2 bg-black/50 p-4 rounded-2xl border border-white/5 shrink-0">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mr-2">Servers</span>
              {ANIME_PROVIDERS.map((p) => (
                <div key={p.name} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors">
                  <IconsClubLogo name={p.name} size={18} radius={4} className="w-4 h-4 object-contain" fallbackText={p.label.charAt(0)} />
                  <span className="text-xs font-bold text-white/90">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Trending Anime Row */}
        {trending.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-7 bg-red-600 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-red-500" />
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Trending Anime</h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trending.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* 2. Top Rated Classics Row */}
        {topRated.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-red-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-yellow-500" />
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Top Rated Classics</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topRated.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* 3. New Airing & Trending Now */}
        {trendingNow.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-red-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-400" />
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Trending This Season</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingNow.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Anime Movies */}
        {movies.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-red-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Film size={20} className="text-purple-400" />
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Popular Anime Movies</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>
        )}

      </div>
      <Footer />
    </div>
  );
}