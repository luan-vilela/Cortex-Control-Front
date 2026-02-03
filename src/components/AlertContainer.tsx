"use client";

import { useAlerts } from "@/contexts/AlertContext";
import { Alert } from "./Alert";

export function AlertContainer() {
  const { alerts, removeAlert } = useAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          dismissible
          onDismiss={() => removeAlert(alert.id)}
          className="shadow-lg animate-in slide-in-from-right duration-300"
        />
      ))}
    </div>
  );
}
