import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          // Salva cookie para o middleware poder verificar
          document.cookie = `cortex-auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 dias
        }
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Remove o cookie
          document.cookie = "cortex-auth-token=; path=/; max-age=0";
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
