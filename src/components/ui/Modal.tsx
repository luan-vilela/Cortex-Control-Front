"use client";

import { Fragment, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  blur?: "none" | "sm" | "md" | "lg";
  maxWidth?: string;
}

interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

interface ModalBodyProps {
  children: ReactNode;
}

interface ModalFooterProps {
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  children,
  blur = "none",
  maxWidth = "max-w-md",
}: ModalProps) {
  if (!isOpen) return null;

  const blurClasses = {
    none: "",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity ${blurClasses[blur]}`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-gh-card rounded-lg shadow-xl ${maxWidth} w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.Header = function ModalHeader({ children, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6">
      <h3 className="text-xl font-semibold text-gh-text">{children}</h3>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gh-text-secondary hover:text-gh-text-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children }: ModalBodyProps) {
  return <div className="p-6">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 p-6">{children}</div>
  );
};
