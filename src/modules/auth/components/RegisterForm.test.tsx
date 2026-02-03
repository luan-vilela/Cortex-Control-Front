import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { RegisterForm } from "./RegisterForm";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

// Mock das dependências
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../services/auth.service", () => ({
  authService: {
    register: jest.fn(),
    loginWithGoogle: jest.fn(),
    loginWithFacebook: jest.fn(),
  },
}));

jest.mock("../store/auth.store", () => ({
  useAuthStore: jest.fn(),
}));

describe("RegisterForm", () => {
  const mockPush = jest.fn();
  const mockSetAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockSetAuth);
  });

  it("deve renderizar o formulário de registro", () => {
    render(<RegisterForm />);

    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /criar conta/i }),
    ).toBeInTheDocument();
  });

  it("deve validar campos obrigatórios", async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    });
  });

  it("deve validar formato de email", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/^email$/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it("deve validar tamanho mínimo da senha", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^senha$/i);
    await user.type(passwordInput, "123");

    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/senha deve ter no mínimo/i)).toBeInTheDocument();
    });
  });

  it("deve registrar usuário com sucesso", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      accessToken: "mock-token",
      user: {
        id: "123",
        email: "newuser@test.com",
        name: "New User",
        role: "admin",
      },
    };

    (authService.register as jest.Mock).mockResolvedValue(mockResponse);

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole("button", { name: /criar conta/i });

    await user.type(nameInput, "New User");
    await user.type(emailInput, "newuser@test.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: "New User",
        email: "newuser@test.com",
        password: "password123",
        companyName: undefined,
      });
      expect(mockSetAuth).toHaveBeenCalledWith(
        mockResponse.user,
        mockResponse.accessToken,
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("deve exibir erro quando email já existe", async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          message: "Email já cadastrado",
        },
      },
    };

    (authService.register as jest.Mock).mockRejectedValue(mockError);

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole("button", { name: /criar conta/i });

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "existing@test.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email já cadastrado/i)).toBeInTheDocument();
    });
  });

  it("deve desabilitar botão durante carregamento", async () => {
    const user = userEvent.setup();
    (authService.register as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole("button", { name: /criar conta/i });

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it("deve ter link para página de login", () => {
    render(<RegisterForm />);

    const loginLink = screen.getByRole("link", { name: /fazer login/i });
    expect(loginLink).toHaveAttribute("href", "/auth/login");
  });

  it("deve permitir registro com nome da empresa opcional", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      accessToken: "mock-token",
      user: {
        id: "123",
        email: "newuser@test.com",
        name: "New User",
        role: "admin",
      },
    };

    (authService.register as jest.Mock).mockResolvedValue(mockResponse);

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/^email$/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const companyInput = screen.getByLabelText(/nome da empresa/i);
    const submitButton = screen.getByRole("button", { name: /criar conta/i });

    await user.type(nameInput, "New User");
    await user.type(emailInput, "newuser@test.com");
    await user.type(passwordInput, "password123");
    await user.type(companyInput, "My Company");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: "New User",
        email: "newuser@test.com",
        password: "password123",
        companyName: "My Company",
      });
    });
  });
});
