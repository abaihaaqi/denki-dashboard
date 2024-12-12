import api from '../lib/axios';
import { Product } from '../types/product';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  async getProduct(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await api.post('/products', product);
    return response.data;
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};