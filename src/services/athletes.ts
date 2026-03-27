export interface Athlete {
  id: number
  name: string
  countryId?: number
  countryCode?: string
  countryName?: string
  sportId?: number
  sportName?: string
  active?: boolean
}

const ATHLETES_API_URL = 'https://olympia-2026-api.onrender.com/api/athletes'
const AUTH_TOKEN_KEY = 'authToken'

const buildAuthHeaders = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  }
}

export const fetchAllAthletes = async (): Promise<Athlete[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    const response = await fetch(ATHLETES_API_URL, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.content || []
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch athletes')
  }
}

export interface CreateAthleteRequest {
  name: string
  sportId: number
  countryId: number
}

export const createAthlete = async (payload: CreateAthleteRequest): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    if (!token) {
      throw new Error('No auth token found')
    }

    const response = await fetch(ATHLETES_API_URL, {
      method: 'POST',
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
    throw err instanceof Error ? err : new Error('Failed to create athlete')
  }
}

export interface UpdateAthleteRequest {
  id: number
  name: string
  sportId: number
  countryId: number
}

export const updateAthlete = async (payload: UpdateAthleteRequest): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    if (!token) {
      throw new Error('No auth token found')
    }

    const response = await fetch(`${ATHLETES_API_URL}/${payload.id}`, {
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
    throw err instanceof Error ? err : new Error('Failed to update athlete')
  }
}

const sendAthleteStatusAction = async (athleteId: number, action: 'activate' | 'deactivate'): Promise<void> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (!token) {
    throw new Error('No auth token found')
  }

  const response = await fetch(`${ATHLETES_API_URL}/${athleteId}/${action}`, {
    method: 'POST',
    headers: buildAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
}

export const activateAthlete = async (athleteId: number): Promise<void> => {
  try {
    await sendAthleteStatusAction(athleteId, 'activate')
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to activate athlete')
  }
}

export const deactivateAthlete = async (athleteId: number): Promise<void> => {
  try {
    await sendAthleteStatusAction(athleteId, 'deactivate')
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to deactivate athlete')
  }
}