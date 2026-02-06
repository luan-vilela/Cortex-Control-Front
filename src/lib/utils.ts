/**
 * Gera um ID único usando crypto.randomUUID()
 * @returns String UUID v4
 */
export function generateUniqueId(): string {
  return crypto.randomUUID();
}

/**
 * Formata um valor numérico como moeda (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata uma data para o padrão pt-BR
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
