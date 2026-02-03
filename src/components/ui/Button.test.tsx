import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("deve renderizar o botão com texto", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("deve aplicar variante primary por padrão", () => {
    render(<Button>Primary</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-blue-600");
  });

  it("deve aplicar variante secondary", () => {
    render(<Button variant="secondary">Secondary</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-600");
  });

  it("deve aplicar variante outline", () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-2", "border-blue-600");
  });

  it("deve aplicar variante ghost", () => {
    render(<Button variant="ghost">Ghost</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-gh-text");
  });

  it("deve aplicar tamanho small", () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
  });

  it("deve aplicar tamanho medium por padrão", () => {
    render(<Button>Medium</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-2", "text-base");
  });

  it("deve aplicar tamanho large", () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("deve chamar onClick quando clicado", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("deve estar desabilitado quando disabled é true", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("deve mostrar loading spinner quando isLoading é true", () => {
    render(<Button isLoading>Loading</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("deve estar desabilitado durante loading", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} isLoading>
        Loading
      </Button>,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("deve aplicar className customizada", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("deve passar props HTML padrão", () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>,
    );

    const button = screen.getByTestId("submit-btn");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("deve aplicar estilos de foco", () => {
    render(<Button>Focus</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("focus:outline-none", "focus:ring-2");
  });

  it("deve aplicar estilos de desabilitado", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
    );
  });
});
