export interface Sport {
  id: number;
  name: string;
  active: boolean;
}

const SPORTS_API_URL = 'https://olympia-2026-api.onrender.com/api/sports';

export const fetchSports = async (): Promise<Sport[]> => {
  try {
    const response = await fetch(SPORTS_API_URL);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch sports data');
  }
};
