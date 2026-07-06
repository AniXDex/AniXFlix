"use client";
import {
  ChevronDown,
  Home,
  Code,
  LayoutGrid,
  Search,
  User,
  Film,
  Tv,
  Wind,
  Signal,
  MonitorPlay,
  PartyPopper,
  History,
  Heart,
  Settings2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import SearchModal from "@/components/SearchModal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="absolute w-full min-h-20 px-4 sm:px-6 md:px-14 top-0 z-50 flex items-center justify-between bg-transparent">
      
      {/* LEFT: Logo */}
      <Link href={"/"} className="flex items-center text-2xl font-bold text-white tracking-tight z-50">
        <img src="/logo.svg" alt="AniXFlix" className="h-6 md:h-8 w-auto ml-0.5" />
      </Link>

      {/* RIGHT: Navigation & Icons */}
      <div className="flex items-center gap-5 text-sm font-medium">
        
        <Link href="/" className={`hidden md:flex items-center gap-2 transition-colors ${pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'}`}>
          <Home size={18} /> Home
        </Link>


        {/* BROWSE MEGA MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors outline-none group border border-red-500/20">
              <LayoutGrid size={18} /> Browse <ChevronDown size={16} className="group-data-[state=open]:rotate-180 transition-transform" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={16}
            className="w-[320px] bg-[#09090b] border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Content</span>
              <div className="grid grid-cols-3 gap-2">
                <Link href="/movies" className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center bg-transparent group-hover:bg-white/5 transition-colors">
                     <Film size={24} className="text-red-500" />
                  </div>
                  <span className="text-[11px] text-white/80 group-hover:text-white font-medium">Movies</span>
                </Link>
                <Link href="/series" className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center bg-transparent group-hover:bg-white/5 transition-colors">
                     <Tv size={24} className="text-red-500" />
                  </div>
                  <span className="text-[11px] text-white/80 group-hover:text-white font-medium">TV Shows</span>
                </Link>
                <Link href="/anime" className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center bg-transparent group-hover:bg-white/5 transition-colors">
                     <Wind size={24} className="text-red-500" />
                  </div>
                  <span className="text-[11px] text-white/80 group-hover:text-white font-medium">Anime</span>
                </Link>
              </div>
            </div>



            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Personal</span>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/history" className="flex flex-col items-center justify-center py-4 border border-white/5 rounded-2xl bg-transparent hover:bg-white/5 transition-colors group gap-2">
                   <History size={20} className="text-white/60 group-hover:text-white" />
                   <span className="text-sm text-white/70 group-hover:text-white font-medium">History</span>
                </Link>
                <Link href="/my-list" className="flex flex-col items-center justify-center py-4 border border-white/5 rounded-2xl bg-transparent hover:bg-white/5 transition-colors group gap-2">
                   <Heart size={20} className="text-white/60 group-hover:text-white" />
                   <span className="text-sm text-white/70 group-hover:text-white font-medium">Watchlist</span>
                </Link>
              </div>
            </div>


          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-[1px] h-6 bg-white/10 hidden md:block mx-1"></div>

        <button onClick={() => setIsSearchOpen(true)} className="text-white hover:text-white/80 transition-colors ml-1">
          <Search size={22} />
        </button>

      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

export default Header;
