import { renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "./auth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Limpar o localStorage antes de cada teste
    localStorage.clear();
    // Reset do store
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: true,
    });
  });

  describe("setAuth", () => {
    it("deve definir usuário e token corretamente", () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: "123",
        email: "test@test.com",
        name: "Test User",
        role: "admin",
      };
      const mockToken = "mock-jwt-token";

      result.current.setAuth(mockUser as any, mockToken);

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("deve salvar dados no localStorage", () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: "123",
        email: "test@test.com",
        name: "Test User",
        role: "admin",
      };
      const mockToken = "mock-jwt-token";

      result.current.setAuth(mockUser as any, mockToken);

      expect(localStorage.getItem("token")).toBe(mockToken);
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    });

    it("deve criar cookie cortex-auth-token", () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: "123",
        email: "test@test.com",
        name: "Test User",
        role: "admin",
      };
      const mockToken = "mock-jwt-token";

      result.current.setAuth(mockUser as any, mockToken);

      // Verificar se o cookie foi setado
      expect(document.cookie).toContain("cortex-auth-token");
    });
  });

  describe("clearAuth", () => {
    it("deve limpar todos os dados de autenticação", () => {
      const { result } = renderHook(() => useAuthStore());

      // Primeiro setar dados
      const mockUser = {
        id: "123",
        email: "test@test.com",
        name: "Test User",
        role: "admin",
      };
      result.current.setAuth(mockUser as any, "token");

      // Depois limpar
      result.current.clearAuth();

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("deve remover dados do localStorage", () => {
      const { result } = renderHook(() => useAuthStore());

      // Setar dados
      result.current.setAuth(
        {
          id: "123",
          email: "test@test.com",
          name: "Test",
          role: "admin",
        } as any,
        "token",
      );

      // Limpar
      result.current.clearAuth();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });

    it("deve remover cookie cortex-auth-token", () => {
      const { result } = renderHook(() => useAuthStore());

      // Setar dados
      result.current.setAuth(
        {
          id: "123",
          email: "test@test.com",
          name: "Test",
          role: "admin",
        } as any,
        "token",
      );

      // Limpar
      result.current.clearAuth();

      // Cookie deve ser removido (max-age=0)
      expect(document.cookie).toContain("max-age=0");
    });
  });

  describe("persistência", () => {
    it("deve restaurar dados do localStorage após reload", async () => {
      const mockUser = {
        id: "123",
        email: "test@test.com",
        name: "Test User",
        role: "admin",
      };
      const mockToken = "mock-jwt-token";

      // Salvar dados
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      // Simular reload criando nova instância
      const { result } = renderHook(() => useAuthStore());

      await waitFor(() => {
        expect(result.current._hasHydrated).toBe(true);
      });

      // Dados devem estar presentes
      expect(result.current.token).toBe(mockToken);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
