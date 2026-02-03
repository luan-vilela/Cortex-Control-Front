"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AlertVariant } from "@/components/Alert";
import { generateUniqueId } from "@/lib/utils";

interface AlertData {
  id: string;
  variant: AlertVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface AlertContextType {
  alerts: AlertData[];
  addAlert: (
    variant: AlertVariant,
    message: string,
    title?: string,
    duration?: number,
  ) => void;
  removeAlert: (id: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const addAlert = (
    variant: AlertVariant,
    message: string,
    title?: string,
    duration = 5000,
  ) => {
    const id = generateUniqueId();
    const newAlert: AlertData = { id, variant, message, title, duration };

    setAlerts((prev) => [...prev, newAlert]);

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const error = (message: string, title?: string) => {
    addAlert("error", message, title || "Erro");
  };

  const warning = (message: string, title?: string) => {
    addAlert("warning", message, title || "Atenção");
  };

  const success = (message: string, title?: string) => {
    addAlert("success", message, title || "Sucesso");
  };

  const info = (message: string, title?: string) => {
    addAlert("info", message, title);
  };

  return (
    <AlertContext.Provider
      value={{ alerts, addAlert, removeAlert, error, warning, success, info }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts deve ser usado dentro de AlertProvider");
  }
  return context;
}
