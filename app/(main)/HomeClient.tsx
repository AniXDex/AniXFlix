"use client";
import MoviesRow from "@/components/movie/MoviesRow";
import ProviderRow from "@/components/movie/ProviderRow";
import { useGlobalContext } from "@/context/globalContext";
import { Star, Play, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/types";

interface HomeClientProps {
  trending: Movie[];
  topRated: Movie[];
  action: Movie[];
  comedy: Movie[];
  animation: Movie[];
  netflix: Movie[];
}

export default function HomeClient({ trending, topRated, action, comedy, animation, netflix }: HomeClientProps) {
  const router = useRouter();
  const { openModal } = useGlobalContext();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Filter out movies without backdrops to ensure hero always looks good
  const heroMovies = trending.filter(m => m.backdropUrl).slice(0, 10);

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000); // 8-second rotation
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const featured = heroMovies[featuredIndex];

  return (
    <div className="bg-[#09090b] min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] md:h-[90vh] -mt-20 overflow-hidden bg-[#09090b]">
        
        <AnimatePresence mode="wait">
          {featured && (
              <motion.div
                key={featured.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={featured.backdropUrl || ""} 
                alt={featured.title || "Hero Banner"} 
                className="w-full h-full object-cover object-top opacity-70"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent z-10"></div>

        {/* Hero Content */}
        <div className="absolute left-4 md:left-14 bottom-[12%] md:bottom-[15%] max-w-[90%] md:max-w-2xl z-20">
          <AnimatePresence mode="wait">
            {featured && (
              <motion.div
                key={`content-${featured.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="flex flex-col gap-4"
              >
                <h1 className="font-black text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95] tracking-tight u-text-shadow origin-left line-clamp-3 md:line-clamp-2">
                  {featured.title}
                </h1>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-[13px] md:text-sm text-white/80 font-medium mt-2 mb-2">
                  <Star size={14} className="text-red-600 fill-red-600 mb-0.5" />
                  <span className="text-red-600 font-bold">{featured.rating || "8.5"}</span>
                  <span className="text-white/40">&middot;</span>
                  <span>{featured.releaseYear || "2026"}</span>
                  <span className="text-white/40">&middot;</span>
                  <span>Action & Adventure</span>
                  <span className="text-white/40">&middot;</span>
                  <span>Animation</span>
                </div>
                
                {/* Description */}
                <p className="text-white/70 text-sm md:text-[15px] font-medium line-clamp-3 leading-relaxed max-w-2xl mb-4 drop-shadow-md pr-4">
                  {featured.description}
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    className="h-11 md:h-12 px-8 text-black bg-white hover:bg-white/90 flex items-center gap-2 font-bold text-[15px] rounded-full transition-colors shadow-lg"
                    onClick={() => router.push(`/title/${featured.publicId}?type=${featured.mediaType || 'movie'}`)}
                  >
                    <Play size={16} fill="black" /> Play
                  </button>
                  <button
                    className="h-11 md:h-12 px-8 text-white bg-transparent border border-white/20 hover:bg-white/10 flex items-center gap-2 font-bold text-[15px] rounded-full transition-colors"
                    onClick={() => router.push(`/title/${featured.publicId}?type=${featured.mediaType || 'movie'}`)}
                  >
                    <Info size={16} /> See More
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-30 flex flex-col gap-14 mt-4 md:mt-8 px-4 md:px-14 pb-20">
        <MoviesRow title="TOP 10 Today" movies={trending} isTop10={true} />
        <MoviesRow title="Trending Today" movies={topRated} />
        <ProviderRow initialMovies={netflix} />
        <MoviesRow title="New Release Movies" movies={action} />
        <MoviesRow title="Comedy Movies" movies={comedy} />
        <MoviesRow title="Sci-Fi & Fantasy" movies={animation} />
      </div>
    </div>
  );
}
