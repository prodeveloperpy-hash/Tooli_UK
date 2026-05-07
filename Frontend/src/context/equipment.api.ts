import { API_URL } from '../api-config';

export interface Equipment {
  equipment_id: number;
  name: string;
  description: string;
  organization_name: string;
  is_active: boolean;
  category_id: number;
  organization_id: number;
  images: {
    equipment_image_id: number;
    image_url: string;
    is_active: boolean;
  }[];
  prices: {
    equipment_price_id: number;
    price: string;
    currency: string;
    is_active: boolean;
    interval_id?: number;
  }[];
  availabilities?: {
    equipment_availability_id: number;
    availability_from: string;
    availability_to: string;
    is_active: boolean;
  }[];
  redirect_url?: string;
}

export interface EquipmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Equipment[];
}

export const equipmentApi = {
  getEquipment: async (categoryId?: string, locationId?: string, availabilityFrom?: string, page: number = 1, pageSize: number = 20, organizationId?: string): Promise<EquipmentResponse> => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId);
    if (locationId) params.append('location_id', locationId);
    if (availabilityFrom) params.append('availability_from', availabilityFrom);
    if (organizationId) params.append('organization_id', organizationId);
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());

    const response = await fetch(`${API_URL}/equipment/?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }

    return response.json();
  },

  getEquipmentById: async (id: number): Promise<Equipment> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/equipment/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch equipment details');
    }

    return response.json();
  },

  createEquipment: async (data: any): Promise<Equipment> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/create-equipment/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create equipment');
    }

    return response.json();
  },

  updateEquipment: async (data: any): Promise<Equipment> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/create-equipment/${data.equipment_id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update equipment');
    }

    return response.json();
  },

  deleteEquipment: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/create-equipment/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete equipment');
    }
  },

  deleteEquipmentImage: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/equipment-image/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete equipment image');
    }
  },

  getIntervals: async (): Promise<Interval[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/interval/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch intervals');
    }

    return response.json();
  },

  getCategories: async (): Promise<Category[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/category/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  },

  getLocations: async (): Promise<Location[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/location/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    return response.json();
  },

  createEquipmentFiles: async (payload: any, files: File[]): Promise<Equipment> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/create-equipment/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create equipment');
    }

    return response.json();
  },

  updateEquipmentFiles: async (payload: any, files: File[]): Promise<Equipment> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/create-equipment/${payload.equipment_id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update equipment');
    }

    return response.json();
  },

  createCategory: async (data: any): Promise<Category> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/category/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  updateCategory: async (id: number, data: any): Promise<Category> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/category/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  deleteCategory: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/category/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete category');
  },

  createLocation: async (data: any): Promise<Location> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/location/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create location');
    return response.json();
  },

  updateLocation: async (id: number, data: any): Promise<Location> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/location/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update location');
    return response.json();
  },

  deleteLocation: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/location/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete location');
  },
};

export interface Interval {
  interval_id: number;
  interval_key: string;
  interval_display_name: string;
}

export interface Category {
  category_id: number;
  category_key: string;
  category_display_name: string;
  is_active: boolean;
}

export interface Location {
  location_id: number;
  city_name: string;
  country: string;
  state: string | null;
  is_active: boolean;
}
