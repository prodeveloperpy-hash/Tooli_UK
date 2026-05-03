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
  }[];
}

export interface EquipmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Equipment[];
}

export const equipmentApi = {
  getEquipment: async (): Promise<EquipmentResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/equipment/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }

    return response.json();
  },
};
