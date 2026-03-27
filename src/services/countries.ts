export interface CountryOption {
  id: number
  name: string
  code?: string
  active?: boolean
}

const COUNTRIES_API_URL = 'https://olympia-2026-api.onrender.com/api/countries'

export const fetchAllCountries = async (): Promise<CountryOption[]> => {
  try {
    const response = await fetch(COUNTRIES_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.content || []
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch countries')
  }
}