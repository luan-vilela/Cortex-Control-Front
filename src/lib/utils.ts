/**
 * Gera um ID único usando crypto.randomUUID()
 * @returns String UUID v4
 */
export function generateUniqueId(): string {
  return crypto.randomUUID();
}
