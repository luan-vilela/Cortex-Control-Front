/**
 * Converte automaticamente um objeto de filtros em query string
 * Ignora valores undefined, null e strings vazias
 * Converte booleanos para string
 * Trata automaticamente objetos Date formatando como YYYY-MM-DD
 *
 * @example
 * buildQueryParams({ search: 'test', active: true, entityType: undefined })
 * // Resultado: 'search=test&active=true'
 *
 * @example
 * buildQueryParams({ fromDate: new Date('2024-01-01'), status: 'active' })
 * // Resultado: 'fromDate=2024-01-01&status=active'
 */
export function buildQueryParams(filters?: Record<string, any>): string {
  if (!filters) return ''

  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    // Ignora valores undefined, null e strings vazias
    if (value === undefined || value === null || value === '') {
      return
    }

    // Trata casos especiais
    let stringValue: string

    if (value instanceof Date) {
      // Formata datas como YYYY-MM-DD
      stringValue = value.toISOString().split('T')[0]
    } else {
      // Converte booleanos e outros valores para string
      stringValue = typeof value === 'boolean' ? String(value) : String(value)
    }

    params.append(key, stringValue)
  })

  return params.toString()
}
