export interface Sport {
  id: number;
  name: string;
  active: boolean;
}

export type SportTranslationKey =
  | 'biathlon'
  | 'bobsport'
  | 'curling'
  | 'eishockey'
  | 'eiskunstlauf'
  | 'skilanglauf'
  | 'skispringen';

const sportIdToKey: Record<number, SportTranslationKey> = {
  1: 'biathlon',
  2: 'bobsport',
  3: 'curling',
  4: 'eishockey',
  5: 'eiskunstlauf',
  6: 'skilanglauf',
  7: 'skispringen',
};

const sportNameToKey: Record<string, SportTranslationKey> = {
  biathlon: 'biathlon',
  bobsport: 'bobsport',
  bob: 'bobsport',
  curling: 'curling',
  eishockey: 'eishockey',
  icehockey: 'eishockey',
  eiskunstlauf: 'eiskunstlauf',
  figureskating: 'eiskunstlauf',
  skilanglauf: 'skilanglauf',
  crosscountryskiing: 'skilanglauf',
  skispringen: 'skispringen',
  skijumping: 'skispringen',
};

const normalizeSportName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

type SportReference = Pick<Partial<Sport>, 'id' | 'name'>;

export const getSportTranslationKey = (sport: SportReference | string | number | null | undefined): SportTranslationKey | null => {
  if (sport == null) {
    return null;
  }

  if (typeof sport === 'number') {
    return sportIdToKey[sport] ?? null;
  }

  if (typeof sport === 'string') {
    return sportNameToKey[normalizeSportName(sport)] ?? null;
  }

  if (typeof sport.id === 'number' && sportIdToKey[sport.id]) {
    return sportIdToKey[sport.id];
  }

  if (typeof sport.name === 'string') {
    return sportNameToKey[normalizeSportName(sport.name)] ?? null;
  }

  return null;
};

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
