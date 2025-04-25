
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

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
  const { user, isAuthenticated, isLoading, error, login: storeLogin, logout: storeLogout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);

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

  const login = async (email: string, password: string) => {
    setLoginError(null);
    try {
      await storeLogin(email, password);
      
      // Check if authentication was successful
      if (useAuthStore.getState().isAuthenticated) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${useAuthStore.getState().user?.name || 'user'}!`,
        });
      } else if (useAuthStore.getState().error) {
        setLoginError(useAuthStore.getState().error);
        toast({
          title: "Login failed",
          description: useAuthStore.getState().error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setLoginError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const logout = () => {
    storeLogout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error: loginError || error,
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
