/**
 * Utilitários para formatação e validação de CPF e CNPJ
 * CNPJ (após Ana - Lei 13.874/2019) aceita letras, números e caracteres especiais
 */

/**
 * Formata CPF: XXX.XXX.XXX-XX
 * @param value - CPF sem formatação ou com formatação
 * @returns CPF formatado ou valor original se inválido
 */
export function formatCPF(value: string): string {
  if (!value) return "";

  // Remove tudo que não é número
  const cleanValue = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  if (cleanValue.length > 11) {
    return cleanValue
      .slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  // Formata conforme digita
  return cleanValue
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

/**
 * Formata CNPJ: XX.XXX.XXX/XXXX-XX
 * Agora suporta letras (Ana - Lei 13.874/2019)
 * @param value - CNPJ sem formatação ou com formatação
 * @returns CNPJ formatado ou valor original se inválido
 */
export function formatCNPJ(value: string): string {
  if (!value) return "";

  // Remove apenas espaços e tudo que não seja número/letra
  const cleanValue = value.replace(/[^\w]/g, "").toUpperCase();

  // Limita a 14 caracteres
  if (cleanValue.length > 14) {
    return cleanValue
      .slice(0, 14)
      .replace(/(\w{2})(\w)/, "$1.$2")
      .replace(/(\w{2})\.(\w{3})(\w)/, "$1.$2.$3")
      .replace(/(\w{2})\.(\w{3})\.(\w{3})(\w)/, "$1.$2.$3/$4")
      .replace(/(\w{2})\.(\w{3})\.(\w{3})\/(\w{4})(\w)/, "$1.$2.$3/$4-$5");
  }

  // Formata conforme digita
  return cleanValue
    .replace(/(\w{2})(\w)/, "$1.$2")
    .replace(/(\w{2})\.(\w{3})(\w)/, "$1.$2.$3")
    .replace(/(\w{2})\.(\w{3})\.(\w{3})(\w)/, "$1.$2.$3/$4")
    .replace(/(\w{2})\.(\w{3})\.(\w{3})\/(\w{4})(\w)/, "$1.$2.$3/$4-$5");
}

/**
 * Remove máscara de CPF
 * @param value - CPF formatado
 * @returns CPF sem formatação (apenas números)
 */
export function removeCPFMask(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Remove máscara de CNPJ
 * @param value - CNPJ formatado
 * @returns CNPJ sem formatação (apenas alfanuméricos)
 */
export function removeCNPJMask(value: string): string {
  return value.replace(/[^\w]/g, "").toUpperCase();
}

/**
 * Valida CPF (verifica dígitos verificadores)
 * @param cpf - CPF sem formatação
 * @returns true se válido
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Calcula primeiro dígito verificador
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

/**
 * Valida CNPJ básico (verifica estrutura)
 * @param cnpj - CNPJ sem formatação
 * @returns true se válido
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/[^\w]/g, "").toUpperCase();

  // Verifica se tem 14 caracteres
  if (cleanCNPJ.length !== 14) return false;

  // Nota: CNPJ com letras (Ana) não tem validação padrão de dígito verificador
  // Esta função apenas verifica estrutura básica
  // Para validação completa, consulte a Receita Federal

  return true;
}

/**
 * Detecta se é CPF ou CNPJ
 * @param document - Documento (CPF ou CNPJ)
 * @returns "cpf" | "cnpj" | "unknown"
 */
export function detectDocumentType(
  document: string,
): "cpf" | "cnpj" | "unknown" {
  const clean = document.replace(/\D/g, "");

  if (clean.length === 11) return "cpf";
  if (clean.length === 14) return "cnpj";

  return "unknown";
}

/**
 * Formata documento automaticamente (CPF ou CNPJ)
 * @param value - Documento sem formatação
 * @returns Documento formatado
 */
export function formatDocument(value: string): string {
  const type = detectDocumentType(value);

  if (type === "cpf") {
    return formatCPF(value);
  } else if (type === "cnpj") {
    return formatCNPJ(value);
  }

  return value;
}

/**
 * REtorna documento formatado + tipo (CPF ou CNPJ)
 * @param value - Documento sem formatação
 * @returns Objeto com documento formatado e tipo
 */
export function formatDocumentWithType(value: string): {
  formatted: string;
  type: "cpf" | "cnpj" | "unknown";
} {
  const type = detectDocumentType(value);
  const formatted = formatDocument(value);
  return { formatted, type };
}

/**
 * Remove máscara de documento automaticamente
 * @param value - Documento formatado
 * @returns Documento sem formatação
 */
export function removeDocumentMask(value: string): string {
  const type = detectDocumentType(value);

  if (type === "cpf") {
    return removeCPFMask(value);
  } else if (type === "cnpj") {
    return removeCNPJMask(value);
  }

  return value;
}

/**
 * Formata telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * @param value - Telefone sem formatação
 * @returns Telefone formatado
 */
export function formatPhone(value: string): string {
  if (!value) return "";

  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length > 11) {
    return cleanValue
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{2})(\d{5})(\d)/, "($1) $2-$3");
  }

  return cleanValue
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{2})(\d{4})(\d)/, "($1) $2-$3");
}

/**
 * Remove máscara de telefone
 * @param value - Telefone formatado
 * @returns Telefone sem formatação
 */
export function removePhoneMask(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Formata CEP: XXXXX-XXX
 * @param value - CEP sem formatação
 * @returns CEP formatado
 */
export function formatCEP(value: string): string {
  if (!value) return "";

  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length > 8) {
    return cleanValue.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
  }

  return cleanValue.replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * Remove máscara de CEP
 * @param value - CEP formatado
 * @returns CEP sem formatação
 */
export function removeCEPMask(value: string): string {
  return value.replace(/\D/g, "");
}
