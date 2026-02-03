# Sistema de Alertas e Flags

Sistema de notificações para exibir erros, avisos, sucessos e informações ao usuário.

## Componentes

### Alert

Componente base para exibir alertas inline.

**Props:**

- `variant`: "error" | "warning" | "success" | "info" (padrão: "info")
- `title`: Título do alerta (opcional)
- `message`: Mensagem principal
- `dismissible`: Permite fechar o alerta (padrão: false)
- `onDismiss`: Callback quando alerta é fechado
- `className`: Classes CSS adicionais

**Exemplo:**

```tsx
<Alert
  variant="error"
  title="Erro de conexão"
  message="Não foi possível conectar ao servidor"
  dismissible
/>
```

### AlertProvider + AlertContainer

Sistema global de alertas com gerenciamento automático.

## Instalação

1. **Adicionar o Provider no layout raiz:**

```tsx
// app/layout.tsx
import { AlertProvider } from "@/contexts/AlertContext";
import { AlertContainer } from "@/components/AlertContainer";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AlertProvider>
          {children}
          <AlertContainer />
        </AlertProvider>
      </body>
    </html>
  );
}
```

## Uso

### Hook useAlerts

```tsx
import { useAlerts } from "@/contexts/AlertContext";

function MyComponent() {
  const alerts = useAlerts();

  const handleError = () => {
    alerts.error("Erro ao salvar dados");
  };

  const handleSuccess = () => {
    alerts.success("Dados salvos com sucesso!");
  };

  const handleWarning = () => {
    alerts.warning("Atenção: alguns campos estão vazios");
  };

  const handleInfo = () => {
    alerts.info("Processamento iniciado");
  };

  // Alert personalizado com duração
  const handleCustom = () => {
    alerts.addAlert(
      "error",
      "Erro personalizado",
      "Título Customizado",
      10000, // 10 segundos
    );
  };

  return (
    <div>
      <button onClick={handleError}>Mostrar Erro</button>
      <button onClick={handleSuccess}>Mostrar Sucesso</button>
      <button onClick={handleWarning}>Mostrar Aviso</button>
      <button onClick={handleInfo}>Mostrar Info</button>
    </div>
  );
}
```

### Alert Inline (não global)

```tsx
import { Alert } from "@/components/Alert";

function MyForm() {
  const [error, setError] = useState("");

  return (
    <form>
      {error && (
        <Alert
          variant="error"
          message={error}
          dismissible
          onDismiss={() => setError("")}
        />
      )}

      <Alert variant="info" message="Preencha todos os campos obrigatórios" />

      {/* Campos do formulário */}
    </form>
  );
}
```

## Casos de Uso

### 1. Erros de API

```tsx
try {
  await api.post("/workspaces", data);
  alerts.success("Workspace criado com sucesso!");
} catch (error) {
  alerts.error(error.response?.data?.message || "Erro ao criar workspace");
}
```

### 2. Validação de Formulário

```tsx
if (!name) {
  alerts.warning("O nome do workspace é obrigatório");
  return;
}
```

### 3. Feedback de Ações

```tsx
const handleDelete = async () => {
  try {
    await deleteWorkspace(id);
    alerts.success("Workspace deletado");
    router.push("/workspaces");
  } catch (error) {
    alerts.error("Não foi possível deletar o workspace");
  }
};
```

### 4. Informações do Sistema

```tsx
useEffect(() => {
  if (workspace.status === "SUSPENDED") {
    alerts.warning(
      "Workspace suspenso por falta de créditos",
      "Ação Necessária",
    );
  }
}, [workspace.status]);
```

## Variantes e Cores

- **error** (vermelho): Erros críticos, falhas de operação
- **warning** (amarelo): Avisos, atenção necessária
- **success** (verde): Operações concluídas com sucesso
- **info** (azul): Informações gerais, dicas

## Configuração

### Duração Padrão

Alertas desaparecem automaticamente após 5 segundos. Para mudar:

```tsx
alerts.addAlert("success", "Mensagem", undefined, 3000); // 3 segundos
alerts.addAlert("error", "Mensagem", undefined, 0); // Não desaparece
```

### Posição

Os alertas aparecem no canto superior direito. Para mudar a posição, edite:

```tsx
// src/components/AlertContainer.tsx
<div className="fixed top-4 right-4 z-50"> {/* Modificar aqui */}
```

## Estilo e Animações

Alertas usam Tailwind CSS com:

- Animação de entrada: `slide-in-from-right`
- Sombra: `shadow-lg`
- Bordas arredondadas e cores temáticas
- Ícones do lucide-react

## Acessibilidade

- `role="alert"` para leitores de tela
- Ícones descritivos para cada tipo
- Botão de fechar com `aria-label`
- Contraste de cores adequado
