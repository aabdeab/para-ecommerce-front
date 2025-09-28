import { apiClient } from './apiClient';
import type { 
  Product, 
  ProductWithStock, 
  ProductRequest, 
  ProductCategory, 
  CreateCategoryRequest, 
  PageResponse, 
  PageRequest
} from '../types/api';

class ProductAPI {
  // Product endpoints
  async getAllProducts(params?: PageRequest): Promise<PageResponse<Product>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sort) searchParams.append('sort', params.sort);
    
    const query = searchParams.toString();
    const url = `/api/products${query ? `?${query}` : ''}`;
    
    return apiClient.get<PageResponse<Product>>(url);
  }

  async getProduct(id: number): Promise<ProductWithStock> {
    return apiClient.get<ProductWithStock>(`/api/products/${id}`);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return apiClient.get<Product[]>(`/api/products/category/${categoryId}`);
  }

  async createProduct(product: ProductRequest): Promise<ProductWithStock> {
    return apiClient.post<ProductWithStock>('/api/products', product);
  }

  async updateProduct(id: number, product: ProductRequest): Promise<Product> {
    return apiClient.put<Product>(`/api/products/${id}`, product);
  }

  async deleteProduct(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/products/${id}`);
  }

  async hardDeleteProduct(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/products/${id}/permanent`);
  }
}

class CategoryAPI {
  async getAllCategories(): Promise<ProductCategory[]> {
    return apiClient.get<ProductCategory[]>('/api/categories');
  }

  async getCategory(id: number): Promise<ProductCategory> {
    return apiClient.get<ProductCategory>(`/api/categories/${id}`);
  }

  async createCategory(category: CreateCategoryRequest): Promise<ProductCategory> {
    return apiClient.post<ProductCategory>('/api/categories', category);
  }

  async updateCategory(id: number, category: CreateCategoryRequest): Promise<ProductCategory> {
    return apiClient.put<ProductCategory>(`/api/categories/${id}`, category);
  }

  async deleteCategory(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/categories/${id}`);
  }
}

export const productAPI = new ProductAPI();
export const categoryAPI = new CategoryAPI();