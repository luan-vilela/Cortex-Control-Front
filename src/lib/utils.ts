import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  locale: string = "pt-BR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(
  date: string | Date,
  locale: string = "pt-BR",
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale);
}

export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
