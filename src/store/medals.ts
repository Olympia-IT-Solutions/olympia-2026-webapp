import { create } from 'zustand';
import type { Medal } from '../services/medals';
import { fetchMedalsByCountry } from '../services/medals';

let activeMedalsRequestId = 0;

interface MedalStore {
  medals: Record<string, Medal[]>;
  loading: boolean;
  error: string | null;
  fetchMedals: (country: string) => Promise<void>;
  setMedals: (country: string, medals: Medal[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMedalStore = create<MedalStore>((set) => ({
  medals: {},
  loading: false,
  error: null,
  
  setMedals: (country, medals) => set((state) => ({
    medals: { ...state.medals, [country]: medals }
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  fetchMedals: async (country: string) => {
    const requestId = ++activeMedalsRequestId;
    set({ loading: true, error: null });
    try {
      const data = await fetchMedalsByCountry(country);
      if (requestId !== activeMedalsRequestId) {
        return;
      }

      set((state) => ({
        medals: { ...state.medals, [country]: data },
        loading: false,
        error: null
      }));
    } catch (err) {
      if (requestId !== activeMedalsRequestId) {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch medals';
      set({ error: errorMessage, loading: false });
      console.error('Error fetching medals:', err);
    }
  },
}));
