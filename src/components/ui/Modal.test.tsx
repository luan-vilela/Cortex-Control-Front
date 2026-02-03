import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("não deve renderizar quando isOpen é false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <Modal.Header>Test Modal</Modal.Header>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    expect(screen.queryByText(/test modal/i)).not.toBeInTheDocument();
  });

  it("deve renderizar quando isOpen é true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <Modal.Header>Test Modal</Modal.Header>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    expect(screen.getByText(/test modal/i)).toBeInTheDocument();
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it("deve chamar onClose quando backdrop é clicado", async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Header>Test Modal</Modal.Header>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    const backdrop = screen.getByText(/content/i).closest(".fixed");
    if (backdrop) {
      await user.click(backdrop);
    }

    // O backdrop é o primeiro elemento fixed
    expect(handleClose).toHaveBeenCalled();
  });

  it("não deve chamar onClose quando modal content é clicado", async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Header>Test Modal</Modal.Header>
        <Modal.Body>Content</Modal.Body>
      </Modal>,
    );

    const content = screen.getByText(/content/i);
    await user.click(content);

    expect(handleClose).not.toHaveBeenCalled();
  });

  describe("Modal.Header", () => {
    it("deve renderizar o título", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header>My Modal Title</Modal.Header>
        </Modal>,
      );

      expect(screen.getByText(/my modal title/i)).toBeInTheDocument();
    });

    it("deve renderizar botão de fechar quando onClose é fornecido", () => {
      const handleClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header onClose={handleClose}>Title</Modal.Header>
        </Modal>,
      );

      const closeButton = screen.getByRole("button");
      expect(closeButton).toBeInTheDocument();
    });

    it("deve chamar onClose quando botão X é clicado", async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header onClose={handleClose}>Title</Modal.Header>
        </Modal>,
      );

      const closeButton = screen.getByRole("button");
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("não deve renderizar botão de fechar quando onClose não é fornecido", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header>Title</Modal.Header>
        </Modal>,
      );

      const closeButton = screen.queryByRole("button");
      expect(closeButton).not.toBeInTheDocument();
    });
  });

  describe("Modal.Body", () => {
    it("deve renderizar conteúdo do body", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Body>
            <p>This is the modal content</p>
          </Modal.Body>
        </Modal>,
      );

      expect(
        screen.getByText(/this is the modal content/i),
      ).toBeInTheDocument();
    });

    it("deve aceitar elementos complexos como children", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Body>
            <div>
              <h4>Title</h4>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
          </Modal.Body>
        </Modal>,
      );

      expect(screen.getByText(/title/i)).toBeInTheDocument();
      expect(screen.getByText(/paragraph 1/i)).toBeInTheDocument();
      expect(screen.getByText(/paragraph 2/i)).toBeInTheDocument();
    });
  });

  describe("Modal.Footer", () => {
    it("deve renderizar conteúdo do footer", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Footer>
            <button>Cancel</button>
            <button>Confirm</button>
          </Modal.Footer>
        </Modal>,
      );

      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm/i }),
      ).toBeInTheDocument();
    });

    it("deve aplicar estilos de layout corretos", () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Footer>
            <button>Action</button>
          </Modal.Footer>
        </Modal>,
      );

      const footer = screen.getByRole("button", {
        name: /action/i,
      }).parentElement;
      expect(footer).toHaveClass("flex", "items-center", "justify-end");
    });
  });

  describe("Composição completa", () => {
    it("deve renderizar modal completo com Header, Body e Footer", () => {
      const handleClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={handleClose}>
          <Modal.Header onClose={handleClose}>Confirm Action</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to proceed?</p>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={handleClose}>Cancel</button>
            <button>Confirm</button>
          </Modal.Footer>
        </Modal>,
      );

      expect(screen.getByText(/confirm action/i)).toBeInTheDocument();
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^confirm$/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter estrutura semântica adequada", () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header>Title</Modal.Header>
          <Modal.Body>Content</Modal.Body>
        </Modal>,
      );

      const heading = screen.getByText(/title/i);
      expect(heading.tagName).toBe("H3");
    });

    it("deve permitir navegação por teclado no botão de fechar", async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header onClose={handleClose}>Title</Modal.Header>
        </Modal>,
      );

      const closeButton = screen.getByRole("button");
      closeButton.focus();

      await user.keyboard("{Enter}");
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
