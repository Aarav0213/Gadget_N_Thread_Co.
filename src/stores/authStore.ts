// src/stores/authStore.ts
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Listen for Supabase auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null;
    set({
      user,
      session,
      isAuthenticated: !!user,
      isAdmin: user?.user_metadata?.role === 'admin',
    });
  });

  return {
    user: null,
    session: null,
    isAuthenticated: false,
    isAdmin: false,

    setUser: (user) =>
      set({
        user,
        isAuthenticated: !!user,
        isAdmin: user?.user_metadata?.role === 'admin',
      }),

    setSession: (session) => {
      const user = session?.user ?? null;
      set({
        session,
        user,
        isAuthenticated: !!user,
        isAdmin: user?.user_metadata?.role === 'admin',
      });
    },

    logout: async () => {
      await supabase.auth.signOut();
      set({ user: null, session: null, isAuthenticated: false, isAdmin: false });
    },
  };
});
