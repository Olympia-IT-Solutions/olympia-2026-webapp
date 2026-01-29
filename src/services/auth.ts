export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
}

const AUTH_API_URL = 'https://olympia-2026-api.onrender.com/api/auth/login';

export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Login failed');
  }
};
