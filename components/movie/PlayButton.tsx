"use client";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { PLAYBACK_KEY, PlaybackData } from "@/lib/playback";

export default function PlayButton({ data }: { data: PlaybackData }) {
  const router = useRouter();

  const handlePlay = () => {
    sessionStorage.setItem(PLAYBACK_KEY, JSON.stringify(data));
    router.push("/play");
  };

  return (
    <button
      onClick={handlePlay}
      className="bg-white hover:bg-white/90 text-black px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105"
    >
      <Play size={18} fill="black" /> Play
    </button>
  );
}
