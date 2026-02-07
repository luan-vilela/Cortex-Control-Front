"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useCreatePerson } from "@/modules/person/hooks/usePersonMutations";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { useAlerts } from "@/contexts/AlertContext";
import { useBreadcrumb } from "@/modules/workspace/hooks";
import { Button } from "@/components/ui/Button";
import {
  newPersonFormSchema,
  NewPersonFormData,
} from "@/modules/person/schemas/new-person.schema";
import { useNewPersonForm } from "@/modules/person/hooks/useNewPersonForm";
import { BasicInfoSection } from "@/modules/person/components/NewPersonBasicInfoSection";
import { PhonesSection } from "@/modules/person/components/NewPersonPhonesSection";
import { AddressSection } from "@/modules/person/components/NewPersonAddressSection";
import { AdditionalInfoSection } from "@/modules/person/components/NewPersonAdditionalInfoSection";

export default function NewPersonPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();
  const { handleCepBlur, formatCepInput } = useNewPersonForm();
  const createMutation = useCreatePerson(activeWorkspace?.id || "");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NewPersonFormData>({
    resolver: zodResolver(newPersonFormSchema),
    defaultValues: {
      name: "",
      email: "",
      document: "",
      address: "",
      city: "",
      state: "",
      country: "Brasil",
      postalCode: "",
      website: "",
      notes: "",
      phones: undefined,
    },
  });

  useBreadcrumb([
    {
      label: "Contatos",
      href: "/contatos",
    },
    {
      label: "Nova Pessoa",
      href: "/contatos/new",
    },
  ]);

  const onSubmit = async (data: NewPersonFormData) => {
    const cleanData: any = {
      name: data.name,
      active: true,
    };

    if (data.email && data.email.trim()) cleanData.email = data.email;
    if (data.document && data.document.trim())
      cleanData.document = data.document;
    if (data.website && data.website.trim()) cleanData.website = data.website;
    if (data.address && data.address.trim()) cleanData.address = data.address;
    if (data.city && data.city.trim()) cleanData.city = data.city;
    if (data.state && data.state.trim()) cleanData.state = data.state;
    if (data.country && data.country.trim()) cleanData.country = data.country;
    if (data.postalCode && data.postalCode.trim())
      cleanData.postalCode = data.postalCode;
    if (data.notes && data.notes.trim()) cleanData.notes = data.notes;
    if (data.phones && data.phones.length > 0) {
      cleanData.phones = data.phones.filter((p) => p.number?.trim());
    }

    createMutation.mutate(cleanData, {
      onSuccess: () => {
        alerts.success("Pessoa criada com sucesso!");
        router.push("/contatos");
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || "Erro ao criar pessoa");
      },
    });
  };

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Header com Botões */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gh-text mb-1">
              Nova Pessoa
            </h2>
            <p className="text-xs sm:text-sm text-gh-text-secondary">
              Cadastre uma nova pessoa. Os papéis são definidos automaticamente
              pelo sistema com base nas ações e processos do sistema.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 md:flex-none"
              onClick={() => router.push("/contatos")}
            >
              Descartar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              form="new-person-form"
              disabled={createMutation.isPending}
              isLoading={createMutation.isPending}
              className="flex-1 md:flex-none"
            >
              {createMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        {/* Formulário */}
        <form
          id="new-person-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <BasicInfoSection control={control} errors={errors} />

          <PhonesSection control={control} />

          <AddressSection
            control={control}
            errors={errors}
            setValue={setValue}
            formatCepInput={formatCepInput}
            onCepBlur={handleCepBlur}
          />

          <AdditionalInfoSection control={control} errors={errors} />
        </form>
      </div>
    </ModuleGuard>
  );
}
