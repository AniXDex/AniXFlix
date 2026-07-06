"use client";
import { Movie } from "@/types/types";
import React, { useState } from "react";
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
  isTop10?: boolean;
}

function MoviesRow({ title, movies, isTop10 = false }: Props) {
  const [activeTab, setActiveTab] = useState<"movies" | "series">("movies");

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      
      {/* Section Header */}
      <div className="flex items-end justify-between px-2">
        <div className="flex items-center gap-3">
          {/* Red Accent Line */}
          <div className="w-1 h-6 md:h-7 bg-red-600 rounded-full"></div>
          <h2 className="font-bold text-xl md:text-2xl text-white tracking-tight">{title}</h2>
        </div>

      {/* Carousel */}
      <Carousel opts={{ align: "start" }} className="w-full relative group/carousel">
        <CarouselContent className="gap-2 md:gap-4 px-2">
          {movies.map((movie, index) => (
            <CarouselItem
              key={movie.id}
              className={`pl-0 ${isTop10 ? 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-[14.28%]' : 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/5'}`}
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

    </section>
  );
}

export default MoviesRow;
