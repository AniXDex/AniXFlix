import MyPlayer from "@/components/player";
import { tmdb } from "@/lib/tmdb";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ movieId: string }>;
}

async function Page({ params }: Props) {
  const { movieId } = await params;

  // Try fetching as movie
  let tmdbData = await tmdb.getDetails("movie", movieId);
  
  // If not found, try as TV show
  if (!tmdbData || tmdbData.success === false) {
    tmdbData = await tmdb.getDetails("tv", movieId);
  }

  if (!tmdbData || tmdbData.success === false) {
    notFound();
  }

  const title = tmdbData.title || tmdbData.name || "Unknown Title";

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <MyPlayer src={""} title={title} thumbnails={[]} tmdbId={movieId} />
    </div>
  );
}

export default Page;
