import MyPlayer from "@/components/player";
import { tmdb } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import HistoryTracker from "@/components/HistoryTracker";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";

interface Props {
  params: Promise<{ movieId: string }>;
  searchParams: Promise<{ type?: string, season?: string, episode?: string }>;
}

async function Page({ params, searchParams }: Props) {
  const { movieId } = await params;
  const { type, season, episode } = await searchParams;

  const s = season ? parseInt(season, 10) : 1;
  const e = episode ? parseInt(episode, 10) : 1;

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
      <MyPlayer src={""} title={title} thumbnails={[]} tmdbId={movieId} mediaType={isTv ? "tv" : "movie"} season={s} episode={e} />
    </div>
  );
}

export default Page;
