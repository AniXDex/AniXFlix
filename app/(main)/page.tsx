import HomeClient from "./HomeClient";
import { tmdb } from "@/lib/tmdb";
import { mapTmdbToAnix } from "@/lib/mapTmdbToAnix";

// Next.js config to revalidate homepage data every hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch multiple rows in parallel for speed
  const [
    trendingData,
    topRatedData,
    actionData,
    comedyData,
    animationData,
  ] = await Promise.all([
    tmdb.getTrending("all"),
    tmdb.getTopRated("movie"),
    tmdb.getDiscover("movie", { genreId: "28" }), // Action genre ID
    tmdb.getDiscover("movie", { genreId: "35" }), // Comedy genre ID
    tmdb.getDiscover("movie", { genreId: "878" }), // Sci-Fi genre ID
  ]);

  // Map to AniXFlix internal format
  const trending = trendingData.slice(0, 20).map((m) => mapTmdbToAnix(m, true, true));
  const topRated = topRatedData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  const action = actionData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  const comedy = comedyData.slice(0, 20).map((m) => mapTmdbToAnix(m));
  const animation = animationData.slice(0, 20).map((m) => mapTmdbToAnix(m));

  return (
    <HomeClient 
      trending={trending}
      topRated={topRated}
      action={action}
      comedy={comedy}
      animation={animation}
    />
  );
}
