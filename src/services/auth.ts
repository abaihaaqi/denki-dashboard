import api from "../lib/axios";
import { LoginCredentials, RegisterCredentials, User } from "../types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async logout() {
    const response = await api.get("/auth/logout");
    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },
};
