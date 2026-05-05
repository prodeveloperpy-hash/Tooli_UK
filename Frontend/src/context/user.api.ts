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
  getUser: async (id: number): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}user/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },

  getUserOrganizations: async (): Promise<UserOrganization[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}user-organization/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user organizations');
    }

    return response.json();
  },

  createUserOrganization: async (data: any): Promise<UserOrganization> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}user-organization/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        role_key: 'SUPPLIER',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create supplier');
    }

    return response.json();
  },

  updateUserOrganization: async (id: number, data: any): Promise<UserOrganization> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}user-organization/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update supplier');
    }

    return response.json();
  },

  deleteUserOrganization: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}user-organization/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete supplier');
    }
  },

  createUserOrganizationFiles: async (payload: any, avatar?: File, logo?: File): Promise<UserOrganization> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Add the payload as a JSON string
    formData.append('payload', JSON.stringify(payload));
    
    // Add files if they exist
    if (avatar) formData.append('avatar', avatar);
    if (logo) formData.append('organization_logo', logo);

    const response = await fetch(`${API_URL}user-organization/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create user/organization files');
    }

    return response.json();
  },

  updateUserOrganizationFiles: async (id: number, payload: any, avatar?: File, logo?: File): Promise<UserOrganization> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Add the payload as a JSON string
    formData.append('payload', JSON.stringify(payload));
    
    // Add files if they exist
    if (avatar) formData.append('avatar', avatar);
    if (logo) formData.append('organization_logo', logo);

    const response = await fetch(`${API_URL}user-organization/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Browser will automatically set multipart/form-data and the boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update user/organization files');
    }

    return response.json();
  },
};
