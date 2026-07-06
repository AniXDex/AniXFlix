import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/types/types';

interface StoreState {
  watchlist: Movie[];
  history: Movie[];
  searchHistory: string[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  addToHistory: (movie: Movie) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  addSearchHistory: (query: string) => void;
  removeSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      history: [],
      searchHistory: [],
      addToWatchlist: (movie) => {
        set((state) => {
          const id = movie.publicId || movie.id?.toString();
          if (state.watchlist.some((m) => (m.publicId || m.id?.toString()) === id)) return state;
          return { watchlist: [movie, ...state.watchlist] };
        });
      },
      removeFromWatchlist: (id) => {
        set((state) => ({
          watchlist: state.watchlist.filter((m) => (m.publicId || m.id?.toString()) !== id),
        }));
      },
      isInWatchlist: (id) => {
        return get().watchlist.some((m) => (m.publicId || m.id?.toString()) === id);
      },
      addToHistory: (movie) => {
        set((state) => {
          const id = movie.publicId || movie.id?.toString();
          const filtered = state.history.filter((m) => (m.publicId || m.id?.toString()) !== id);
          return { history: [movie, ...filtered].slice(0, 50) };
        });
      },
      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((m) => (m.publicId || m.id?.toString()) !== id),
        }));
      },
      clearHistory: () => {
        set({ history: [] });
      },
      addSearchHistory: (query) => {
        set((state) => {
          const filtered = state.searchHistory.filter((q) => q.toLowerCase() !== query.toLowerCase());
          return { searchHistory: [query, ...filtered].slice(0, 10) };
        });
      },
      removeSearchHistory: (query) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
        }));
      },
      clearSearchHistory: () => {
        set({ searchHistory: [] });
      }
    }),
    {
      name: 'anixflix-storage',
    }
  )
);
