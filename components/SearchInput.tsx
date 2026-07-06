"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies, tv shows, or actors..."
        className="bg-black/50 border border-white/20 text-white px-4 py-3 w-full md:w-1/2 rounded-md focus:outline-none focus:border-white/50 text-lg"
        autoFocus
      />
      <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold text-lg">
        Search
      </button>
    </form>
  );
}