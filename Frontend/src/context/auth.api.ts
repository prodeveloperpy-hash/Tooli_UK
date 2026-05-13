import { API_URL } from '../api-config';
import { SignupRequest, AuthResponse, LoginRequest } from '../types';

function parseApiError(errorData: unknown, fallback: string): string {
  if (!errorData || typeof errorData !== 'object') return fallback;
  const entries = Object.entries(errorData as Record<string, unknown>);
  if (entries.length === 0) return fallback;

  const messages: string[] = [];
  for (const [key, value] of entries) {
    const vals = Array.isArray(value) ? value : [value];
    const text = vals.filter(Boolean).join(', ');
    if (!text) continue;
    if (key === 'non_field_errors' || key === 'detail') {
      messages.push(text);
    } else {
      messages.push(`${key}: ${text}`);
    }
  }
  return messages.join(' | ') || fallback;
}

function isNetworkError(err: unknown): boolean {
  if (!(err instanceof TypeError)) return false;
  const msg = (err as TypeError).message.toLowerCase();
  return msg.includes('failed to fetch') || msg.includes('load failed') || msg.includes('networkerror');
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    const topLevelFields = ['is_approved', 'is_active', 'organization_is_active'];
    const cleanedPayload = { ...data };

    topLevelFields.forEach(field => {
      if ((cleanedPayload as any)[field] !== undefined) {
        formData.append(field, String((cleanedPayload as any)[field]));
        delete (cleanedPayload as any)[field];
      }
    });

    formData.append('payload', JSON.stringify(cleanedPayload));

    let response: Response;
    try {
      response = await fetch(`${API_URL}/signup/`, {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      if (isNetworkError(err)) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      throw err;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(parseApiError(errorData, 'Signup failed. Please try again.'));
    }

    return response.json();
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    let response: Response;
    try {
      response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      if (isNetworkError(err)) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      throw err;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(parseApiError(errorData, 'Login failed. Please try again.'));
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
