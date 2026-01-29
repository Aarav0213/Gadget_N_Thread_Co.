import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.user_metadata?.role === 'admin',
    }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, isAdmin: false });
  },
}));
