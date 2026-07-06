import MyPlayer from "@/components/player";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import cloudinary from "@/lib/cloudinary";

interface Props {
  params: Promise<{ movieId: string }>;
}

const SIGNED_URL_TTL = 4 * 60 * 60; // 4 hours in seconds
const THUMBNAIL_INTERVAL = 2; // seconds

async function Page({ params }: Props) {
  const { movieId } = await params;

  const movie = await prisma.movie.findUnique({
    where: {
      publicId: movieId,
    },
  });

  if (!movie || !movie.videoUrl) notFound();

  const expiresAt = Math.floor(Date.now() / 1000) + SIGNED_URL_TTL;

  const src = movie.cloudinaryId
    ? cloudinary.url(movie.cloudinaryId, {
        resource_type: "video",
        type: "authenticated",
        sign_url: true,
        expires_at: expiresAt,
      })
    : movie.videoUrl;

  const thumbnails = movie.duration
    ? Array.from(
        { length: Math.ceil(movie.duration / THUMBNAIL_INTERVAL) },
        (_, i) => {
          const t = i * THUMBNAIL_INTERVAL;

          const url = movie.cloudinaryId
            ? cloudinary.url(movie.cloudinaryId, {
                resource_type: "video",
                type: "authenticated",
                sign_url: true,
                expires_at: expiresAt,
                raw_transformation: `w_160,h_90,so_${t}`,
                format: "jpg",
              })
            : (() => {
                const base = movie.videoUrl!.replace(
                  "/upload/",
                  `/upload/w_160,h_90,so_${t}/`,
                );

                return base.slice(0, base.lastIndexOf(".")) + ".jpg";
              })();

          return { url, startTime: t, endTime: t + THUMBNAIL_INTERVAL };
        },
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <MyPlayer src={src} title={movie.title} thumbnails={thumbnails} tmdbId={movie.publicId} />
    </div>
  );
}

export default Page;
