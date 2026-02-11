export function formatCurrency(value: number, locale: string = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date, locale: string = 'pt-BR'): string {
  let d: Date
  if (typeof date === 'string') {
    // Backend returns ISO strings in UTC (e.g., "2026-02-08T00:00:00.000Z")
    // Extract date part (YYYY-MM-DD) to create local date without timezone conversion
    const datePart = date.split('T')[0]
    const [year, month, day] = datePart.split('-').map(Number)
    // Create Date object in local timezone with the extracted date values
    d = new Date(year, month - 1, day)
  } else {
    d = date
  }
  return d.toLocaleDateString(locale)
}
