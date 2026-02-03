import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("deve renderizar input sem label", () => {
    render(<Input placeholder="Enter text" />);

    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it("deve renderizar input com label", () => {
    render(<Input label="Email" placeholder="email@example.com" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/email@example.com/i),
    ).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro", () => {
    render(<Input label="Password" error="Senha obrigatória" />);

    expect(screen.getByText(/senha obrigatória/i)).toBeInTheDocument();
  });

  it("deve aplicar estilo de erro quando error está presente", () => {
    render(<Input error="Error message" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-red-500");
  });

  it("deve aplicar estilo padrão quando não há erro", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-gray-300");
  });

  it("deve permitir digitação", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText(/type here/i);
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("deve chamar onChange quando o valor muda", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(handleChange).toHaveBeenCalled();
  });

  it("deve aplicar className customizada", () => {
    render(<Input className="custom-input" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-input");
  });

  it("deve passar props HTML padrão", () => {
    render(
      <Input
        type="password"
        disabled
        maxLength={10}
        data-testid="password-input"
      />,
    );

    const input = screen.getByTestId("password-input");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("deve aplicar ref corretamente", () => {
    const ref = { current: null as HTMLInputElement | null };

    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("deve ter estilos de foco", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500",
    );
  });

  it("deve aplicar estilos de foco de erro quando há erro", () => {
    render(<Input error="Error" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("focus:ring-red-500");
  });

  it("deve renderizar com value controlado", () => {
    render(<Input value="Controlled value" readOnly />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Controlled value");
  });

  it("deve permitir todos os tipos de input HTML", () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");

    rerender(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

    rerender(<Input type="password" />);
    const passwordInput = screen.getByDisplayValue("");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("deve manter acessibilidade com label", () => {
    render(<Input label="Username" id="username" />);

    const label = screen.getByText(/username/i);
    const input = screen.getByLabelText(/username/i);

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("deve exibir placeholder corretamente", () => {
    render(<Input placeholder="Digite seu nome" />);

    const input = screen.getByPlaceholderText(/digite seu nome/i);
    expect(input).toHaveAttribute("placeholder", "Digite seu nome");
  });
});
