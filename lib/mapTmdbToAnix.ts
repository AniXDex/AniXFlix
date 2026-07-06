import { Movie } from "@/types/types";

export const mapTmdbToAnix = (tmdbMovie: any, isFeatured = false, isTrending = false): Movie => {
  return {
    id: tmdbMovie.id.toString(),
    publicId: tmdbMovie.id.toString(),
    title: tmdbMovie.title || tmdbMovie.name || "Unknown",
    description: tmdbMovie.overview || "No description available.",
    thumbnailUrl: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
    backdropUrl: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : null,
    trailerUrl: null,
    videoUrl: null,
    cloudinaryId: null,
    duration: tmdbMovie.runtime || null,
    releaseYear: tmdbMovie.release_date 
      ? parseInt(tmdbMovie.release_date.split("-")[0]) 
      : tmdbMovie.first_air_date 
        ? parseInt(tmdbMovie.first_air_date.split("-")[0]) 
        : null,
    maturityRating: tmdbMovie.adult ? "R" : "PG-13",
    isTrending,
    isFeatured,
    createdAt: new Date(),
  };
};