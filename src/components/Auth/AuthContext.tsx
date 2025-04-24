
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading, error, login, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect based on authentication status
  useEffect(() => {
    // Skip redirect during initial loading
    if (isLoading) return;

    const path = location.pathname;
    
    // If user is authenticated and on login page, redirect to dashboard
    if (isAuthenticated && path === '/login') {
      navigate('/dashboard');
      return;
    }
    
    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated && path !== '/login' && path !== '/') {
      navigate('/login');
      return;
    }
    
    // If on root path, redirect appropriately
    if (path === '/') {
      navigate(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
