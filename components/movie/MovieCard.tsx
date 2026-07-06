"use client";
import { Movie } from "@/types/types";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface Props {
  movie: any;
  isPortrait?: boolean;
  rank?: number; // 1 to 10
}

function MovieCard({ movie, isPortrait = false, rank }: Props) {
  return (
    <Link href={`/watch/${movie.publicId}`} className="group flex flex-col gap-3 w-full cursor-pointer">
      {/* Poster Image Container */}
      <div className={`relative w-full overflow-hidden rounded-2xl ${isPortrait ? 'aspect-[2/3]' : 'aspect-video'} bg-white/5`}>
        <Image
          src={movie.thumbnailUrl || movie.backdropUrl || ""}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Top 10 Badge */}
        {rank !== undefined && (
          <div className="absolute top-0 left-0 bg-red-600 text-white flex flex-col items-center justify-center px-2 py-1 rounded-br-2xl shadow-lg z-10 min-w-10">
            <span className="text-[8px] font-bold uppercase leading-tight tracking-wider">TOP</span>
            <span className="text-sm font-black leading-tight">
              {rank.toString().padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-white text-sm md:text-base line-clamp-1 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] md:text-xs text-white/50 font-medium">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-red-600 fill-red-600 mb-0.5" />
            <span className="text-white/80">{movie.rating || "8.5"}</span>
          </div>
          <span>&middot;</span>
          <span>{movie.releaseYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "2026")}</span>
          <span>&middot;</span>
          <span>{movie.mediaType === "tv" ? "TV Show" : "Movie"}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
