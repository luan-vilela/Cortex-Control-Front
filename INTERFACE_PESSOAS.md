# Interface de Pessoas - Padrão GitHub

## Visão Geral

A interface de pessoas foi reorganizada seguindo o padrão do GitHub com menu lateral (sidebar), proporcionando uma navegação mais intuitiva e organizada.

## Estrutura da Interface

### Layout com Sidebar

Ao acessar `/persons`, você verá:

```
┌─────────────────────────────────────────────┐
│  Header (Cortex Control + Workspace)       │
├──────────────┬──────────────────────────────┤
│              │                              │
│  Sidebar     │  Conteúdo Principal          │
│  Menu        │                              │
│              │  - Listagem de pessoas       │
│  • Todas     │  - Formulário de criação     │
│  • Nova      │  - Detalhes da pessoa        │
│  • Sem Vínculo│                             │
│  • Leads     │                              │
│  • Clientes  │                              │
│  • Fornecedores│                            │
│  • Parceiros │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

### Menu Lateral (Sidebar)

O menu lateral exibe:

1. **Todas as Pessoas** (badge com total)
   - Listagem completa sem filtros

2. **Nova Pessoa**
   - Formulário de criação

3. **Sem Vínculo** (badge com contador)
   - Pessoas que ainda não possuem papel definido
   - Útil para identificar cadastros pendentes de classificação

4. **Leads** (badge com contador)
   - Pessoas com papel de LEAD
   - Potenciais clientes em prospecção

5. **Clientes** (badge com contador)
   - Pessoas com papel de CLIENTE
   - Clientes ativos do workspace

6. **Fornecedores** (badge com contador)
   - Pessoas com papel de FORNECEDOR
   - Fornecedores de produtos e serviços

7. **Parceiros** (badge com contador)
   - Pessoas com papel de PARCEIRO
   - Parceiros de negócio

## Tipos de Papel (Roles)

### RoleType Disponíveis

```typescript
enum RoleType {
  LEAD = "LEAD", // Potencial cliente
  CLIENTE = "CLIENTE", // Cliente ativo
  FORNECEDOR = "FORNECEDOR", // Fornecedor
  PARCEIRO = "PARCEIRO", // Parceiro de negócio
}
```

### Fluxo Recomendado

1. **Criar Pessoa** (identidade básica)
   - Nome, tipo (PF/PJ), documento, contato
   - Pessoa criada SEM papel

2. **Adicionar Papel** conforme necessário
   - Lead → quando é um potencial cliente
   - Cliente → quando fecha negócio
   - Fornecedor → quando fornece produtos/serviços
   - Parceiro → quando há parceria estratégica

3. **Múltiplos Papéis** (se necessário)
   - Uma pessoa pode ser Cliente E Fornecedor
   - Uma pessoa pode ser Parceiro E Cliente

## Funcionalidades por Página

### Todas as Pessoas

- Listagem completa
- Busca por nome, email ou documento
- Filtro rápido por tipo (PF/PJ)
- Cards com informações resumidas

### Nova Pessoa

- Formulário com seções:
  - Informações Básicas (nome, tipo, documento, email)
  - Telefones (múltiplos, com tipo)
  - Endereço completo
  - Observações
- Validação em tempo real
- Após criação: pessoa fica "Sem Vínculo"

### Filtros por Papel

- Listagem filtrada automaticamente
- Mesma interface de busca e filtros
- Descrição contextual do papel selecionado
- Botão para criar nova pessoa sempre visível

## Estatísticas

O dashboard exibe contadores atualizados:

```typescript
{
  total: 150,           // Total de pessoas
  active: 148,          // Pessoas ativas
  withoutRole: 25,      // Pessoas sem papel
  byRole: {
    LEAD: 30,           // Leads
    CLIENTE: 80,        // Clientes
    FORNECEDOR: 35,     // Fornecedores
    PARCEIRO: 10        // Parceiros
  }
}
```

**Nota:** A soma dos papéis pode ser maior que o total de pessoas, pois uma pessoa pode ter múltiplos papéis.

## Navegação

### URLs Disponíveis

- `/persons` - Todas as pessoas
- `/persons/new` - Criar nova pessoa
- `/persons?filter=no-role` - Pessoas sem vínculo
- `/persons?filter=lead` - Leads
- `/persons?filter=cliente` - Clientes
- `/persons?filter=fornecedor` - Fornecedores
- `/persons?filter=parceiro` - Parceiros
- `/persons/[id]` - Detalhes da pessoa

### Integração com Dashboard

No dashboard, o card "Pessoas" agora mostra:

- Total de pessoas
- Pessoas sem vínculo
- Contadores por papel (LEAD, CLIENTE, FORNECEDOR, PARCEIRO)

## Design System

### Padrão GitHub

- **Cores:**
  - `gh-bg`: Background principal
  - `gh-card`: Cards e containers
  - `gh-border`: Bordas
  - `gh-hover`: Accent color (azul GitHub)
  - `gh-text`: Texto principal
  - `gh-text-secondary`: Texto secundário

- **Componentes:**
  - Sidebar com highlight do item ativo
  - Badges com contadores
  - Inputs com focus ring azul
  - Botões com estados hover/disabled
  - Cards com hover effect

## Exemplo de Uso

### Cenário: Nova Oportunidade

1. Recebe contato de potencial cliente
2. Acessa `/persons/new`
3. Cria pessoa com dados básicos
4. Pessoa aparece em "Sem Vínculo"
5. Acessa detalhes da pessoa
6. Adiciona papel "LEAD"
7. Pessoa agora aparece em "Leads"
8. Fecha negócio
9. Adiciona papel "CLIENTE"
10. Pessoa aparece tanto em "Leads" quanto em "Clientes"

### Cenário: Fornecedor que vira Cliente

1. Pessoa já cadastrada como FORNECEDOR
2. Decide comprar produtos/serviços
3. Acessa detalhes da pessoa
4. Adiciona papel "CLIENTE"
5. Pessoa agora tem dois papéis
6. Aparece tanto em "Fornecedores" quanto em "Clientes"

## Benefícios da Nova Estrutura

1. **Navegação Intuitiva**
   - Menu sempre visível
   - Contadores em tempo real
   - Filtros rápidos

2. **Organização Clara**
   - Separação por papel
   - Identificação de pendências (sem vínculo)
   - Visão completa ou filtrada

3. **Flexibilidade**
   - Múltiplos papéis por pessoa
   - Evolução natural (Lead → Cliente)
   - Relacionamentos complexos

4. **Consistência Visual**
   - Padrão GitHub reconhecível
   - Interface limpa e profissional
   - Responsivo e acessível

## Próximos Passos

- [ ] Implementar gestão de papéis na página de detalhes
- [ ] Adicionar bulk actions (ações em lote)
- [ ] Criar filtros avançados
- [ ] Implementar tags customizáveis
- [ ] Adicionar histórico de interações
