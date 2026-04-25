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
