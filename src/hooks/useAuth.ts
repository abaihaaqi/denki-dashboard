import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/auth";
import type { LoginCredentials, RegisterCredentials } from "../types/auth";

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, logout: storeLogout } = useAuthStore();

  const register = async (credentials: RegisterCredentials) => {
    try {
      const res = await authService.register(credentials);
      console.log(res);
      toast.success("You can login now!");
      navigate("/login");
    } catch (error) {
      toast.error("Internal server error");
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const user = await authService.login(credentials);
      setUser(user);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid credentials");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await authService.logout();
      console.log(response);
      storeLogout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Internal server error");
      throw error;
    }
  };

  return {
    register,
    login,
    logout,
  };
}
