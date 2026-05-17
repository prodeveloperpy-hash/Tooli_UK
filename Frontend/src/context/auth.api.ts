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

    // Extract files if they exist
    const avatarFile = (cleanedPayload as any).avatarFile;
    const logoFile = (cleanedPayload as any).logoFile;
    delete (cleanedPayload as any).avatarFile;
    delete (cleanedPayload as any).logoFile;

    // Set standard URL keys to null in JSON payload
    (cleanedPayload as any).avatar_url = null;
    (cleanedPayload as any).organization_logo = null;

    // Add the remaining payload as a JSON string
    formData.append('payload', JSON.stringify(cleanedPayload));

    // Add files if they exist
    if (avatarFile) {
      formData.append('avatar_url', avatarFile);
    }
    if (logoFile) {
      formData.append('organization_logo', logoFile);
    }

    const response = await fetch(`${API_URL}/signup/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = typeof errorData === 'object' 
        ? Object.values(errorData).flat().join(', ') 
        : 'Signup failed';
      throw new Error(errorMsg || 'Signup failed');
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
      const errorMsg = typeof errorData === 'object' 
        ? Object.values(errorData).flat().join(', ') 
        : 'Login failed';
      throw new Error(errorMsg || 'Login failed');
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
