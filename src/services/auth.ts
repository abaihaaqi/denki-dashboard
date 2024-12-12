import api from '../lib/axios';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await api.post('/users', credentials);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};