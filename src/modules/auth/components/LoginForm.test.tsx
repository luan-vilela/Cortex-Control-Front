import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

// Mock das dependências
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../services/auth.service", () => ({
  authService: {
    login: jest.fn(),
    loginWithGoogle: jest.fn(),
    loginWithFacebook: jest.fn(),
  },
}));

jest.mock("../store/auth.store", () => ({
  useAuthStore: jest.fn(),
}));

describe("LoginForm", () => {
  const mockPush = jest.fn();
  const mockSetAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockSetAuth);
  });

  it("deve renderizar o formulário de login", () => {
    render(<LoginForm />);

    expect(screen.getByText("Bem-vindo")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("deve validar campos obrigatórios", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    });
  });

  it("deve validar formato de email", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it("deve fazer login com sucesso", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      accessToken: "mock-token",
      user: {
        id: "123",
        email: "test@test.com",
        name: "Test User",
        role: "admin",
      },
    };

    (authService.login as jest.Mock).mockResolvedValue(mockResponse);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
      expect(mockSetAuth).toHaveBeenCalledWith(
        mockResponse.user,
        mockResponse.accessToken,
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("deve exibir erro quando login falha", async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          message: "Credenciais inválidas",
        },
      },
    };

    (authService.login as jest.Mock).mockRejectedValue(mockError);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "wrong-password");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it("deve desabilitar botão durante carregamento", async () => {
    const user = userEvent.setup();
    (authService.login as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it("deve chamar loginWithGoogle ao clicar no botão Google", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const googleButton = screen.getByRole("button", { name: /google/i });
    await user.click(googleButton);

    expect(authService.loginWithGoogle).toHaveBeenCalled();
  });

  it("deve chamar loginWithFacebook ao clicar no botão Facebook", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const facebookButton = screen.getByRole("button", { name: /facebook/i });
    await user.click(facebookButton);

    expect(authService.loginWithFacebook).toHaveBeenCalled();
  });

  it("deve ter link para página de registro", () => {
    render(<LoginForm />);

    const registerLink = screen.getByRole("link", {
      name: /criar conta grátis/i,
    });
    expect(registerLink).toHaveAttribute("href", "/auth/register");
  });
});
