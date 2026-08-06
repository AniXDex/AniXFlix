import Header from '@/components/Header';
import MoviesRow from '@/components/movie/MoviesRow';
import { tmdb } from '@/lib/tmdb';
import { mapTmdbToAnix } from '@/lib/mapTmdbToAnix';
import { IconsClubLogo } from '@/components/ui/IconsClubLogo';
import { Zap, ShieldCheck, Server } from 'lucide-react';

export default async function animePage() {
  const popular = await tmdb.getDiscover('tv', { genreId: '16', originalLanguage: 'ja', sortBy: 'popularity.desc' });
  const topRated = await tmdb.getDiscover('tv', { genreId: '16', originalLanguage: 'ja', sortBy: 'vote_average.desc' });
  const newReleases = await tmdb.getDiscover('tv', { genreId: '16', originalLanguage: 'ja', sortBy: 'first_air_date.desc' });
  
  const ANIME_PROVIDERS = [
    { name: 'crunchyroll', label: 'Crunchyroll' },
    { name: 'allmanga', label: 'AllManga' },
    { name: 'reanime', label: 'ReAnime' },
    { name: 'anikoto', label: 'AniKoto' },
    { name: 'kickassanime', label: 'KickAssAnime' },
    { name: 'animegg', label: 'AnimeGG' },
  ];

  return (
    <div className="bg-[#09090b] min-h-screen">
      <Header />
      <div className="pt-24 px-4 md:px-14 relative z-20 flex flex-col gap-8 pb-20">
        
        {/* AniXAnime Server Banner */}
        <div className="mt-4 p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#141417] to-[#09090b] border border-red-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-600/20 text-red-400 border border-red-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  AniXAnime Engine Active
                </span>
                <span className="text-xs text-white/50 font-medium flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" /> 10 Server Providers Operational
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Anime <span className="text-red-500 text-lg md:text-xl font-semibold">&bull; Powered by AniXAnime Server</span>
              </h1>
              
              <p className="text-xs md:text-sm text-white/70 max-w-2xl leading-relaxed">
                Stream anime seamlessly using our high-speed multi-provider fallback engine (Sub & Dub).
              </p>
            </div>

            {/* Provider Badges */}
            <div className="flex flex-wrap items-center gap-2 bg-black/40 p-3 rounded-xl border border-white/5 shrink-0">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mr-1">Sources</span>
              {ANIME_PROVIDERS.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors">
                  <IconsClubLogo name={p.name} size={16} radius={4} className="w-4 h-4 object-contain" fallbackText={p.label.charAt(0)} />
                  <span className="text-[11px] font-semibold text-white/80">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <MoviesRow title="Trending Anime" movies={popular.slice(0, 20).map(m => mapTmdbToAnix(m))} />
        <MoviesRow title="Top Rated Classics" movies={topRated.slice(0, 20).map(m => mapTmdbToAnix(m))} />
        <MoviesRow title="New Releases" movies={newReleases.slice(0, 20).map(m => mapTmdbToAnix(m))} />
      </div>
    </div>
  );
}