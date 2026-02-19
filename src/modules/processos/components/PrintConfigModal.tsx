'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Eye,
  EyeOff,
  FileText,
  Info,
  MapPin,
  Printer,
  Settings2,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import type { Process } from '../types'
import type { PrintConfig, ProcessTemplateField } from '../templates'
import { DEFAULT_PRINT_CONFIG, PROCESS_TEMPLATES } from '../templates'
import { generatePrintHTML, PRINT_STYLES } from './ProcessDocument'

// ─── SEÇÕES FIXAS ────────────────────────────────────────────

type SectionKey = keyof PrintConfig['sections']

interface SectionMeta {
  key: SectionKey
  label: string
  description: string
  icon: React.ReactNode
}

const SECTION_META: SectionMeta[] = [
  {
    key: 'header',
    label: 'Cabeçalho',
    description: 'Nome, número, status e tipo',
    icon: <FileText size={14} />,
  },
  {
    key: 'infoGerais',
    label: 'Informações Gerais',
    description: 'Datas e processo pai',
    icon: <Info size={14} />,
  },
  {
    key: 'envolvidosClientes',
    label: 'Clientes / Contatos',
    description: 'Nome, telefones e e-mail dos contatos',
    icon: <Users size={14} />,
  },
  {
    key: 'envolvidosUsuarios',
    label: 'Usuários / Membros',
    description: 'Nome e e-mail dos membros da equipe',
    icon: <Users size={14} />,
  },
  {
    key: 'endereco',
    label: 'Endereço dos Envolvidos',
    description: 'Endereço, cidade e estado',
    icon: <MapPin size={14} />,
  },
  {
    key: 'dadosProcesso',
    label: 'Dados do Processo',
    description: 'Campos do formulário',
    icon: <Settings2 size={14} />,
  },
  {
    key: 'subprocessos',
    label: 'Subprocessos',
    description: 'Filhos com seus dados',
    icon: <FileText size={14} />,
  },
  {
    key: 'assinatura',
    label: 'Assinatura',
    description: 'Linhas para assinatura',
    icon: <FileText size={14} />,
  },
  {
    key: 'rodape',
    label: 'Rodapé',
    description: 'Nº e data de geração',
    icon: <FileText size={14} />,
  },
]

// ─── PROPS ───────────────────────────────────────────────────

interface PrintConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  processo: Process
  onPrint: (config: PrintConfig) => void
}

// ─── COMPONENTE ──────────────────────────────────────────────

export function PrintConfigModal({
  open,
  onOpenChange,
  processo,
  onPrint,
}: PrintConfigModalProps) {
  const [showPreview, setShowPreview] = useState(true)

  // Buscar template pelo schema
  const template = useMemo(() => {
    const schema = processo.schema as Record<string, any> | null
    if (!schema?.fields || !Array.isArray(schema.fields)) return null
    const fieldKeys = schema.fields.map((f: any) => f.key).sort().join(',')
    return (
      PROCESS_TEMPLATES.find((t) => {
        const tKeys = t.schema.fields.map((f) => f.key).sort().join(',')
        return tKeys === fieldKeys
      }) ?? null
    )
  }, [processo.schema])

  // Campos do schema
  const schemaFields = useMemo((): ProcessTemplateField[] => {
    const schema = processo.schema as Record<string, any> | null
    if (!schema) return []
    if (schema.fields && Array.isArray(schema.fields)) return schema.fields
    return []
  }, [processo.schema])

  // Estado da configuração
  const [config, setConfig] = useState<PrintConfig>(() => {
    const defaults = template?.printDefaults ?? DEFAULT_PRINT_CONFIG
    return {
      sections: { ...defaults.sections },
      enabledFields: defaults.enabledFields ? [...defaults.enabledFields] : null,
    }
  })

  // Re-inicializar quando o modal abre
  useEffect(() => {
    if (open) {
      const defaults = template?.printDefaults ?? DEFAULT_PRINT_CONFIG
      setConfig({
        sections: { ...defaults.sections },
        enabledFields: defaults.enabledFields ? [...defaults.enabledFields] : null,
      })
    }
  }, [open, template])

  // ─── HANDLERS ──────────────────────────────────────────────

  const toggleSection = useCallback((key: SectionKey) => {
    setConfig((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: !prev.sections[key] },
    }))
  }, [])

  const toggleField = useCallback(
    (fieldKey: string) => {
      setConfig((prev) => {
        const allFieldKeys = schemaFields.map((f) => f.key)
        if (prev.enabledFields === null) {
          return { ...prev, enabledFields: allFieldKeys.filter((k) => k !== fieldKey) }
        }
        if (prev.enabledFields.includes(fieldKey)) {
          return { ...prev, enabledFields: prev.enabledFields.filter((k) => k !== fieldKey) }
        }
        const newList = [...prev.enabledFields, fieldKey]
        if (newList.length === allFieldKeys.length) {
          return { ...prev, enabledFields: null }
        }
        return { ...prev, enabledFields: newList }
      })
    },
    [schemaFields]
  )

  const isFieldEnabled = useCallback(
    (fieldKey: string) => {
      if (config.enabledFields === null) return true
      return config.enabledFields.includes(fieldKey)
    },
    [config.enabledFields]
  )

  const enabledSectionCount = Object.values(config.sections).filter(Boolean).length
  const totalSections = Object.keys(config.sections).length
  const enabledFieldCount =
    config.enabledFields === null ? schemaFields.length : config.enabledFields.length

  const handleSelectAll = () => {
    setConfig({
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
    })
  }

  const handleDeselectAll = () => {
    setConfig({
      sections: {
        header: true,
        infoGerais: false,
        envolvidosClientes: false,
        envolvidosUsuarios: false,
        endereco: false,
        dadosProcesso: false,
        subprocessos: false,
        assinatura: false,
        rodape: false,
      },
      enabledFields: [],
    })
  }

  // ─── PREVIEW HTML (reativo à config) ──────────────────────

  const previewHtml = useMemo(() => {
    const bodyHtml = generatePrintHTML(processo, config)
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    ${PRINT_STYLES}
    body { background: #fff; transform-origin: top left; }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`
  }, [processo, config])

  // ─── RENDER ────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-h-[90vh] p-0 gap-0 transition-all duration-200 ${
          showPreview ? 'sm:max-w-5xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="flex h-[80vh] max-h-[80vh]">
          {/* ── PAINEL ESQUERDO: Configurações ────────── */}
          <div
            className={`flex flex-col min-h-0 ${
              showPreview ? 'w-[380px] min-w-[380px]' : 'w-full'
            } border-r`}
          >
            <div className="px-6 pt-6 pb-3">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <Settings2 size={18} />
                  Configuração de Impressão
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Selecione o que incluir no documento.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Ações rápidas */}
            <div className="flex items-center justify-between px-6 pb-2">
              <span className="text-xs text-muted-foreground">
                {enabledSectionCount}/{totalSections} seções
                {schemaFields.length > 0 && ` · ${enabledFieldCount}/${schemaFields.length} campos`}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={handleSelectAll}>
                  Tudo
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={handleDeselectAll}>
                  Limpar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 gap-1"
                  onClick={() => setShowPreview((v) => !v)}
                >
                  {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPreview ? 'Ocultar' : 'Preview'}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Lista de seções + campos scrollável */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 py-3 space-y-1">
                {/* Seções */}
                <h4 className="text-xs font-medium text-muted-foreground mb-1 px-2">
                  Seções do Documento
                </h4>
                {SECTION_META.map((section) => (
                  <label
                    key={section.key}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-muted-foreground shrink-0">{section.icon}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium leading-tight">{section.label}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight truncate">
                          {section.description}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={config.sections[section.key]}
                      onCheckedChange={() => toggleSection(section.key)}
                    />
                  </label>
                ))}

                {/* Campos dinâmicos */}
                {config.sections.dadosProcesso && schemaFields.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 px-2">
                      Campos do Formulário
                    </h4>
                    {schemaFields.map((field) => {
                      const hasData =
                        processo.data &&
                        (processo.data as Record<string, any>)[field.key] != null
                      return (
                        <label
                          key={field.key}
                          className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{field.label}</span>
                            {!hasData && (
                              <span className="text-[10px] text-muted-foreground bg-muted px-1 py-0.5 rounded">
                                vazio
                              </span>
                            )}
                          </div>
                          <Switch
                            checked={isFieldEnabled(field.key)}
                            onCheckedChange={() => toggleField(field.key)}
                          />
                        </label>
                      )
                    })}
                  </>
                )}
              </div>
            </ScrollArea>

            <Separator />

            {/* Footer com botões */}
            <div className="px-6 py-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={() => onPrint(config)} className="gap-2">
                <Printer size={14} />
                Imprimir
              </Button>
            </div>
          </div>

          {/* ── PAINEL DIREITO: Preview ao vivo ───────── */}
          {showPreview && (
            <div className="flex-1 flex flex-col min-w-0 bg-muted/30">
              <div className="px-4 py-3 flex items-center gap-2 border-b bg-muted/50">
                <Eye size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Preview do Documento
                </span>
              </div>
              <div className="flex-1 p-3 min-h-0 overflow-auto">
                <div className="bg-white rounded-md shadow-sm border overflow-hidden h-full">
                  <iframe
                    title="Preview de impressão"
                    srcDoc={previewHtml}
                    className="w-full h-full min-h-[500px] border-0"
                    sandbox="allow-same-origin"
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

