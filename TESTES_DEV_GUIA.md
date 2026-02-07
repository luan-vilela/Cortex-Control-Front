# Rota de Testes de Componentes

## 📍 Localização

```
/app/(protected)/testes-dev/page.tsx
```

## 🎯 Propósito

Página de desenvolvimento que showcaseia todos os componentes e padrões disponíveis no projeto em um único lugar.

## 📁 Estrutura

### Módulo testes-dev

```
src/modules/testes-dev/
├── components/
│   ├── ComponentShowcase.tsx (wrapper para cada showcase)
│   ├── ButtonsShowcase.tsx (Button com variações)
│   ├── InputsShowcase.tsx (Input e FormInput)
│   ├── TextareasShowcase.tsx (Textarea e FormTextarea)
│   ├── SelectsShowcase.tsx (Select, RadioGroup, Checkbox)
│   ├── CardsShowcase.tsx (Card, Badge)
│   ├── DatePatternsShowcase.tsx (DatePicker, DateRangePicker)
│   ├── PatternsShowcase.tsx (PageHeader, DataTableToolbar)
│   ├── DialogsShowcase.tsx (Dialog, AlertDialog)
│   ├── AlertsShowcase.tsx (Alert com variações)
│   └── index.ts (exports centralizados)
└── page.tsx (página principal em /app/(protected)/testes-dev)
```

## 🎨 Componentes Showcaseados

### 1. **Buttons** (`ButtonsShowcase.tsx`)

Demonstra todas as variações do Button:

- Default, Secondary, Destructive, Outline, Ghost, Disabled
- Tamanhos: Small, Default, Large

### 2. **Inputs** (`InputsShowcase.tsx`)

Demonstra campos de entrada:

- Input shadcn/ui nativo
- FormInput (wrapper customizado)
- Tipos: text, email, password, number, search

### 3. **Textareas** (`TextareasShowcase.tsx`)

Demonstra campos de texto multi-linha:

- Textarea shadcn/ui nativo
- FormTextarea (wrapper customizado)
- Diferentes tamanhos (2, 3, 5 linhas)

### 4. **Selects** (`SelectsShowcase.tsx`)

Demonstra componentes de seleção:

- Select (dropdown)
- RadioGroup + RadioButton
- Checkbox (simples e desabilitado)

### 5. **Cards** (`CardsShowcase.tsx`)

Demonstra containers e rótulos:

- Card com Header e Content
- Card customizado com cores
- Badge com variações

### 6. **Date Patterns** (`DatePatternsShowcase.tsx`)

Demonstra seletores de data:

- DatePicker (data única)
- DateRangePicker (período)

### 7. **Layout Patterns** (`PatternsShowcase.tsx`)

Demonstra padrões de layout:

- PageHeader (título + ação)
- DataTableToolbar (filtros)

### 8. **Dialogs** (`DialogsShowcase.tsx`)

Demonstra modais:

- Dialog (genérico)
- AlertDialog (confirmação)

### 9. **Alerts** (`AlertsShowcase.tsx`)

Demonstra mensagens:

- Alert (info, success, warning, error)

## 🚀 Como Usar

1. **Acessar a página**:
   - URL: `/testes-dev`
   - Requer autenticação e estar logado

2. **Navegar pelos componentes**:
   - Use o índice no topo para pular para cada seção
   - Clique em `#{componente}` para navegar

3. **Copiar código**:
   - Cada showcase tem uma seção "Código"
   - Copy/paste dos exemplos para seu projeto

## 📝 Adicionar Novo Showcase

1. Criar arquivo em `src/modules/testes-dev/components/NomeShowcase.tsx`:

```tsx
"use client";

import { ComponentShowcase } from "./ComponentShowcase";

export function NomeShowcase() {
  return (
    <ComponentShowcase
      title="Título do Componente"
      description="Descrição breve"
    >
      {/* Componentes aqui */}

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`/* Código de exemplo */`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
```

2. Exportar em `src/modules/testes-dev/components/index.ts`:

```ts
export { NomeShowcase } from "./NomeShowcase";
```

3. Adicionar à página principal em `page.tsx`:

```tsx
const showcases = [
  // ... existentes ...
  { id: "nome", component: <NomeShowcase /> },
];
```

## 🎨 Padrão ComponentShowcase

Cada showcase usa o componente `ComponentShowcase` que fornece:

- Título e descrição
- Card container padrão
- Estilo consistente
- Padrão para mostrar código

## 💡 Dicas

- **Para desenvolvedores**: Use esta página para entender padrões do projeto
- **Para designers**: Veja como os componentes se comportam
- **Para documentação**: Copie exemplos diretos do código
- **Para testes**: Teste interações de componentes aqui

## 🔒 Acesso

Página protegida - requer:

- Estar autenticado
- Estar dentro de um workspace
- Permissões de usuário regular

## 📚 Componentes Usados

- shadcn/ui components (Button, Input, Card, etc.)
- Componentes customizados (FormInput, FormTextarea, Alert)
- Padrões customizados (PageHeader, DatePicker, etc.)

## ✅ Status

- ✅ 9 showcases criados
- ✅ Componentes compilando
- ✅ Índice de navegação funcional
- ✅ Exemplos de código em cada showcase
- ✅ Pronto para uso
