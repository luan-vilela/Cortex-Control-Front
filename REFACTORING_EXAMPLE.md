# Exemplo de Refatoração com UI Patterns e Formulários

## Antes (Custom + Sem Padrão)

```tsx
// ❌ Muita lógica, componentes customizados, sem padrão
export function OldInviteForm() {
  const [formData, setFormData] = useState({
    email: "",
    role: "member",
    permissions: {},
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/invites`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      // ... mais lógica
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2>Convidar Membro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="border px-3 py-2 w-full"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        {/* ... mais campos */}
      </form>
    </div>
  );
}
```

## Depois (UI Patterns + Shadcn/UI)

```tsx
// ✅ Limpo, reutilizável, segue padrões
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useInviteMember } from "@/modules/workspace/hooks";
import {
  FormContainer,
  FormInputField,
  FormSelectField,
} from "@/components/form";
import { PageHeader } from "@/components/patterns";

// Schema de validação
const inviteSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["owner", "admin", "member"]),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export function InviteMemberPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: "member" },
  });

  const inviteMutation = useInviteMember(workspaceId);

  const onSubmit = handleSubmit((data) => {
    inviteMutation.mutate(data, {
      onSuccess: () => router.back(),
      onError: (error) => console.error("Erro:", error),
    });
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Convidar Membro"
        description="Envie um convite para adicionar um novo membro ao workspace"
        backButton={{ onClick: () => router.back() }}
      />

      <FormContainer
        title="Dados do Convite"
        onSubmit={onSubmit}
        isLoading={inviteMutation.isPending}
        onCancel={() => router.back()}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormInputField
              {...field}
              label="Email"
              type="email"
              placeholder="usuario@exemplo.com"
              error={errors.email?.message}
              required
              hint="O convite será enviado para este email"
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormSelectField
              label="Função"
              value={field.value}
              onValueChange={field.onChange}
              options={[
                { value: "owner", label: "Owner (Acesso Total)" },
                { value: "admin", label: "Admin (Gerenciar)" },
                { value: "member", label: "Membro (Visualizar)" },
              ]}
              required
              hint="Define o nível de acesso no workspace"
              error={errors.role?.message}
            />
          )}
        />
      </FormContainer>
    </div>
  );
}
```

## Comparação

| Aspecto              | Antes   | Depois         |
| -------------------- | ------- | -------------- |
| **Linhas de Código** | 80+     | 50             |
| **Reutilização**     | 0%      | 100%           |
| **Type Safety**      | Parcial | Completo (Zod) |
| **Validação**        | Manual  | Automática     |
| **Acessibilidade**   | ❌      | ✅ (ARIA)      |
| **Responsivo**       | ❌      | ✅             |
| **Consistência**     | ❌      | ✅             |
| **Manutenção**       | Difícil | Fácil          |

## Padrão Recomendado para CRUD

```tsx
// 1. Define schema de validação
const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});

// 2. Cria hook customizado
function useEditUser(id: string) {
  return useMutation({
    mutationFn: (data) => api.put(`/users/${id}`, data),
  });
}

// 3. Usa UI Patterns + Form Components
export function EditUserPage({ id }) {
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(userSchema),
  });
  const mutation = useEditUser(id);

  return (
    <div className="space-y-6">
      <PageHeader title="Editar Usuário" />
      <FormContainer onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <FormInputField label="Nome" {...field} />}
        />
        {/* ... mais campos */}
      </FormContainer>
    </div>
  );
}
```

## Checklist para Refatoração

- [ ] Remover lógica customizada
- [ ] Usar `FormInputField`, `FormSelectField`, etc
- [ ] Usar `PageHeader` para cabeçalho
- [ ] Usar `DataTableToolbar` para barra de ferramentes
- [ ] Usar `DataTable` refatorado
- [ ] Adicionar `BulkActions` para operações em massa
- [ ] Validar com Zod + React Hook Form
- [ ] Usar hooks customizados para API
- [ ] Usar TypeScript em 100%
- [ ] Adicionar mensagens de erro/sucesso com Alert

## Next Steps

1. **Refatorar Members Page**: Use este padrão
2. **Refatorar Contacts Page**: Aplicar padrão completo
3. **Criar Templates**: Para CRUD padrão
4. **Documentar API**: Requests/Responses
