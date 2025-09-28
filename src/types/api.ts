// Product Types
export interface Product {
  productId: number;
  name: string;
  description?: string;
  brand?: string;
  price: number;
  withDiscount: boolean;
  discountPrice?: number;
  sku: string;
  isVisible: boolean;
  productStatus: ProductStatus;
  imageUrl?: string;
  category: ProductCategory;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductWithStock {
  productId: number;
  name: string;
  description?: string;
  brand?: string;
  price: number;
  withDiscount: boolean;
  discountPrice?: number;
  sku: string;
  isVisible: boolean;
  productStatus: ProductStatus;
  imageUrl?: string;
  category: ProductCategory;
  createdAt: string;
  updatedAt?: string;
  stockQuantity?: number;
}

export interface ProductRequest {
  name: string;
  description?: string;
  brand?: string;
  price: number;
  withDiscount: boolean;
  discountPrice?: number;
  sku: string;
  isVisible: boolean;
  productStatus: ProductStatus;
  imageUrl?: string;
  category: string;
  initialStock?: number;
}

export const ProductStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISCONTINUED: 'DISCONTINUED'
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

// Category Types
export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

// Pagination
export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}