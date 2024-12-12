import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function Layout() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold">ProductHub</span>
              </Link>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}