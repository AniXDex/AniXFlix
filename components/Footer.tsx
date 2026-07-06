"use client";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import React from "react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-white/10 px-8 py-16 text-white bg-[#09090b] relative">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">AniXFlix</h2>
          <p className="text-sm text-white/50 max-w-xl">
            This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
            <Link href="mailto:contact@anixflix.com" className="hover:text-white transition-colors">
              contact@anixflix.com
            </Link>
            <span>&middot;</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>&middot;</span>
            <Link href="/dmca" className="hover:text-white transition-colors">
              DMCA
            </Link>
          </div>
        </div>

        <button 
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
        >
          <ArrowUp size={20} className="text-white/70" />
        </button>
      </div>
    </footer>
  );
}

export default Footer;
