import MyPlayer from "@/components/player";
import { tmdb } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import HistoryTracker from "@/components/HistoryTracker";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";

interface Props {
  params: Promise<{ movieId: string }>;
  searchParams: Promise<{ type?: string }>;
}

async function Page({ params, searchParams }: Props) {
  const { movieId } = await params;
  const { type } = await searchParams;

  let isTv = type === "tv";
  let tmdbData = null;

  if (type === "tv") {
    tmdbData = await tmdb.getDetails("tv", movieId);
  } else if (type === "movie") {
    tmdbData = await tmdb.getDetails("movie", movieId);
  } else {
    // Fallback if no type provided
    tmdbData = await tmdb.getDetails("movie", movieId);
    if (!tmdbData || tmdbData.success === false) {
      tmdbData = await tmdb.getDetails("tv", movieId);
      isTv = true;
    }
  }

  if (!tmdbData || tmdbData.success === false) {
    notFound();
  }

  const title = tmdbData.title || tmdbData.name || "Unknown Title";
  const mappedMovie = mapTmdbToAnix(tmdbData);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <HistoryTracker movie={mappedMovie} />
      <MyPlayer src={""} title={title} thumbnails={[]} tmdbId={movieId} mediaType={isTv ? "tv" : "movie"} />
    </div>
  );
}

export default Page;
