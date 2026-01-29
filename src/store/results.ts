import { create } from 'zustand';
import type { Result } from '../services/results';
import { fetchResultsBySport } from '../services/results';

interface ResultsStore {
  results: Record<number, Result[]>;
  loading: boolean;
  error: string | null;
  fetchResults: (sportId: number) => Promise<void>;
  setResults: (sportId: number, results: Result[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResultsStore = create<ResultsStore>((set) => ({
  results: {},
  loading: false,
  error: null,
  
  setResults: (sportId, results) => set((state) => ({
    results: { ...state.results, [sportId]: results }
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  fetchResults: async (sportId: number) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchResultsBySport(sportId);
      set((state) => ({
        results: { ...state.results, [sportId]: data },
        loading: false
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch results';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching results:', err);
    }
  },
}));
