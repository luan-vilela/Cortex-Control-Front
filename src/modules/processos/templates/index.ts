/**
 * ─── TEMPLATES DE PROCESSOS ─────────────────────────────────
 *
 * Para criar um novo tipo de processo, basta usar createTemplate():
 *
 *   createTemplate({
 *     id: 'conserto-equipamento',
 *     name: 'Conserto de Equipamento',
 *     description: 'Reparo técnico de equipamentos',
 *     type: ProcessType.ATENDIMENTO,
 *     icon: 'Wrench',
 *     color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
 *     fields: [
 *       FIELDS.descricao('Defeito Relatado', 'defeito'),
 *       FIELDS.texto('modelo', 'Modelo do Equipamento', { required: true }),
 *       FIELDS.texto('numero_serie', 'Número de Série'),
 *       FIELDS.prioridade({ required: true }),
 *       FIELDS.prazo('Previsão de Entrega', 'previsao_entrega'),
 *       FIELDS.simNao('garantia', 'Em Garantia?'),
 *     ],
 *   })
 */

import { ProcessType } from '../types'

import { FIELDS } from './fields'

export { FIELDS }

// ─── TIPOS ──────────────────────────────────────────────────

export interface ProcessTemplateField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'boolean'
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
  gridColSpan?: number
}

export interface ProcessTemplate {
  id: string
  name: string
  description: string
  type: ProcessType
  icon: string
  color: string
  obrigatorio: boolean
  impeditivo: boolean
  schema: {
    fields: ProcessTemplateField[]
  }
  /** Configuração padrão de quais seções/campos aparecem na impressão */
  printDefaults: PrintConfig
}

/** Configuração de impressão: quais seções e campos dinâmicos aparecem no documento */
export interface PrintConfig {
  /** Seções fixas do documento */
  sections: {
    header: boolean
    infoGerais: boolean
    envolvidosClientes: boolean
    envolvidosUsuarios: boolean
    endereco: boolean
    dadosProcesso: boolean
    subprocessos: boolean
    assinatura: boolean
    rodape: boolean
  }
  /** Chaves dos campos dinâmicos (do schema) habilitados para impressão. null = todos */
  enabledFields: string[] | null
}

/** Configuração padrão: tudo habilitado */
export const DEFAULT_PRINT_CONFIG: PrintConfig = {
  sections: {
    header: true,
    infoGerais: true,
    envolvidosClientes: true,
    envolvidosUsuarios: true,
    endereco: true,
    dadosProcesso: true,
    subprocessos: true,
    assinatura: true,
    rodape: true,
  },
  enabledFields: null,
}

// ─── HELPER DE CRIAÇÃO ──────────────────────────────────────

interface CreateTemplateConfig {
  id: string
  name: string
  description: string
  type: ProcessType
  icon: string
  color: string
  obrigatorio?: boolean
  impeditivo?: boolean
  fields: ProcessTemplateField[]
  /** Seções/campos habilitados por padrão na impressão. Se omitido, usa DEFAULT_PRINT_CONFIG */
  printDefaults?: Partial<PrintConfig>
}

/**
 * Cria um ProcessTemplate a partir de uma config mínima + blocos de campos.
 * Assim não precisa repetir a estrutura { schema: { fields } } toda vez.
 */
export function createTemplate(config: CreateTemplateConfig): ProcessTemplate {
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    type: config.type,
    icon: config.icon,
    color: config.color,
    obrigatorio: config.obrigatorio ?? false,
    impeditivo: config.impeditivo ?? false,
    schema: {
      fields: config.fields,
    },
    printDefaults: {
      sections: {
        ...DEFAULT_PRINT_CONFIG.sections,
        ...config.printDefaults?.sections,
      },
      enabledFields: config.printDefaults?.enabledFields ?? null,
    },
  }
}

// ─── TEMPLATES ──────────────────────────────────────────────

export const PROCESS_TEMPLATES: ProcessTemplate[] = [
  // ── Atendimento ao Cliente ──────────────────────
  createTemplate({
    id: 'atendimento-cliente',
    name: 'Atendimento ao Cliente',
    description: 'Processo padrão para atendimento e suporte ao cliente',
    type: ProcessType.ATENDIMENTO,
    icon: 'Headphones',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    fields: [
      FIELDS.canalAtendimento(),
      FIELDS.categoriaAtendimento(),
      FIELDS.descricao('Descrição do Atendimento', 'descricao', {
        placeholder: 'Descreva o motivo do atendimento...',
      }),
      FIELDS.prioridade(),
      FIELDS.prazo('Prazo de Resposta', 'prazo_resposta'),
    ],
  }),

  // ── Aprovação Financeira ────────────────────────
  createTemplate({
    id: 'financeiro-aprovacao',
    name: 'Aprovação Financeira',
    description: 'Processo de aprovação de despesas, orçamentos e pagamentos',
    type: ProcessType.FINANCEIRO,
    icon: 'DollarSign',
    color: 'bg-green-50 border-green-200 text-green-700',
    obrigatorio: true,
    impeditivo: true,
    fields: [
      FIELDS.tipoDespesa({ required: true }),
      FIELDS.valor('Valor (R$)', 'valor', { required: true }),
      FIELDS.descricao('Justificativa', 'justificativa', {
        placeholder: 'Explique a necessidade desta despesa...',
      }),
      FIELDS.texto('centro_custo', 'Centro de Custo', {
        placeholder: 'Ex: Marketing, TI, Operações',
      }),
      FIELDS.prazo('Data de Vencimento', 'data_vencimento', { required: true }),
      FIELDS.simNao('nota_fiscal', 'Possui Nota Fiscal?'),
    ],
  }),

  // ── Análise de Contrato ─────────────────────────
  createTemplate({
    id: 'juridico-contrato',
    name: 'Análise de Contrato',
    description: 'Processo de revisão e aprovação de contratos jurídicos',
    type: ProcessType.JURIDICO,
    icon: 'Scale',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    obrigatorio: true,
    impeditivo: true,
    fields: [
      FIELDS.tipoContrato({ required: true }),
      FIELDS.texto('partes_envolvidas', 'Partes Envolvidas', {
        required: true,
        placeholder: 'Nomes das partes do contrato',
      }),
      FIELDS.descricao('Objeto do Contrato', 'objeto', {
        placeholder: 'Descreva o objeto do contrato...',
      }),
      FIELDS.valor('Valor do Contrato (R$)', 'valor_contrato'),
      FIELDS.prazo('Data de Vigência', 'vigencia', { required: true }),
      FIELDS.simNao('clausula_rescisoria', 'Possui Cláusula Rescisória?'),
    ],
  }),

  // ── Controle de Entrega ─────────────────────────
  createTemplate({
    id: 'logistica-entrega',
    name: 'Controle de Entrega',
    description: 'Processo de rastreamento e controle de entregas e expedição',
    type: ProcessType.LOGISTICA,
    icon: 'Truck',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    fields: [
      FIELDS.tipoFrete({ required: true }),
      FIELDS.texto('codigo_rastreio', 'Código de Rastreio', {
        placeholder: 'Ex: BR123456789XX',
      }),
      FIELDS.descricao('Endereço de Entrega', 'endereco_entrega', {
        placeholder: 'Endereço completo de entrega...',
      }),
      FIELDS.prazo('Previsão de Entrega', 'data_previsao', { required: true }),
      FIELDS.numero('peso_kg', 'Peso (kg)', { placeholder: '0.00' }),
      FIELDS.simNao('seguro', 'Possui Seguro?'),
    ],
  }),

  // ── Admissão de Colaborador ─────────────────────
  createTemplate({
    id: 'rh-admissao',
    name: 'Admissão de Colaborador',
    description: 'Processo de onboarding e admissão de novos colaboradores',
    type: ProcessType.RH,
    icon: 'UserPlus',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    obrigatorio: true,
    fields: [
      FIELDS.texto('cargo', 'Cargo', {
        required: true,
        placeholder: 'Ex: Analista de Sistemas',
      }),
      FIELDS.departamento({ required: true }),
      FIELDS.prazo('Data de Admissão', 'data_admissao', { required: true }),
      FIELDS.tipoContratoTrabalho({ required: true }),
      FIELDS.valor('Salário (R$)', 'salario'),
      FIELDS.observacoes('Observações', {
        placeholder: 'Informações adicionais sobre a admissão...',
      }),
    ],
  }),

  // ── Requisição de Material ──────────────────────
  createTemplate({
    id: 'estoque-requisicao',
    name: 'Requisição de Material',
    description: 'Processo de solicitação e controle de materiais do estoque',
    type: ProcessType.ESTOQUE,
    icon: 'Package',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    fields: [
      FIELDS.texto('material', 'Material Solicitado', {
        required: true,
        placeholder: 'Nome ou código do material',
      }),
      FIELDS.numero('quantidade', 'Quantidade', { required: true, placeholder: '0' }),
      FIELDS.descricao('Motivo da Solicitação', 'motivo', {
        placeholder: 'Explique a necessidade do material...',
      }),
      FIELDS.urgencia(),
      FIELDS.prazo('Data de Necessidade', 'data_necessidade'),
    ],
  }),

  // ── Qualificação de Fornecedor ──────────────────
  createTemplate({
    id: 'fornecedor-qualificacao',
    name: 'Qualificação de Fornecedor',
    description: 'Processo de avaliação e qualificação de novos fornecedores',
    type: ProcessType.FORNECEDOR,
    icon: 'Building',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    fields: [
      FIELDS.texto('razao_social', 'Razão Social', {
        required: true,
        placeholder: 'Nome da empresa fornecedora',
      }),
      FIELDS.texto('cnpj', 'CNPJ', {
        required: true,
        placeholder: '00.000.000/0000-00',
      }),
      FIELDS.segmentoAtuacao({ required: true }),
      FIELDS.descricao('Descrição dos Serviços/Produtos', 'descricao_servicos', {
        placeholder: 'Descreva os serviços ou produtos oferecidos...',
      }),
      FIELDS.valor('Valor Estimado Mensal (R$)', 'valor_estimado'),
      FIELDS.texto('contato_referencia', 'Contato de Referência', {
        placeholder: 'Nome e telefone',
      }),
    ],
  }),

  // ── Processo Genérico ───────────────────────────
  createTemplate({
    id: 'processo-generico',
    name: 'Processo Genérico',
    description: 'Processo customizável para fluxos diversos',
    type: ProcessType.OUTRO,
    icon: 'FileText',
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    fields: [
      FIELDS.texto('assunto', 'Assunto', {
        required: true,
        placeholder: 'Assunto do processo',
      }),
      FIELDS.descricao('Descrição', 'descricao', {
        placeholder: 'Descreva o processo...',
      }),
      FIELDS.prazo('Prazo', 'prazo'),
      FIELDS.observacoes(),
    ],
  }),

  // ── Conserto de Equipamento ─────────────────────
  createTemplate({
    id: 'conserto-equipamento',
    name: 'Conserto de Equipamento',
    description:
      'Ordem de serviço para oficinas mecânicas, eletrônicas, celulares e assistências técnicas',
    type: ProcessType.ATENDIMENTO,
    icon: 'Wrench',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    obrigatorio: true,
    printDefaults: {
      sections: {
        header: true,
        infoGerais: true,
        envolvidosClientes: true,
        envolvidosUsuarios: true,
        endereco: true,
        dadosProcesso: true,
        subprocessos: false,
        assinatura: true,
        rodape: true,
      },
      enabledFields: null,
    },
    fields: [
      FIELDS.texto('equipamento', 'Equipamento / Aparelho', {
        required: true,
        placeholder: 'Ex: iPhone 15 Pro Max, Notebook Dell, Motor V8...',
      }),
      FIELDS.texto('marca_modelo', 'Marca / Modelo', {
        required: true,
        placeholder: 'Ex: Apple iPhone 15, Samsung Galaxy S24...',
      }),
      FIELDS.texto('numero_serie', 'Número de Série / IMEI', {
        placeholder: 'Nº de série, IMEI ou identificação do equipamento',
      }),
      FIELDS.descricao('Defeito / Solicitação do Cliente', 'defeito_relatado', {
        required: true,
        placeholder:
          'Descreva o defeito relatado pelo cliente ou a solicitação de serviço...',
      }),
      FIELDS.descricao('Itens / Acessórios Deixados', 'itens_deixados', {
        required: false,
        placeholder:
          'Liste os itens e acessórios entregues junto (carregador, capa, cabos, chaves, peças soltas...)',
      }),
      FIELDS.selecao(
        'estado_aparelho',
        'Estado do Equipamento na Entrada',
        [
          { label: 'Bom estado (apenas defeito relatado)', value: 'bom' },
          { label: 'Marcas de uso visíveis', value: 'marcas_uso' },
          { label: 'Avariado / Danos físicos', value: 'avariado' },
          { label: 'Não liga', value: 'nao_liga' },
        ],
        { required: true }
      ),
      FIELDS.prioridade({ required: true }),
      FIELDS.valor('Orçamento Estimado (R$)', 'orcamento', {
        placeholder: '0,00',
      }),
      FIELDS.prazo('Previsão de Entrega', 'previsao_entrega'),
      FIELDS.simNao('garantia', 'Equipamento em Garantia?'),
      FIELDS.observacoes('Observações Técnicas', {
        placeholder:
          'Observações do técnico sobre o equipamento, condições especiais, etc...',
      }),
    ],
  }),
]
