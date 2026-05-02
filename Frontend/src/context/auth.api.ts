import { API_URL } from '../api-config';
import { SignupRequest, AuthResponse, LoginRequest } from '../types';

export const authApi = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Signup failed');
    }

    return response.json();
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
  },
  
  logout: async (): Promise<void> => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};
