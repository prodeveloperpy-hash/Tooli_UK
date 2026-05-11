import { API_URL } from '../api-config';
import { SignupRequest, AuthResponse, LoginRequest } from '../types';

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

    // Add the remaining payload as a JSON string
    formData.append('payload', JSON.stringify(cleanedPayload));

    // Add files if they exist (though SignupRequest currently uses URLs/null, 
    // we should check if SignupPage passes actual File objects in the future)
    // For now, SignupPage doesn't seem to pass File objects for avatar/logo in signupData

    const response = await fetch(`${API_URL}/signup/`, {
      method: 'POST',
      body: formData,
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
