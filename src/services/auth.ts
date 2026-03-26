export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: 'ADMIN' | 'REFEREE';
}

export interface ApiUser {
  active: boolean;
  id: number;
  name: string;
  role: 'ADMIN' | 'REFEREE';
  username: string;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'REFEREE';
}

const AUTH_API_URL = 'https://olympia-2026-api.onrender.com/api/auth/login';
const USERS_API_URL = 'https://olympia-2026-api.onrender.com/api/users';

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

export const fetchAllUsers = async (): Promise<ApiUser[]> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(USERS_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data: ApiUser[] = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to fetch users');
  }
};

export const createUser = async (userData: CreateUserRequest): Promise<ApiUser> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(USERS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status}`);
    }

    const data: ApiUser = await response.json();
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to create user');
  }
};

export const deactivateUser = async (userId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${USERS_API_URL}/${userId}/deactivate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to deactivate user: ${response.status}`);
    }
  } catch (err) {
    throw err instanceof Error ? err : new Error('Failed to deactivate user');
  }
};
