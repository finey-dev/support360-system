
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authenticateUser, verifyToken } from './db';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
  avatarUrl: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = authenticateUser(email, password);
          
          if (!result) {
            set({ isLoading: false, error: 'Invalid email or password' });
            return;
          }
          
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            isLoading: false,
            error: 'An error occurred during login'
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      checkAuth: () => {
        const { token } = get();
        if (!token) return;
        
        const user = verifyToken(token);
        
        if (user) {
          set({ user, isAuthenticated: true });
        } else {
          set({ user: null, token: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'support360-auth'
    }
  )
);

// Ticket data store
interface TicketsState {
  tickets: any[];
  ticket: any | null;
  loading: boolean;
  error: string | null;
}

export const useTicketsStore = create<TicketsState>()(() => ({
  tickets: [],
  ticket: null,
  loading: false,
  error: null
}));
