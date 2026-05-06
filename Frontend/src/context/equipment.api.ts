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
}

export interface EquipmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Equipment[];
}

export const equipmentApi = {
  getEquipment: async (categoryId?: string, locationId?: string, availabilityFrom?: string, page: number = 1): Promise<EquipmentResponse> => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId);
    if (locationId) params.append('location_id', locationId);
    if (availabilityFrom) params.append('availability_from', availabilityFrom);
    params.append('page', page.toString());

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

  updateEquipment: async (id: number, data: any): Promise<Equipment> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/create-equipment/${id}/`, {
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

  updateEquipmentFiles: async (id: number, payload: any, files: File[]): Promise<Equipment> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/create-equipment/${id}/`, {
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
