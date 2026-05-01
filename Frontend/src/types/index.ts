export interface Supplier {
  id: string;
  name: string;
  logo?: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  yearEstablished: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  specifications: Record<string, string>;
  supplierId: string;
}

export interface Pricing {
  id: string;
  productId: string;
  supplierId: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  deliveryFee: number;
  location: string;
  available: boolean;
}

export interface SearchResult {
  id: string;
  productName: string;
  productImage: string;
  category: string;
  weeklyPrice: number;
  dailyPrice: number;
  supplierName: string;
  supplierLocation: string;
  supplierRating: number;
  supplierId: string;
  productId: string;
  verified: boolean;
  deliveryFee: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supplier' | 'customer';
  supplierId?: string;
  createdAt: Date;
}

export type EquipmentCategory =
  | 'Mini Diggers'
  | 'Excavators'
  | 'Dumpers'
  | 'Generators'
  | 'Scaffolding'
  | 'Telehandlers'
  | 'Rollers'
  | 'Compressors';

export interface SearchFilters {
  equipmentType?: string;
  city?: string;
  hireDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  verified?: boolean;
  categories?: string[];
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar_url: string | null;
  is_active: boolean;
  organization_name: string;
  organization_domain: string;
  organization_logo: string | null;
  organization_address1: string;
  organization_address2: string;
  organization_city: string;
  organization_state: string;
  organization_postal_code: string;
  organization_country: string;
  organization_is_active: boolean;
  user_organization_role_id: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token?: string;
  token_type?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
