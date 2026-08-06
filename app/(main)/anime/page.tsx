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
        
        {/* Clean Anime Page Header */}
        <div className="flex flex-col gap-2 border-b border-white/5 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Anime <span className="text-xs font-bold text-red-500 bg-red-600/10 px-3 py-1 rounded-full border border-red-500/20">AniXAnime Engine</span>
          </h1>
          <p className="text-xs md:text-sm text-white/50">
            Explore and stream top trending anime, movies, and seasonal releases.
          </p>
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