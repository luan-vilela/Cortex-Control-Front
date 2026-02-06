# Masks e Formatação de Documentos

Utilitários para formatação e validação de documentos brasileiros (CPF, CNPJ) e outros campos.

## Importação

```typescript
import {
  formatCPF,
  formatCNPJ,
  formatDocument,
  isValidCPF,
  isValidCNPJ,
  detectDocumentType,
  formatPhone,
  formatCEP,
} from "@/lib/masks";
```

## CPF

### Formatação

```typescript
formatCPF("12345678901"); // "123.456.789-01"
formatCPF("123456789"); // "123.456.789"
removeCPFMask("123.456.789-01"); // "12345678901"
```

### Validação

```typescript
isValidCPF("12345678901"); // false (inválido)
isValidCPF("11144477735"); // true (válido)
```

## CNPJ

### Formatação

```typescript
formatCNPJ("11222333000181"); // "11.222.333/0001-81"
formatCNPJ("11A2B2333/0001-81"); // "11.A2B.2333/0001-81" (Ana - com letras)
removeCNPJMask("11.222.333/0001-81"); // "11222333000181"
```

### Validação

```typescript
isValidCNPJ("11222333000181"); // true (estrutura válida)
```

## Auto-Detecção

```typescript
detectDocumentType("12345678901"); // "cpf"
detectDocumentType("11222333000181"); // "cnpj"
detectDocumentType("123"); // "unknown"

// Formata automaticamente
formatDocument("12345678901"); // "123.456.789-01"
formatDocument("11222333000181"); // "11.222.333/0001-81"

// Remove máscara automaticamente
removeDocumentMask("123.456.789-01"); // "12345678901"
removeDocumentMask("11.222.333/0001-81"); // "11222333000181"
```

## Telefone

```typescript
formatPhone("1133334444"); // "(11) 3333-4444"
formatPhone("11999998888"); // "(11) 99999-8888"
removePhoneMask("(11) 3333-4444"); // "1133334444"
```

## CEP

```typescript
formatCEP("01310100"); // "01310-100"
removeCEPMask("01310-100"); // "01310100"
```

## Notas Importantes

### CNPJ Ana (Lei 13.874/2019)

A partir de 2019, CNPJ pode conter letras além de números. Esta biblioteca suporta ambos:

- **Tradicional**: 11.222.333/0001-81 (apenas números)
- **Ana**: 11.A2B.2333/0001-81 (números + letras)

A função `isValidCNPJ()` apenas verifica a estrutura básica. Para validação completa com dígito verificador, consulte a Receita Federal.

### Uso em Forms

Para usar com React Hook Form:

```typescript
import { formatCPF, removeCPFMask } from "@/lib/masks";
import { useForm } from "react-hook-form";

export function MyForm() {
  const { register } = useForm();

  return (
    <input
      {...register("cpf", {
        onChange: (e) => {
          e.target.value = formatCPF(e.target.value);
        },
        onBlur: (e) => {
          const clean = removeCPFMask(e.target.value);
          // Validar se necessário
        },
      })}
    />
  );
}
```
