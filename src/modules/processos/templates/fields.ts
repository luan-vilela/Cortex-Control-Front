/**
 * ─── BLOCOS DE CAMPOS REUTILIZÁVEIS ─────────────────────────
 *
 * Cada bloco é uma função que retorna um ProcessTemplateField.
 * Para criar um novo template, basta compor os blocos:
 *
 *   createTemplate({
 *     id: 'meu-processo',
 *     name: 'Meu Processo',
 *     ...
 *     fields: [
 *       FIELDS.descricao(),
 *       FIELDS.prioridade(),
 *       FIELDS.prazo('Prazo de Entrega'),
 *       FIELDS.valor('Orçamento'),
 *     ],
 *   })
 */

import type { ProcessTemplateField } from './index'

// ─── TEXTOS ─────────────────────────────────────────────────

/** Campo de texto simples (1 coluna) */
export const texto = (
  key: string,
  label: string,
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key,
  label,
  type: 'text',
  required: false,
  ...opts,
})

/** Campo de texto longo / textarea (span 2 por padrão) */
export const descricao = (
  label = 'Descrição',
  key = 'descricao',
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key,
  label,
  type: 'textarea',
  required: true,
  placeholder: `Descreva detalhes...`,
  gridColSpan: 2,
  ...opts,
})

/** Campo de observações (textarea opcional, span 2) */
export const observacoes = (
  label = 'Observações',
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key: 'observacoes',
  label,
  type: 'textarea',
  required: false,
  placeholder: 'Informações adicionais...',
  gridColSpan: 2,
  ...opts,
})

// ─── NUMÉRICOS ──────────────────────────────────────────────

/** Campo de valor monetário (R$) */
export const valor = (
  label = 'Valor (R$)',
  key = 'valor',
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key,
  label,
  type: 'number',
  required: false,
  placeholder: '0,00',
  ...opts,
})

/** Campo numérico genérico */
export const numero = (
  key: string,
  label: string,
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key,
  label,
  type: 'number',
  required: false,
  placeholder: '0',
  ...opts,
})

// ─── DATAS ──────────────────────────────────────────────────

/** Campo de prazo / data genérica */
export const prazo = (
  label = 'Prazo',
  key = 'prazo',
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key,
  label,
  type: 'date',
  required: false,
  ...opts,
})

// ─── BOOLEAN ────────────────────────────────────────────────

/** Campo sim/não (checkbox) */
export const simNao = (
  key: string,
  label: string,
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key,
  label,
  type: 'boolean',
  required: false,
  ...opts,
})

// ─── SELECTS ────────────────────────────────────────────────

/** Campo select genérico */
export const selecao = (
  key: string,
  label: string,
  options: { label: string; value: string }[],
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField => ({
  key,
  label,
  type: 'select',
  required: false,
  options,
  ...opts,
})

// ─── SELECTS PRÉ-DEFINIDOS (blocos prontos) ─────────────────

/** Prioridade (Baixa → Urgente) */
export const prioridade = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'prioridade',
    'Prioridade',
    [
      { label: 'Baixa', value: 'baixa' },
      { label: 'Média', value: 'media' },
      { label: 'Alta', value: 'alta' },
      { label: 'Urgente', value: 'urgente' },
    ],
    opts
  )

/** Urgência (Normal → Crítico) */
export const urgencia = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'urgencia',
    'Urgência',
    [
      { label: 'Normal', value: 'normal' },
      { label: 'Urgente', value: 'urgente' },
      { label: 'Crítico', value: 'critico' },
    ],
    opts
  )

/** Canal de atendimento */
export const canalAtendimento = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'canal',
    'Canal de Atendimento',
    [
      { label: 'Telefone', value: 'telefone' },
      { label: 'Email', value: 'email' },
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Chat', value: 'chat' },
      { label: 'Presencial', value: 'presencial' },
    ],
    { required: true, ...opts }
  )

/** Categoria de atendimento */
export const categoriaAtendimento = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'categoria',
    'Categoria',
    [
      { label: 'Dúvida', value: 'duvida' },
      { label: 'Reclamação', value: 'reclamacao' },
      { label: 'Solicitação', value: 'solicitacao' },
      { label: 'Elogio', value: 'elogio' },
      { label: 'Sugestão', value: 'sugestao' },
    ],
    { required: true, ...opts }
  )

/** Tipo de despesa (financeiro) */
export const tipoDespesa = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'tipo_despesa',
    'Tipo de Despesa',
    [
      { label: 'Compra de Material', value: 'material' },
      { label: 'Serviço Terceirizado', value: 'servico' },
      { label: 'Investimento', value: 'investimento' },
      { label: 'Reembolso', value: 'reembolso' },
      { label: 'Pagamento Recorrente', value: 'recorrente' },
    ],
    { required: true, ...opts }
  )

/** Tipo de contrato */
export const tipoContrato = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'tipo_contrato',
    'Tipo de Contrato',
    [
      { label: 'Prestação de Serviço', value: 'servico' },
      { label: 'Fornecimento', value: 'fornecimento' },
      { label: 'Trabalhista', value: 'trabalhista' },
      { label: 'Locação', value: 'locacao' },
      { label: 'Parceria', value: 'parceria' },
      { label: 'NDA', value: 'nda' },
    ],
    { required: true, ...opts }
  )

/** Tipo de frete */
export const tipoFrete = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'tipo_frete',
    'Tipo de Frete',
    [
      { label: 'CIF (por conta do remetente)', value: 'cif' },
      { label: 'FOB (por conta do destinatário)', value: 'fob' },
      { label: 'Próprio', value: 'proprio' },
      { label: 'Retirada', value: 'retirada' },
    ],
    { required: true, ...opts }
  )

/** Departamento */
export const departamento = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'departamento',
    'Departamento',
    [
      { label: 'Tecnologia', value: 'tecnologia' },
      { label: 'Comercial', value: 'comercial' },
      { label: 'Financeiro', value: 'financeiro' },
      { label: 'Operações', value: 'operacoes' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'RH', value: 'rh' },
    ],
    { required: true, ...opts }
  )

/** Tipo de contrato trabalhista */
export const tipoContratoTrabalho = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'tipo_contrato',
    'Tipo de Contrato',
    [
      { label: 'CLT', value: 'clt' },
      { label: 'PJ', value: 'pj' },
      { label: 'Estágio', value: 'estagio' },
      { label: 'Temporário', value: 'temporario' },
    ],
    { required: true, ...opts }
  )

/** Segmento de atuação (fornecedores) */
export const segmentoAtuacao = (
  opts?: Partial<ProcessTemplateField>
): ProcessTemplateField =>
  selecao(
    'segmento',
    'Segmento de Atuação',
    [
      { label: 'Serviços', value: 'servicos' },
      { label: 'Indústria', value: 'industria' },
      { label: 'Comércio', value: 'comercio' },
      { label: 'Tecnologia', value: 'tecnologia' },
      { label: 'Logística', value: 'logistica' },
    ],
    { required: true, ...opts }
  )

// ─── EXPORT AGRUPADO ────────────────────────────────────────

export const FIELDS = {
  // Primitivos
  texto,
  descricao,
  observacoes,
  valor,
  numero,
  prazo,
  simNao,
  selecao,
  // Prontos
  prioridade,
  urgencia,
  canalAtendimento,
  categoriaAtendimento,
  tipoDespesa,
  tipoContrato,
  tipoFrete,
  departamento,
  tipoContratoTrabalho,
  segmentoAtuacao,
}
