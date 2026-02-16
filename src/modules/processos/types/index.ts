export enum ProcessStatus {
  ABERTO = 'ABERTO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PENDENTE = 'PENDENTE',
  BLOQUEADO = 'BLOQUEADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

export enum ProcessType {
  ATENDIMENTO = 'ATENDIMENTO',
  FINANCEIRO = 'FINANCEIRO',
  ESTOQUE = 'ESTOQUE',
  FORNECEDOR = 'FORNECEDOR',
  LOGISTICA = 'LOGISTICA',
  JURIDICO = 'JURIDICO',
  RH = 'RH',
  OUTRO = 'OUTRO',
}

export enum ActorRole {
  APROVADOR = 'APROVADOR',
  EXECUTOR = 'EXECUTOR',
  SOLICITANTE = 'SOLICITANTE',
  OBSERVADOR = 'OBSERVADOR',
  RESPONSAVEL = 'RESPONSAVEL',
}

export interface ProcessActor {
  id: string
  processId: string
  actorId: string
  actorType: string
  responsavel: boolean
  papel: ActorRole
  createdAt: string
}

export interface Process {
  id: string
  workspaceId: string
  name: string
  type: ProcessType
  status: ProcessStatus
  schema: Record<string, any> | null
  data: Record<string, any> | null
  gridRow: number | null
  gridColStart: number | null
  gridColSpan: number | null
  gridRowSpan: number | null
  obrigatorio: boolean
  impeditivo: boolean
  parentId: string | null
  parent?: Process | null
  children: Process[]
  actors: ProcessActor[]
  createdAt: string
  updatedAt: string
  closedAt: string | null
}

export interface SubProcessActorPayload {
  actorId: string
  actorType: string
  responsavel?: boolean
  papel?: ActorRole
}

export interface SubProcessPayload {
  name: string
  type?: ProcessType
  status?: ProcessStatus
  schema?: Record<string, any>
  data?: Record<string, any>
  obrigatorio?: boolean
  impeditivo?: boolean
  actors?: SubProcessActorPayload[]
}

export interface CreateProcessPayload {
  name: string
  type?: ProcessType
  status?: ProcessStatus
  schema?: Record<string, any>
  data?: Record<string, any>
  gridRow?: number
  gridColStart?: number
  gridColSpan?: number
  gridRowSpan?: number
  obrigatorio?: boolean
  impeditivo?: boolean
  parentId?: string
  subProcesses?: SubProcessPayload[]
}

export interface UpdateProcessPayload {
  name?: string
  type?: ProcessType
  status?: ProcessStatus
  schema?: Record<string, any>
  data?: Record<string, any>
  gridRow?: number
  gridColStart?: number
  gridColSpan?: number
  gridRowSpan?: number
  obrigatorio?: boolean
  impeditivo?: boolean
  parentId?: string
}

export interface CreateProcessActorPayload {
  actorId: string
  actorType: string
  responsavel?: boolean
  papel?: ActorRole
}

export interface UpdateProcessActorPayload {
  responsavel?: boolean
  papel?: ActorRole
}

export interface GetProcessesFilters {
  status?: ProcessStatus
  type?: ProcessType
  obrigatorio?: string
  impeditivo?: string
  actorId?: string
  actorType?: string
  search?: string
  rootOnly?: string
  page?: number
  limit?: number
}

export interface GetProcessesResponse {
  data: Process[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
