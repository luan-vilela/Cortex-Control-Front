import axios from "axios";
import { authService } from "./auth.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("authService", () => {
  const API_URL = "http://localhost:3000";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("deve fazer login com sucesso", async () => {
      const mockLoginData = {
        email: "test@test.com",
        password: "password123",
      };

      const mockResponse = {
        data: {
          accessToken: "mock-token",
          user: {
            id: "123",
            email: "test@test.com",
            name: "Test User",
            role: "admin",
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.login(mockLoginData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/auth/login`,
        mockLoginData,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("deve lançar erro quando login falha", async () => {
      const mockLoginData = {
        email: "test@test.com",
        password: "wrong-password",
      };

      const mockError = {
        response: {
          status: 401,
          data: {
            message: "Credenciais inválidas",
          },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(authService.login(mockLoginData)).rejects.toEqual(mockError);
    });
  });

  describe("register", () => {
    it("deve registrar usuário com sucesso", async () => {
      const mockRegisterData = {
        email: "newuser@test.com",
        password: "password123",
        name: "New User",
        companyName: "Test Company",
      };

      const mockResponse = {
        data: {
          accessToken: "mock-token",
          user: {
            id: "456",
            email: "newuser@test.com",
            name: "New User",
            role: "admin",
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.register(mockRegisterData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/auth/register`,
        mockRegisterData,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("deve lançar erro quando email já existe", async () => {
      const mockRegisterData = {
        email: "existing@test.com",
        password: "password123",
        name: "Test",
      };

      const mockError = {
        response: {
          status: 409,
          data: {
            message: "Email já cadastrado",
          },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(authService.register(mockRegisterData)).rejects.toEqual(
        mockError,
      );
    });
  });

  describe("getProfile", () => {
    it("deve buscar perfil do usuário", async () => {
      const mockToken = "mock-token";
      const mockResponse = {
        data: {
          id: "123",
          email: "test@test.com",
          name: "Test User",
          role: "admin",
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await authService.getProfile(mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("deve lançar erro quando token é inválido", async () => {
      const mockToken = "invalid-token";
      const mockError = {
        response: {
          status: 401,
          data: {
            message: "Token inválido",
          },
        },
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(authService.getProfile(mockToken)).rejects.toEqual(
        mockError,
      );
    });
  });

  describe("updateProfile", () => {
    it("deve atualizar perfil com sucesso", async () => {
      const mockToken = "mock-token";
      const mockUpdateData = {
        name: "Updated Name",
      };

      const mockResponse = {
        data: {
          id: "123",
          email: "test@test.com",
          name: "Updated Name",
          role: "admin",
        },
      };

      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await authService.updateProfile(mockToken, mockUpdateData);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_URL}/auth/profile`,
        mockUpdateData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("changePassword", () => {
    it("deve alterar senha com sucesso", async () => {
      const mockToken = "mock-token";
      const mockPasswordData = {
        currentPassword: "old-password",
        newPassword: "new-password",
      };

      const mockResponse = {
        data: {
          message: "Senha alterada com sucesso",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.changePassword(
        mockToken,
        mockPasswordData,
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/auth/change-password`,
        mockPasswordData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("deve lançar erro quando senha atual está incorreta", async () => {
      const mockToken = "mock-token";
      const mockPasswordData = {
        currentPassword: "wrong-password",
        newPassword: "new-password",
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: "Senha atual incorreta",
          },
        },
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(
        authService.changePassword(mockToken, mockPasswordData),
      ).rejects.toEqual(mockError);
    });
  });

  describe("OAuth methods", () => {
    it("loginWithGoogle deve redirecionar para URL correta", () => {
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: "" } as any;

      authService.loginWithGoogle();

      expect(window.location.href).toBe(`${API_URL}/auth/google`);

      window.location = originalLocation;
    });

    it("loginWithFacebook deve redirecionar para URL correta", () => {
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: "" } as any;

      authService.loginWithFacebook();

      expect(window.location.href).toBe(`${API_URL}/auth/facebook`);

      window.location = originalLocation;
    });
  });
});
