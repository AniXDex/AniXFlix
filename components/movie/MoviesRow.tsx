"use client";
import { Movie } from "@/types/types";
import React, { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "../ui/carousel";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  movies: Movie[];
  series?: Movie[];
  isTop10?: boolean;
}

function MoviesRow({ title, movies, series, isTop10 = false }: Props) {
  const [activeTab, setActiveTab] = useState<"movies" | "series">("movies");
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  
  const currentList = activeTab === "series" && series ? series : movies;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" } // Load slightly before it enters the viewport
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rowRef} className="flex flex-col gap-5 md:gap-7 relative min-h-[300px]">
      
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          {/* Red Accent Line */}
          <div className="w-1 h-6 md:h-7 bg-red-600 rounded-full"></div>
          <h2 className="font-bold text-xl md:text-2xl text-white tracking-tight">{title}</h2>
        </div>

        {/* Tabs for all rows */}
        {series && (
          <div className="flex items-center gap-4 border-b border-white/10 pb-1 z-40 relative mr-4">
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
        )}
      </div>

      {/* Carousel */}
      {isVisible ? (
        <Carousel opts={{ align: "start", slidesToScroll: 3 }} className="w-full relative group/carousel">
          <CarouselContent className="">
            {currentList.map((movie, index) => (
              <CarouselItem
                key={movie.id}
                className={`${isTop10 ? 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-[14.28%]' : 'basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4'}`}
              >
                <MovieCard movie={movie} isPortrait={isTop10} rank={isTop10 ? index + 1 : undefined} />
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

    </section>
  );
}

export default MoviesRow;
