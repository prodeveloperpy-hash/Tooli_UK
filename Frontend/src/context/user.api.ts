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
  is_approved: boolean;
  approved_datetime: string | null;
  approved_by: number | null;
}

export const userApi = {
  getUser: async (id: number): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },

  getUserOrganizations: async (isActive?: boolean, isApproved?: boolean): Promise<UserOrganization[]> => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (isActive !== undefined) params.append('is_active', isActive.toString());
    if (isApproved !== undefined) params.append('is_approved', isApproved.toString());

    const url = `${API_URL}/user-organization/${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user organizations');
    }

    return response.json();
  },

  getUserOrganizationById: async (id: number): Promise<UserOrganization> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user-organization/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user organization details');
    }

    return response.json();
  },

  createUserOrganization: async (data: any): Promise<UserOrganization> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user-organization/`, {
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
    const response = await fetch(`${API_URL}/user-organization/${id}/`, {
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
    const response = await fetch(`${API_URL}/user-organization/${id}/`, {
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

    // Pull out specific fields from payload and append them directly to formData
    const topLevelFields = ['is_approved', 'is_active', 'approved_by', 'approved_datetime'];
    const cleanedPayload = { ...payload };

    topLevelFields.forEach(field => {
      if (cleanedPayload[field] !== undefined) {
        formData.append(field, String(cleanedPayload[field]));
        delete cleanedPayload[field];
      }
    });

    // Add the remaining payload as a JSON string
    formData.append('payload', JSON.stringify(cleanedPayload));

    // Add files if they exist
    if (avatar) formData.append('avatar', avatar);
    if (logo) formData.append('organization_logo', logo);

    const response = await fetch(`${API_URL}/user-organization/`, {
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

    // Pull out specific fields from payload and append them directly to formData
    const topLevelFields = ['is_approved', 'is_active', 'approved_by', 'approved_datetime'];
    const cleanedPayload = { ...payload };

    topLevelFields.forEach(field => {
      if (cleanedPayload[field] !== undefined) {
        formData.append(field, String(cleanedPayload[field]));
        delete cleanedPayload[field];
      }
    });

    // Add the remaining payload as a JSON string
    formData.append('payload', JSON.stringify(cleanedPayload));

    // Add files if they exist
    if (avatar) formData.append('avatar', avatar);
    if (logo) formData.append('organization_logo', logo);

    const response = await fetch(`${API_URL}/user-organization/${id}/`, {
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

  getUsersByRole: async (roleId: number): Promise<UserOrganization[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/?role_id=${roleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users by role');
    }

    return response.json();
  },

  createUser: async (payload: any, avatar?: File): Promise<any> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Flatten fields for FormData
    formData.append('first_name', payload.first_name);
    formData.append('last_name', payload.last_name);
    formData.append('email', payload.email);
    formData.append('password', payload.password);
    formData.append('role_id', '7');
    if (payload.is_active !== undefined) formData.append('is_active', String(payload.is_active));
    
    if (avatar) formData.append('avatar', avatar);

    const response = await fetch(`${API_URL}/user/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Handle the nested error structure
      const errorMsg = typeof errorData === 'object' ? Object.values(errorData).flat().join(', ') : 'Failed to create user';
      throw new Error(errorMsg || 'Failed to create user');
    }
    return response.json();
  },

  updateUser: async (id: number, payload: any, avatar?: File): Promise<any> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append only provided fields
    if (payload.first_name) formData.append('first_name', payload.first_name);
    if (payload.last_name) formData.append('last_name', payload.last_name);
    if (payload.email) formData.append('email', payload.email);
    if (payload.password) formData.append('password', payload.password);
    if (payload.is_active !== undefined) formData.append('is_active', String(payload.is_active));
    
    if (avatar) formData.append('avatar', avatar);

    const response = await fetch(`${API_URL}/user/${id}/`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = typeof errorData === 'object' ? Object.values(errorData).flat().join(', ') : 'Failed to update user';
      throw new Error(errorMsg || 'Failed to update user');
    }
    return response.json();
  },

  deleteUser: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },
};
