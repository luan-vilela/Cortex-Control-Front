'use client'

import { type ProcessTemplate, PROCESS_TEMPLATES } from '../templates'
import { ActorRole, ProcessType, ProcessStatus, type SubProcessPayload } from '../types'

import { useState } from 'react'

import {
  Building,
  ChevronDown,
  ChevronUp,
  DollarSign,
  FileText,
  GitBranch,
  Headphones,
  Package,
  Plus,
  Scale,
  Trash2,
  Truck,
  UserPlus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ContactSearchModal } from '@/modules/contact/components/ContactSearchModal'
import { MemberSearchModal } from '@/modules/workspace/components/MemberSearchModal'

// ─── ÍCONES ───────────────────────────────────────────────

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  Headphones: <Headphones className="h-4 w-4" />,
  DollarSign: <DollarSign className="h-4 w-4" />,
  Scale: <Scale className="h-4 w-4" />,
  Truck: <Truck className="h-4 w-4" />,
  UserPlus: <UserPlus className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  Building: <Building className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
}

// ─── TIPO INTERNO (subprocesso no form) ──────────────────

export interface SubProcessFormItem {
  id: string // id local para key
  template: ProcessTemplate | null
  name: string
  type: ProcessType
  obrigatorio: boolean
  impeditivo: boolean
  contactId: string
  responsibleId: string
  expanded: boolean
}

// ─── PROPS ────────────────────────────────────────────────

interface SubProcessSectionProps {
  workspaceId: string
  subProcesses: SubProcessFormItem[]
  onChange: (subProcesses: SubProcessFormItem[]) => void
}

// ─── COMPONENTE ───────────────────────────────────────────

export function SubProcessSection({
  workspaceId,
  subProcesses,
  onChange,
}: SubProcessSectionProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)

  // Adicionar um novo subprocesso a partir de template
  const handleAddFromTemplate = (template: ProcessTemplate) => {
    const newSub: SubProcessFormItem = {
      id: crypto.randomUUID(),
      template,
      name: template.name,
      type: template.type,
      obrigatorio: template.obrigatorio,
      impeditivo: template.impeditivo,
      contactId: '',
      responsibleId: '',
      expanded: true,
    }
    onChange([...subProcesses, newSub])
    setShowTemplateSelector(false)
  }

  // Adicionar subprocesso vazio (sem template)
  const handleAddEmpty = () => {
    const newSub: SubProcessFormItem = {
      id: crypto.randomUUID(),
      template: null,
      name: '',
      type: ProcessType.OUTRO,
      obrigatorio: false,
      impeditivo: false,
      contactId: '',
      responsibleId: '',
      expanded: true,
    }
    onChange([...subProcesses, newSub])
    setShowTemplateSelector(false)
  }

  // Remover subprocesso
  const handleRemove = (id: string) => {
    onChange(subProcesses.filter((s) => s.id !== id))
  }

  // Atualizar campo de um subprocesso
  const handleUpdate = (id: string, field: keyof SubProcessFormItem, value: any) => {
    onChange(
      subProcesses.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  // Toggle expand/collapse
  const handleToggleExpand = (id: string) => {
    onChange(
      subProcesses.map((s) =>
        s.id === id ? { ...s, expanded: !s.expanded } : s
      )
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-indigo-500" />
          <h3 className="text-gh-text font-semibold">Subprocessos</h3>
          {subProcesses.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {subProcesses.length}
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowTemplateSelector(!showTemplateSelector)}
        >
          <Plus className="mr-1 h-3 w-3" />
          Adicionar
        </Button>
      </div>

      <p className="text-gh-text-secondary text-xs">
        Adicione subprocessos que serão criados automaticamente junto com o processo pai.
      </p>

      {/* Seletor de template para novo subprocesso */}
      {showTemplateSelector && (
        <div className="space-y-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 p-4 dark:border-indigo-700 dark:bg-indigo-950/20">
          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            Escolha um template ou crie em branco:
          </p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {PROCESS_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleAddFromTemplate(tpl)}
                className={`flex items-center gap-2 rounded-md border p-2 text-left text-xs transition-all hover:shadow-sm ${tpl.color}`}
              >
                {TEMPLATE_ICONS[tpl.icon]}
                <span className="font-medium">{tpl.name}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddEmpty}
              className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 p-2 text-left text-xs text-gray-500 transition-all hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Em branco</span>
            </button>
          </div>
        </div>
      )}

      {/* Lista de subprocessos adicionados */}
      {subProcesses.length > 0 && (
        <div className="space-y-3">
          {subProcesses.map((sub, idx) => (
            <div
              key={sub.id}
              className="rounded-lg border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/30"
            >
              {/* Header do subprocesso */}
              <div className="flex items-center justify-between p-3">
                <button
                  type="button"
                  onClick={() => handleToggleExpand(sub.id)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  {sub.expanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-xs font-medium text-gray-500">#{idx + 1}</span>
                  {sub.template && (
                    <span
                      className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${sub.template.color}`}
                    >
                      {TEMPLATE_ICONS[sub.template.icon]}
                      {sub.template.name}
                    </span>
                  )}
                  <span className="text-gh-text text-sm font-medium">
                    {sub.name || 'Sem nome'}
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(sub.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Conteúdo expandido */}
              {sub.expanded && (
                <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-700">
                  {/* Nome */}
                  <div>
                    <Label className="text-xs">Nome do Subprocesso</Label>
                    <Input
                      value={sub.name}
                      onChange={(e) => handleUpdate(sub.id, 'name', e.target.value)}
                      placeholder="Nome do subprocesso"
                      className="mt-1"
                    />
                  </div>

                  {/* Tipo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Tipo</Label>
                      <Select
                        value={sub.type}
                        onValueChange={(v) =>
                          handleUpdate(sub.id, 'type', v as ProcessType)
                        }
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ProcessType.ATENDIMENTO}>Atendimento</SelectItem>
                          <SelectItem value={ProcessType.FINANCEIRO}>Financeiro</SelectItem>
                          <SelectItem value={ProcessType.ESTOQUE}>Estoque</SelectItem>
                          <SelectItem value={ProcessType.FORNECEDOR}>Fornecedor</SelectItem>
                          <SelectItem value={ProcessType.LOGISTICA}>Logística</SelectItem>
                          <SelectItem value={ProcessType.JURIDICO}>Jurídico</SelectItem>
                          <SelectItem value={ProcessType.RH}>RH</SelectItem>
                          <SelectItem value={ProcessType.OUTRO}>Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Flags */}
                    <div className="flex items-end gap-4 pb-1">
                      <label className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={sub.obrigatorio}
                          onChange={(e) =>
                            handleUpdate(sub.id, 'obrigatorio', e.target.checked)
                          }
                          className="rounded"
                        />
                        Obrigatório
                      </label>
                      <label className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={sub.impeditivo}
                          onChange={(e) =>
                            handleUpdate(sub.id, 'impeditivo', e.target.checked)
                          }
                          className="rounded"
                        />
                        Impeditivo
                      </label>
                    </div>
                  </div>

                  {/* Atores */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Solicitante (Contato)</Label>
                      <ContactSearchModal
                        workspaceId={workspaceId}
                        value={sub.contactId}
                        onChange={(v) => handleUpdate(sub.id, 'contactId', v)}
                        placeholder="Selecione..."
                        className="mt-1 w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Responsável (Membro)</Label>
                      <MemberSearchModal
                        workspaceId={workspaceId}
                        value={sub.responsibleId}
                        onChange={(v) => handleUpdate(sub.id, 'responsibleId', v)}
                        placeholder="Selecione..."
                        className="mt-1 w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {subProcesses.length === 0 && !showTemplateSelector && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <GitBranch className="h-8 w-8 text-gray-300" />
          <p className="text-xs text-gray-400">
            Nenhum subprocesso adicionado. Clique em &quot;Adicionar&quot; para vincular
            subprocessos ao processo pai.
          </p>
        </div>
      )}
    </div>
  )
}
