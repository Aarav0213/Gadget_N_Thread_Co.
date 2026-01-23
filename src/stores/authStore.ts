import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },
      
      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
            isAdmin: (userData.role ?? currentUser.role) === 'admin',
          });
        }
      },
    }),
    {
      name: 'gadget-thread-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
