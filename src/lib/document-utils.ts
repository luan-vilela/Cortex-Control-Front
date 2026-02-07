/**
 * Valida CPF usando algoritmo de verificação
 * @param value - String contendo apenas dígitos do CPF
 * @returns boolean indicando se é um CPF válido
 */
export function isValidCpf(value: string): boolean {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false; // Rejeita sequências iguais

  let sum = 0;
  let remainder: number;

  // Primeira verificação
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  // Segunda verificação
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
}

/**
 * Valida CNPJ usando algoritmo de verificação
 * @param value - String contendo apenas dígitos do CNPJ
 * @returns boolean indicando se é um CNPJ válido
 */
export function isValidCnpj(value: string): boolean {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false; // Rejeita sequências iguais

  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  let digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Verifica se documento é válido (CPF ou CNPJ)
 * @param value - String com documento formatado ou não
 * @returns boolean indicando se é válido
 */
export function isValidDocument(value: string): boolean {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 11) return isValidCpf(cleaned);
  if (cleaned.length === 14) return isValidCnpj(cleaned);
  return false;
}

/**
 * Formata CPF ou CNPJ automaticamente com limite de caracteres
 * CPF: 000.000.000-00 (máximo 11 dígitos)
 * CNPJ: 00.000.000/0000-00 (máximo 14 dígitos)
 *
 * @param value - String com números ou parcialmente formatada
 * @returns String formatada como CPF ou CNPJ
 */
export function formatCpfCnpj(value: string): string {
  let cleaned = value.replace(/\D/g, "");

  // Limita o tamanho máximo
  if (cleaned.length > 14) {
    cleaned = cleaned.slice(0, 14);
  }

  if (cleaned.length <= 11) {
    // CPF: 000.000.000-00
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  } else {
    // CNPJ: 00.000.000/0000-00
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5)
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 9)
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    if (cleaned.length <= 12)
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 9)}/${cleaned.slice(9)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 9)}/${cleaned.slice(9, 13)}-${cleaned.slice(13)}`;
  }
}

/**
 * Remove formatação de CPF ou CNPJ
 * @param value - String formatada como CPF ou CNPJ
 * @returns String contendo apenas dígitos
 */
export function unformatCpfCnpj(value: string): string {
  return value.replace(/\D/g, "");
}
