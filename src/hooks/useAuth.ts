import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth';
import type { LoginCredentials } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, logout: storeLogout } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.access_token);
      const user = await authService.getProfile();
      setUser(user);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const logout = () => {
    storeLogout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return {
    login,
    logout,
  };
}