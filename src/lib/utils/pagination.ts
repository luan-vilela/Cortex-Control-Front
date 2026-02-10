/**
 * Gera um array de números de página com "..." para intervalos grandes
 * @example rangeWithDots(1, 10, 2) -> [1, '...', 8, 9, 10]
 */
export function rangeWithDots(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | string)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const range: (number | string)[] = []

  // Sempre mostra a primeira página
  range.push(1)

  // Calcula o início e fim do range visível
  const start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages - 1, start + maxVisible - 3)

  // Adiciona "..." se necessário antes do range
  if (start > 2) {
    range.push('...')
  }

  // Adiciona as páginas do range
  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  // Adiciona "..." se necessário após o range
  if (end < totalPages - 1) {
    range.push('...')
  }

  // Sempre mostra a última página (se não for 1)
  if (totalPages > 1) {
    range.push(totalPages)
  }

  return range
}

export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5 // Maximum number of page buttons to show
  const rangeWithDots: (number | string)[] = []

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    // Always show first page
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    }
  }

  return rangeWithDots
}
