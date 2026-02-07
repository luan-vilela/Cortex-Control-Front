# Paginação - DataTable Update

## Implementação

- ✅ DataTable agora com paginação automática (20 itens por página)
- ✅ Máximo 100 itens por página configurável
- ✅ Controles: Anterior/Próxima + números de página
- ✅ Indicador: "Mostrando X a Y de Z registros"

## Props Adicionadas

```typescript
pageSize?: number;      // Default: 20
maxPageSize?: number;   // Default: 100
```

## Features

- Paginação automática sem necessidade de código nas páginas
- Botões Anterior/Próxima habilitados/desabilitados corretamente
- Números de página para saltar direto
- Indicador visual da página atual
- Reseta para página 1 quando dados mudam

## Páginas Afetadas

- ✅ Members: Herda paginação automática
- ✅ Contacts: Herda paginação automática
- ✅ Todas as futuras: Todas receberão paginação 20/100

## Status

- ✅ Implementado e compilando
- ✅ Sem breaking changes
- ✅ Pronto para uso
