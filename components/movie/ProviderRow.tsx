"use client";

import { Movie } from "@/types/types";
import React, { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import MovieCard from "./MovieCard";
import { getMoviesByProvider, getSeriesByProvider } from "@/app/actions/provider";
import { ChevronDown } from "lucide-react";

// TMDB Watch Provider IDs for US
const PROVIDERS = [
  { id: "8", name: "Netflix", color: "#E50914", short: "N" },
  { id: "9", name: "Prime Video", color: "#00A8E1", short: "P" },
  { id: "1899", name: "Max", color: "#000000", short: "M", border: true },
  { id: "337", name: "Disney+", color: "#113CCF", short: "D+" },
  { id: "350", name: "Apple TV+", color: "#000000", short: "tv", border: true },
  { id: "531", name: "Paramount+", color: "#0064FF", short: "P+" },
  { id: "15", name: "Hulu", color: "#1CE783", short: "H" },
];

interface Props {
  initialMovies: Movie[];
  initialSeries: Movie[];
}

function ProviderRow({ initialMovies, initialSeries }: Props) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [series, setSeries] = useState<Movie[]>(initialSeries);
  const [activeTab, setActiveTab] = useState<"movies" | "series">("movies");
  const [activeProvider, setActiveProvider] = useState(PROVIDERS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleProviderChange = async (provider: typeof PROVIDERS[0]) => {
    setActiveProvider(provider);
    setIsDropdownOpen(false);
    setIsLoading(true);
    
    try {
      const [newMovies, newSeries] = await Promise.all([
        getMoviesByProvider(provider.id),
        getSeriesByProvider(provider.id)
      ]);
      setMovies(newMovies);
      setSeries(newSeries);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentList = activeTab === "series" ? series : movies;

  return (
    <section ref={rowRef} className="flex flex-col gap-4 md:gap-7 relative min-h-[180px] md:min-h-[300px]">
      
      {/* Section Header */}
      <div className="flex items-end z-40 relative">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 md:h-7 bg-red-600 rounded-full"></div>
          <div className="flex items-center text-xl md:text-2xl tracking-tight">
            <span className="text-white/80 font-normal mr-2">Only on</span>
            
            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center font-bold text-white hover:text-white/80 transition-colors"
              >
                {activeProvider.name}
                <ChevronDown size={20} className={`ml-1 text-red-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-60 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderChange(provider)}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-semibold transition-colors
                        ${activeProvider.id === provider.id ? 'bg-white/10 text-red-500' : 'text-white hover:bg-white/5'}
                      `}
                    >
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0
                          ${provider.border ? 'border border-white/20' : ''}
                        `}
                        style={{ backgroundColor: provider.color }}
                      >
                        {provider.short}
                      </div>
                      {provider.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for Movies / Series */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-1 z-40 relative mr-4 ml-auto">
          <button 
            onClick={() => setActiveTab("movies")}
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'movies' ? 'text-white border-red-600' : 'text-white/50 border-transparent hover:text-white'}`}
          >
            Movies
          </button>
          <button 
            onClick={() => setActiveTab("series")}
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'series' ? 'text-white border-red-600' : 'text-white/50 border-transparent hover:text-white'}`}
          >
            Series
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {isVisible ? (
          <Carousel opts={{ align: "start", slidesToScroll: 3 }} className="w-full relative group/carousel">
            <CarouselContent className="">
              {currentList.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="basis-[40%] sm:basis-1/3 md:basis-[30%] lg:basis-[22%] xl:basis-[18%]"
                >
                  <MovieCard movie={movie} isPortrait={false} isResponsive={true} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none px-4 flex justify-between opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
              <CarouselPrevious className="relative pointer-events-auto w-12 h-12 bg-black/50 border-white/10 hover:bg-black/80 hover:scale-110 transition-all text-white backdrop-blur-sm -left-6" />
              <CarouselNext className="relative pointer-events-auto w-12 h-12 bg-black/50 border-white/10 hover:bg-black/80 hover:scale-110 transition-all text-white backdrop-blur-sm -right-6" />
            </div>
          </Carousel>
        ) : (
          <div className="w-full h-[200px] md:h-[250px] bg-white/5 rounded-2xl animate-pulse"></div>
        )}
      </div>

    </section>
  );
}

export default ProviderRow;
