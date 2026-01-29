export interface Result {
  athleteId: number;
  athleteName: string;
  country: string;
  hasMedal: boolean;
  id: number;
  medalType: 'GOLD' | 'SILVER' | 'BRONZE' | null;
  sportId: number;
  sportName: string;
  status: string;
  value: string;
}

export interface ResultResponse {
  content: Result[];
}

const RESULTS_API_URL = 'https://olympia-2026-api.onrender.com/api/results/by-sport';

export const fetchResultsBySport = async (sportId: number): Promise<Result[]> => {
  try {
    const response = await fetch(`${RESULTS_API_URL}/${sportId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ResultResponse = await response.json();
    return data.content || [];
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch results');
  }
};
