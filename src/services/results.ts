export interface Result {
  athleteId: number;
  athleteName: string;
  approvedById?: number | null;
  approvedByUsername?: string | null;
  country?: string;
  countryCode?: string;
  countryId?: number;
  countryName?: string;
  createdById?: number | null;
  createdByUsername?: string | null;
  hasMedal: boolean;
  id: number;
  medalType: 'GOLD' | 'SILVER' | 'BRONZE' | null;
  rank?: number;
  sportId: number;
  sportName: string;
  status: 'APPROVED' | 'PENDING' | 'PUBLISHED' | string;
  value: string;
}

export interface ResultResponse {
  content: Result[];
}

export interface CreateResultRequest {
  athleteId: number;
  sportId: number;
  value: string;
  rank: number;
}

export interface UpdateResultRequest {
  value: string;
  rank: number;
}

const RESULTS_API_URL = 'https://olympia-2026-api.onrender.com/api/results/by-sport';
const RESULTS_CREATE_API_URL = 'https://olympia-2026-api.onrender.com/api/results';
const RESULTS_ACTIONS_API_URL = 'https://olympia-2026-api.onrender.com/api/results';
const AUTH_TOKEN_KEY = 'authToken';

type ResultAction = 'approve' | 'reject' | 'invalidate';

const buildAuthHeaders = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
};

const sendResultAction = async (resultId: number, action: ResultAction): Promise<void> => {
  const response = await fetch(`${RESULTS_ACTIONS_API_URL}/${resultId}/${action}`, {
    method: 'POST',
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
};

export const createResult = async (payload: CreateResultRequest): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(RESULTS_CREATE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to create result');
  }
}

export const fetchResultsBySport = async (sportId: number): Promise<Result[]> => {
  try {
    const response = await fetch(`${RESULTS_API_URL}/${sportId}`, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ResultResponse = await response.json();
    return data.content || [];
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch results');
  }
};

export const approveResult = async (resultId: number): Promise<void> => {
  try {
    await sendResultAction(resultId, 'approve')
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to approve result')
  }
}

export const rejectResult = async (resultId: number): Promise<void> => {
  try {
    await sendResultAction(resultId, 'reject')
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to reject result')
  }
}

export const invalidateResult = async (resultId: number): Promise<void> => {
  try {
    await sendResultAction(resultId, 'invalidate')
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to invalidate result')
  }
}

export const updateResult = async (resultId: number, payload: UpdateResultRequest): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      throw new Error('No auth token found')
    }

    const response = await fetch(`${RESULTS_ACTIONS_API_URL}/${resultId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to update result')
  }
}
