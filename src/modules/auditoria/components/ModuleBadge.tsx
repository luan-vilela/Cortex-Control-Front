import { Badge } from '@/components/ui/badge'

interface ModuleBadgeProps {
  module: string
  feature?: string
}

export function ModuleBadge({ module, feature }: ModuleBadgeProps) {
  const moduleLabels: Record<string, string> = {
    financeiro: 'Financeiro',
    contatos: 'Contatos',
    'ordem-servico': 'Ordem de Serviço',
    workspace: 'Workspace',
    auth: 'Autenticação',
  }

  const featureLabels: Record<string, string> = {
    'controle-contas': 'Controle de Contas',
    'fluxo-caixa': 'Fluxo de Caixa',
    recorrencias: 'Recorrências',
    clientes: 'Clientes',
    fornecedores: 'Fornecedores',
    parceiros: 'Parceiros',
    leads: 'Leads',
    agendamentos: 'Agendamentos',
    execucao: 'Execução',
  }

  const moduleLabel = moduleLabels[module] || module
  const featureLabel = feature ? featureLabels[feature] || feature : null

  return (
    <div className="flex items-center gap-1">
      <Badge variant="outline">{moduleLabel}</Badge>
      {featureLabel && (
        <>
          <span className="text-muted-foreground text-xs">→</span>
          <Badge variant="secondary" className="text-xs">
            {featureLabel}
          </Badge>
        </>
      )}
    </div>
  )
}
