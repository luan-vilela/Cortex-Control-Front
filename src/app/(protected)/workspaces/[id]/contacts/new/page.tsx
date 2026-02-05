"use client";

import { useParams, useRouter } from "next/navigation";
import { ContactForm } from "@/modules/contact/components";
import Link from "next/link";
import { useAlerts } from "@/contexts/AlertContext";

export default function NewContactPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const { addAlert } = useAlerts();

  const handleSuccess = () => {
    addAlert("success", "Contato criado com sucesso!");
    router.push(`/workspaces/${workspaceId}/contacts`);
  };

  const handleError = (error: Error) => {
    addAlert("error", `Erro ao criar contato: ${error.message}`);
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/workspaces/${workspaceId}/contacts`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Voltar
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Novo Contato
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Crie um novo contato para sua empresa
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <ContactForm
          workspaceId={workspaceId}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}
