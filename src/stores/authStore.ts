import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/api';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isAdmin: false,

      async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        set({
          user: data.user,
          session: data.session,
          isAuthenticated: !!data.session,
          isAdmin: false,
        });
      },

      async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        set({
          user: data.user,
          session: data.session,
          isAuthenticated: true,
          isAdmin: false,
        });
      },

      async signOut() {
        await supabase.auth.signOut();
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      async loadSession() {
        const { data } = await supabase.auth.getSession();
        set({
          user: data.session?.user ?? null,
          session: data.session,
          isAuthenticated: !!data.session,
          isAdmin: false,
        });
      },
    }),
    {
      name: 'gadget-thread-auth',
    }
  )
);
