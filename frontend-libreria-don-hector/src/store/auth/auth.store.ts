import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  client: unknown | null; // Tipo genérico para cliente
  authToken: string | null;
  isAuthenticated: boolean;
  
  setUser: (user: User | null) => void;
  setClient: (client: unknown | null) => void;
  setTokens: (tokens: { authToken: string; } | null) => void;
  clearTokens: () => void;
  logout: () => void;
  
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      client: null,
      authToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setClient: (client) => set({ client }),
      
      setTokens: (tokens) =>
        set({
          authToken: tokens?.authToken ?? null
        }),

      clearTokens: () =>
        set({
          authToken: null
        }),

      logout: () => {
        set({
          user: null,
          client: null,
          authToken: null,
          isAuthenticated: false,
        });
      },
      
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role as UserRole);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        client: state.client,
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);