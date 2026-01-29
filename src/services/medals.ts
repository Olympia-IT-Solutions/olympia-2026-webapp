export interface CountryMedalData {
  country: string;
  bronze: number;
  silver: number;
  gold: number;
  total?: number;
}

export interface Medal {
  athleteId: number;
  athleteName: string;
  medalType: 'GOLD' | 'SILVER' | 'BRONZE';
  sportName: string;
}

const MEDALS_TABLE_API_URL = 'https://olympia-2026-api.onrender.com/api/medals/table';
const MEDALS_BY_COUNTRY_API_URL = 'https://olympia-2026-api.onrender.com/api/medals/by-country';

export const fetchMedalsTable = async (): Promise<CountryMedalData[]> => {
  try {
    const response = await fetch(MEDALS_TABLE_API_URL);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch medal data');
  }
};

export const fetchMedalsByCountry = async (country: string): Promise<Medal[]> => {
  try {
    const response = await fetch(`${MEDALS_BY_COUNTRY_API_URL}/${country}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch medals by country');
  }
};
