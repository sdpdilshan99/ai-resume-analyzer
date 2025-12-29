import { create } from 'zustand';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;      // Holds user data (email, id, name)
  isLoading: boolean;     // True while checking if user is logged in
  setUser: (user: User | null) => void; // Function to update user
  signOut: () => Promise<void>;         // Function to log out
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // App starts by loading/checking session
  setUser: (user) => set({ user, isLoading: false }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null);
});