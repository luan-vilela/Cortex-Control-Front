import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge classes com Tailwind merge para evitar conflitos
 * @example cn('px-2', condition && 'px-4') -> 'px-4' (px-2 é sobrescrito)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
