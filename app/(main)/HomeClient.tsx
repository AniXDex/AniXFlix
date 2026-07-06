"use client";
import MoviesRow from "@/components/movie/MoviesRow";
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
}

export default function HomeClient({ trending, topRated, action, comedy, animation }: HomeClientProps) {
  const router = useRouter();
  const { openModal } = useGlobalContext();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Filter out movies without backdrops to ensure hero always looks good
  const heroMovies = trending.filter(m => m.backdropUrl).slice(0, 10);

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % heroMovies.length);
    }, 10000); // 10-second smooth rotation
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
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
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
        <div className="absolute left-4 md:left-14 bottom-[15%] md:bottom-[20%] max-w-[90%] md:max-w-2xl z-20">
          <AnimatePresence mode="wait">
            {featured && (
              <motion.div
                key={`content-${featured.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Title */}
                <h1 className="font-black text-4xl md:text-7xl uppercase text-white leading-tight tracking-tighter u-text-shadow origin-left">
                  {featured.title}
                </h1>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-white/70 font-medium">
                  <Star size={14} className="text-red-600 fill-red-600" />
                  <span className="text-red-600 font-bold">{featured.rating || "8.5"}</span>
                  <span>&middot;</span>
                  <span>{featured.releaseYear || "2026"}</span>
                  <span>&middot;</span>
                  <span>Trending Now</span>
                </div>
                
                {/* Description */}
                <p className="text-white/60 text-xs md:text-sm font-medium line-clamp-3 md:line-clamp-4 max-w-xl">
                  {featured.description}
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    className="h-10 md:h-12 px-6 md:px-8 text-black bg-white hover:bg-white/90 flex items-center gap-2 font-bold text-sm rounded-full transition-colors"
                    onClick={() => router.push(`/watch/${featured.publicId}`)}
                  >
                    <Play size={18} fill="black" /> Play
                  </button>
                  <button
                    className="h-10 md:h-12 px-6 md:px-8 text-white bg-transparent border border-white/30 hover:bg-white/10 flex items-center gap-2 font-bold text-sm rounded-full transition-colors"
                    onClick={() => openModal("movie-info", featured)}
                  >
                    <Info size={18} /> See More
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-30 flex flex-col gap-14 -mt-10 md:-mt-20 px-4 md:px-14 pb-20">
        <MoviesRow title="TOP 10 Trending" movies={trending} isTop10={true} />
        <MoviesRow title="Top Rated Masterpieces" movies={topRated} />
        <MoviesRow title="Action Packed" movies={action} />
        <MoviesRow title="Laugh Out Loud" movies={comedy} />
        <MoviesRow title="Sci-Fi & Fantasy" movies={animation} />
      </div>
    </div>
  );
}
