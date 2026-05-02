import { API_URL } from '../api-config';

export interface UserOrganization {
  user_organization_id: number;
  user_details: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    is_active: boolean;
  };
  organization_details: {
    name: string;
    domain: string;
    logo: string | null;
    city: string;
    state: string | null;
    country: string;
    is_active: boolean;
  };
  role_details: {
    role_key: string;
    role_display_name: string;
  };
  user_id: number;
  organization_id: number;
  is_active: boolean;
}

export const userApi = {
  getUserOrganizations: async (): Promise<UserOrganization[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user-organization/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user organizations');
    }

    return response.json();
  },
};
