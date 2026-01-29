import { create } from 'zustand';
import type { Sport } from '../services/sports';
import { fetchSports } from '../services/sports';

interface SportsStore {
  sports: Sport[];
  loading: boolean;
  error: string | null;
  initializeSports: () => Promise<void>;
  setSports: (sports: Sport[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSportsStore = create<SportsStore>((set) => ({
  sports: [],
  loading: false,
  error: null,
  
  setSports: (sports) => set({ sports }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  initializeSports: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchSports();
      set({ sports: data, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sports';
      set({ error: errorMessage, loading: false });
      console.error('Error initializing sports store:', err);
    }
  },
}));
