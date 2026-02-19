import type { Process } from '../types'
import type { PrintConfig } from '../templates'

import { formatDate } from '@/lib/utils'

// ─── LABELS ──────────────────────────────────────────────────

const statusLabels: Record<string, string> = {
  ABERTO: 'Aberto',
  EM_ANDAMENTO: 'Em Andamento',
  PENDENTE: 'Pendente',
  BLOQUEADO: 'Bloqueado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

const actorRoleLabels: Record<string, string> = {
  APROVADOR: 'Aprovador',
  EXECUTOR: 'Executor',
  SOLICITANTE: 'Solicitante',
  OBSERVADOR: 'Observador',
  RESPONSAVEL: 'Responsável',
}

const typeLabels: Record<string, string> = {
  ATENDIMENTO: 'Atendimento',
  FINANCEIRO: 'Financeiro',
  ESTOQUE: 'Estoque',
  FORNECEDOR: 'Fornecedor',
  LOGISTICA: 'Logística',
  JURIDICO: 'Jurídico',
  RH: 'RH',
  OUTRO: 'Outro',
}

// ─── PRINT STYLES ────────────────────────────────────────────

export const PRINT_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    color: #1a1a1a;
    padding: 24px;
    line-height: 1.5;
  }
  .header {
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .header h1 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .header-meta {
    display: flex;
    gap: 16px;
    font-size: 11px;
    color: #555;
  }
  .header-meta span { display: flex; gap: 4px; }
  .section {
    margin-bottom: 16px;
    page-break-inside: avoid;
  }
  .section-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 4px;
    margin-bottom: 8px;
    color: #333;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 16px;
  }
  .info-item {
    display: flex;
    gap: 6px;
  }
  .info-label {
    font-weight: 600;
    color: #555;
    min-width: 120px;
    flex-shrink: 0;
  }
  .info-value { color: #1a1a1a; }
  .info-full { grid-column: 1 / -1; }
  .badge {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .badge-status { background: #e8f0fe; color: #1a73e8; }
  .badge-type { background: #f0f0f0; color: #333; }
  .badge-obrigatorio { background: #fff3cd; color: #856404; }
  .badge-impeditivo { background: #f8d7da; color: #721c24; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  table th, table td {
    border: 1px solid #ddd;
    padding: 4px 8px;
    text-align: left;
  }
  table th {
    background: #f5f5f5;
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
  }
  .subprocess {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 10px;
    page-break-inside: avoid;
  }
  .subprocess-header {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .footer {
    margin-top: 32px;
    border-top: 1px solid #ccc;
    padding-top: 12px;
    font-size: 10px;
    color: #888;
    display: flex;
    justify-content: space-between;
  }
  .signature-area {
    margin-top: 48px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }
  .signature-line {
    border-top: 1px solid #1a1a1a;
    padding-top: 4px;
    text-align: center;
    font-size: 11px;
    color: #555;
  }
  .actor-card {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 8px;
    page-break-inside: avoid;
  }
  .actor-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .actor-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
  }
  .actor-detail {
    display: flex;
    gap: 4px;
    font-size: 11px;
    color: #555;
    margin-bottom: 2px;
  }
  .actor-detail-label {
    font-weight: 600;
    min-width: 70px;
    flex-shrink: 0;
  }
  .actor-detail-value {
    color: #1a1a1a;
  }
  @media print {
    body { padding: 16px; }
  }
`

// ─── FUNÇÕES AUXILIARES ──────────────────────────────────────

/** Resolve campos dinâmicos: schema → labels, data → valores */
function resolveDataFields(
  proc: Process,
  enabledFields: string[] | null
): { key: string; label: string; value: string }[] {
  const data = proc.data || {}
  const schema = proc.schema as Record<string, any> | null

  return Object.entries(data)
    .filter(([key]) => {
      if (enabledFields === null) return true
      return enabledFields.includes(key)
    })
    .map(([key, value]) => {
      let label = key
      if (schema) {
        if (schema.fields && Array.isArray(schema.fields)) {
          const field = schema.fields.find((f: any) => f.key === key)
          if (field?.label) label = field.label
        } else if (schema[key]?.label) {
          label = schema[key].label
        }
      }

      let displayValue = ''
      if (typeof value === 'boolean') {
        displayValue = value ? 'Sim' : 'Não'
      } else if (value === null || value === undefined || value === '') {
        displayValue = '—'
      } else {
        displayValue = String(value)
      }

      return { key, label, value: displayValue }
    })
}

// ─── GERADOR DE HTML ─────────────────────────────────────────

export function generatePrintHTML(processo: Process, config: PrintConfig): string {
  const { sections, enabledFields } = config
  const children = processo.children || []
  const actors = processo.actors || []
  const responsaveis = actors.filter((a) => a.responsavel)
  const solicitantes = actors.filter((a) => a.papel === 'SOLICITANTE' && !a.responsavel)
  const parentDataFields = resolveDataFields(processo, enabledFields)

  let html = ''

  // ── HEADER
  if (sections.header) {
    html += `
      <div class="header">
        <h1>${esc(processo.name)}</h1>
        <div class="header-meta">
          <span><strong>Nº:</strong> ${processo.id.slice(0, 8).toUpperCase()}</span>
          <span><span class="badge badge-status">${statusLabels[processo.status] || processo.status}</span></span>
          <span><span class="badge badge-type">${typeLabels[processo.type] || processo.type}</span></span>
          ${processo.obrigatorio ? '<span><span class="badge badge-obrigatorio">Obrigatório</span></span>' : ''}
          ${processo.impeditivo ? '<span><span class="badge badge-impeditivo">Impeditivo</span></span>' : ''}
        </div>
      </div>
    `
  }

  // ── INFORMAÇÕES GERAIS
  if (sections.infoGerais) {
    html += `
      <div class="section">
        <div class="section-title">Informações Gerais</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Criado em:</span>
            <span class="info-value">${formatDate(processo.createdAt)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Atualizado em:</span>
            <span class="info-value">${formatDate(processo.updatedAt)}</span>
          </div>
          ${processo.closedAt ? `
            <div class="info-item">
              <span class="info-label">Encerrado em:</span>
              <span class="info-value">${formatDate(processo.closedAt)}</span>
            </div>
          ` : ''}
          ${processo.parent ? `
            <div class="info-item">
              <span class="info-label">Processo Pai:</span>
              <span class="info-value">${esc(processo.parent.name)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `
  }

  // ── ENVOLVIDOS — CLIENTES / CONTATOS
  const clienteActors = actors.filter((a) => a.actorType === 'person')
  const usuarioActors = actors.filter((a) => a.actorType === 'user')
  const showEndereco = sections.endereco ?? false

  const renderActorCard = (a: typeof actors[0], showAddr: boolean) => {
    const name = a.actorName || a.actorId.slice(0, 8) + '...'
    const papel = actorRoleLabels[a.papel] || a.papel

    const phones =
      a.actorPhones && a.actorPhones.length > 0
        ? a.actorPhones.map((p) => p.number).join(', ')
        : '—'

    const email = a.actorEmail || '—'

    let enderecoHtml = ''
    if (showAddr && a.actorAddress) {
      const parts = [a.actorAddress, a.actorCity, a.actorState].filter(Boolean)
      enderecoHtml = `
        <div class="actor-detail">
          <span class="actor-detail-label">Endereço:</span>
          <span class="actor-detail-value">${esc(parts.join(', '))}</span>
        </div>`
    }

    const docHtml = a.actorDocument
      ? `<div class="actor-detail">
          <span class="actor-detail-label">Documento:</span>
          <span class="actor-detail-value">${esc(a.actorDocument)}</span>
        </div>`
      : ''

    return `
      <div class="actor-card">
        <div class="actor-header">
          <span class="actor-name">${esc(name)}</span>
          <span class="badge badge-status">${esc(papel)}</span>
          ${a.responsavel ? '<span class="badge badge-obrigatorio">Responsável</span>' : ''}
        </div>
        <div class="actor-detail">
          <span class="actor-detail-label">Telefone:</span>
          <span class="actor-detail-value">${esc(phones)}</span>
        </div>
        <div class="actor-detail">
          <span class="actor-detail-label">E-mail:</span>
          <span class="actor-detail-value">${esc(email)}</span>
        </div>
        ${docHtml}
        ${enderecoHtml}
      </div>`
  }

  if (sections.envolvidosClientes && clienteActors.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">Clientes / Contatos</div>
        ${clienteActors.map((a) => renderActorCard(a, showEndereco)).join('')}
      </div>
    `
  }

  if (sections.envolvidosUsuarios && usuarioActors.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">Usuários / Membros</div>
        ${usuarioActors.map((a) => renderActorCard(a, false)).join('')}
      </div>
    `
  }

  // ── DADOS DO PROCESSO
  if (sections.dadosProcesso && parentDataFields.length > 0) {
    const items = parentDataFields
      .map((f) => `
        <div class="info-item ${f.value.length > 60 ? 'info-full' : ''}">
          <span class="info-label">${esc(f.label)}:</span>
          <span class="info-value">${esc(f.value)}</span>
        </div>
      `)
      .join('')

    html += `
      <div class="section">
        <div class="section-title">Dados do Processo</div>
        <div class="info-grid">${items}</div>
      </div>
    `
  }

  // ── SUBPROCESSOS
  if (sections.subprocessos && children.length > 0) {
    const subHtml = children
      .map((child, idx) => {
        const childData = resolveDataFields(child, enabledFields)
        const childActors = child.actors || []

        let c = `
          <div class="subprocess">
            <div class="subprocess-header">
              <span>#${idx + 1}</span>
              <span>${esc(child.name)}</span>
              <span class="badge badge-status">${statusLabels[child.status] || child.status}</span>
              <span class="badge badge-type">${typeLabels[child.type] || child.type}</span>
            </div>
        `

        if (childActors.length > 0) {
          const cCards = childActors
            .map((a) => {
              const cName = a.actorName || a.actorId.slice(0, 8) + '...'
              const cPapel = actorRoleLabels[a.papel] || a.papel
              const cPhones =
                a.actorPhones && a.actorPhones.length > 0
                  ? a.actorPhones.map((p) => p.number).join(', ')
                  : '—'
              const cEmail = a.actorEmail || '—'
              return `<div style="font-size:11px;margin-bottom:4px">
                <strong>${esc(cName)}</strong> · ${esc(cPapel)}${a.responsavel ? ' · <em>Responsável</em>' : ''}
                <br/>Tel: ${esc(cPhones)} · E-mail: ${esc(cEmail)}
              </div>`
            })
            .join('')

          c += `<div style="margin-bottom:8px">${cCards}</div>`
        }

        if (childData.length > 0) {
          c += `<div class="info-grid">${childData
            .map(
              (f) => `
              <div class="info-item ${f.value.length > 60 ? 'info-full' : ''}">
                <span class="info-label">${esc(f.label)}:</span>
                <span class="info-value">${esc(f.value)}</span>
              </div>`
            )
            .join('')}</div>`
        }

        // Nível 2
        if (child.children && child.children.length > 0) {
          const gcHtml = child.children
            .map((gc, gIdx) => {
              const gcData = resolveDataFields(gc, enabledFields)
              return `
                <div style="margin-bottom:6px">
                  <div class="subprocess-header" style="font-size:12px">
                    <span>#${idx + 1}.${gIdx + 1}</span>
                    <span>${esc(gc.name)}</span>
                    <span class="badge badge-status">${statusLabels[gc.status] || gc.status}</span>
                  </div>
                  ${gcData.length > 0 ? `<div class="info-grid">${gcData
                    .map(
                      (f) => `<div class="info-item"><span class="info-label">${esc(f.label)}:</span><span class="info-value">${esc(f.value)}</span></div>`
                    )
                    .join('')}</div>` : ''}
                </div>
              `
            })
            .join('')

          c += `<div style="margin-top:8px;padding-left:12px;border-left:2px solid #ddd">${gcHtml}</div>`
        }

        c += '</div>'
        return c
      })
      .join('')

    html += `
      <div class="section">
        <div class="section-title">Subprocessos (${children.length})</div>
        ${subHtml}
      </div>
    `
  }

  // ── ASSINATURA
  if (sections.assinatura) {
    html += `
      <div class="signature-area">
        <div><div class="signature-line">${solicitantes.length > 0 ? 'Solicitante / Cliente' : 'Responsável 1'}</div></div>
        <div><div class="signature-line">${responsaveis.length > 0 ? 'Responsável Técnico' : 'Responsável 2'}</div></div>
      </div>
    `
  }

  // ── RODAPÉ
  if (sections.rodape) {
    const now = new Date()
    html += `
      <div class="footer">
        <span>Processo #${processo.id.slice(0, 8).toUpperCase()}</span>
        <span>Documento gerado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `
  }

  return html
}

/** Escape HTML para evitar XSS */
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── API PÚBLICA ─────────────────────────────────────────────

/** Abre janela de impressão com o documento gerado conforme a config */
export function openPrintWindow(processo: Process, config: PrintConfig) {
  const bodyHtml = generatePrintHTML(processo, config)

  const printWindow = window.open('', '_blank', 'width=800,height=600')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Processo - ${esc(processo.name)}</title>
      <style>${PRINT_STYLES}</style>
    </head>
    <body>
      ${bodyHtml}
    </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
  }, 250)
}
