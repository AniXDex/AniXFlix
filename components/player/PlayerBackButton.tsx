"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PlayerBackButton() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsVisible(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    timeout = setTimeout(() => setIsVisible(false), 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <button 
      onClick={() => router.back()}
      className={`absolute top-24 left-4 md:top-28 md:left-8 z-[60] bg-black/60 hover:bg-[#ff9d00] text-white hover:text-black backdrop-blur-md p-3 md:px-5 md:py-2.5 rounded-full font-bold flex items-center gap-2 transition-all duration-300 shadow-xl border border-white/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
    >
      <ArrowLeft size={20} />
      <span className="hidden md:inline">Back</span>
    </button>
  );
}
