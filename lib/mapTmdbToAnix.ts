import { Movie } from "@/types/types";

export const mapTmdbToAnix = (tmdbMovie: any, isFeatured = false, isTrending = false): Movie => {
  return {
    id: tmdbMovie.id.toString(),
    publicId: tmdbMovie.id.toString(),
    title: tmdbMovie.title || tmdbMovie.name || "Unknown",
    description: tmdbMovie.overview || "No description available.",
    thumbnailUrl: tmdbMovie.poster_path ? `https://wsrv.nl/?url=${encodeURIComponent(`https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`)}&output=webp&q=65&n=-1` : null,
    backdropUrl: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}` : null,
    trailerUrl: null,
    videoUrl: null,
    cloudinaryId: null,
    duration: tmdbMovie.runtime || null,
    rating: tmdbMovie.vote_average ? tmdbMovie.vote_average.toFixed(1) : null,
    releaseYear: tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.split("-")[0]) : (tmdbMovie.first_air_date ? parseInt(tmdbMovie.first_air_date.split("-")[0]) : null),
    maturityRating: null,
    isTrending,
    isFeatured,
    mediaType: tmdbMovie.media_type || (tmdbMovie.first_air_date ? "tv" : "movie"),
    createdAt: new Date(),
  };
};