"use client";

import { Alert } from "@/components/Alert";
import { ComponentShowcase } from "./ComponentShowcase";

export function AlertsShowcase() {
  return (
    <ComponentShowcase
      title="Alerts"
      description="Componentes para exibir mensagens"
    >
      <div className="space-y-4">
        {/* Info Alert */}
        <Alert
          variant="info"
          title="Informação"
          message="Esta é uma mensagem informativa para o usuário."
        />

        {/* Success Alert */}
        <Alert
          variant="success"
          title="Sucesso"
          message="Operação realizada com sucesso!"
        />

        {/* Warning Alert */}
        <Alert
          variant="warning"
          title="Aviso"
          message="Verifique sua ação antes de continuar."
        />

        {/* Error Alert */}
        <Alert
          variant="error"
          title="Erro"
          message="Ocorreu um erro ao processar sua solicitação."
        />
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<Alert variant="info" title="Informação">
  Esta é uma mensagem informativa para o usuário.
</Alert>

<Alert variant="success" title="Sucesso">
  Operação realizada com sucesso!
</Alert>

<Alert variant="warning" title="Aviso">
  Verifique sua ação antes de continuar.
</Alert>

<Alert variant="error" title="Erro">
  Ocorreu um erro ao processar sua solicitação.
</Alert>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
