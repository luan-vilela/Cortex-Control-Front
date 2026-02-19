'use client'

import * as React from 'react'

import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// ─── TYPES ───────────────────────────────────────────────────

export type PeriodType = 'month' | 'bimonthly' | 'quarterly' | 'semester' | 'annual'

/** @backward-compat alias */
export type Period = PeriodType

export interface PeriodValue {
  periodType: PeriodType
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  label: string // e.g. "Fevereiro 2026"
}

/** @deprecated Use PeriodValue instead */
export interface PeriodDateRange {
  startDate: string
  endDate: string
}

/** @deprecated Kept for backward compat */
export interface PeriodOption {
  value: Period
  label: string
  shortLabel?: string
}

// ─── CONSTANTS ───────────────────────────────────────────────

const PERIOD_TYPE_TABS: { value: PeriodType; label: string }[] = [
  { value: 'month', label: 'Mês' },
  { value: 'bimonthly', label: 'Bimestre' },
  { value: 'quarterly', label: 'Trimestre' },
  { value: 'semester', label: 'Semestre' },
  { value: 'annual', label: 'Ano' },
]

/** @deprecated Use PeriodPicker component instead */
export const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 'month', label: 'Último Mês', shortLabel: 'Mês' },
  { value: 'bimonthly', label: 'Último Bimestre', shortLabel: 'Bimestre' },
  { value: 'quarterly', label: 'Último Trimestre', shortLabel: 'Trimestre' },
  { value: 'semester', label: 'Último Semestre', shortLabel: 'Semestre' },
  { value: 'annual', label: 'Último Ano', shortLabel: 'Anual' },
]

const MONTHS_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const MONTHS_FULL = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

// ─── INTERNAL HELPERS ────────────────────────────────────────

function lastDay(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function fmtDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

interface GridOption {
  label: string
  fullLabel: string
  subtitle?: string
  startDate: string
  endDate: string
}

function monthOpts(year: number): GridOption[] {
  return MONTHS_SHORT.map((short, i) => ({
    label: short,
    fullLabel: `${MONTHS_FULL[i]} ${year}`,
    startDate: fmtDate(year, i, 1),
    endDate: fmtDate(year, i, lastDay(year, i)),
  }))
}

function bimonthlyOpts(year: number): GridOption[] {
  const pairs: [number, number, string][] = [
    [0, 1, 'Jan - Fev'],
    [2, 3, 'Mar - Abr'],
    [4, 5, 'Mai - Jun'],
    [6, 7, 'Jul - Ago'],
    [8, 9, 'Set - Out'],
    [10, 11, 'Nov - Dez'],
  ]
  return pairs.map(([s, e, label]) => ({
    label,
    fullLabel: `${label} ${year}`,
    startDate: fmtDate(year, s, 1),
    endDate: fmtDate(year, e, lastDay(year, e)),
  }))
}

function quarterlyOpts(year: number): GridOption[] {
  return [
    { n: 1, s: 0, e: 2, sub: 'Jan - Mar' },
    { n: 2, s: 3, e: 5, sub: 'Abr - Jun' },
    { n: 3, s: 6, e: 8, sub: 'Jul - Set' },
    { n: 4, s: 9, e: 11, sub: 'Out - Dez' },
  ].map(({ n, s, e, sub }) => ({
    label: `${n}º Tri`,
    fullLabel: `${n}º Trimestre ${year}`,
    subtitle: sub,
    startDate: fmtDate(year, s, 1),
    endDate: fmtDate(year, e, lastDay(year, e)),
  }))
}

function semesterOpts(year: number): GridOption[] {
  return [
    { n: 1, s: 0, e: 5, sub: 'Jan - Jun' },
    { n: 2, s: 6, e: 11, sub: 'Jul - Dez' },
  ].map(({ n, s, e, sub }) => ({
    label: `${n}º Sem`,
    fullLabel: `${n}º Semestre ${year}`,
    subtitle: sub,
    startDate: fmtDate(year, s, 1),
    endDate: fmtDate(year, e, lastDay(year, e)),
  }))
}

function annualOpts(centerYear: number): GridOption[] {
  const start = Math.floor(centerYear / 10) * 10
  return Array.from({ length: 12 }, (_, i) => {
    const y = start + i
    return {
      label: String(y),
      fullLabel: String(y),
      startDate: fmtDate(y, 0, 1),
      endDate: fmtDate(y, 11, lastDay(y, 11)),
    }
  })
}

function getGridOptions(type: PeriodType, year: number): GridOption[] {
  switch (type) {
    case 'month':
      return monthOpts(year)
    case 'bimonthly':
      return bimonthlyOpts(year)
    case 'quarterly':
      return quarterlyOpts(year)
    case 'semester':
      return semesterOpts(year)
    case 'annual':
      return annualOpts(year)
  }
}

const GRID_COLS: Record<PeriodType, string> = {
  month: 'grid-cols-4',
  bimonthly: 'grid-cols-3',
  quarterly: 'grid-cols-2',
  semester: 'grid-cols-2',
  annual: 'grid-cols-4',
}

// ─── PUBLIC UTILITIES ────────────────────────────────────────

/** Creates a PeriodValue for the current date with the given period type */
export function getDefaultPeriodValue(periodType: PeriodType = 'month'): PeriodValue {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  switch (periodType) {
    case 'month':
      return {
        periodType,
        startDate: fmtDate(y, m, 1),
        endDate: fmtDate(y, m, lastDay(y, m)),
        label: `${MONTHS_FULL[m]} ${y}`,
      }
    case 'bimonthly': {
      const bi = Math.floor(m / 2) * 2
      return {
        periodType,
        startDate: fmtDate(y, bi, 1),
        endDate: fmtDate(y, bi + 1, lastDay(y, bi + 1)),
        label: `${MONTHS_SHORT[bi]} - ${MONTHS_SHORT[bi + 1]} ${y}`,
      }
    }
    case 'quarterly': {
      const q = Math.floor(m / 3)
      const qs = q * 3
      return {
        periodType,
        startDate: fmtDate(y, qs, 1),
        endDate: fmtDate(y, qs + 2, lastDay(y, qs + 2)),
        label: `${q + 1}º Trimestre ${y}`,
      }
    }
    case 'semester': {
      const s = Math.floor(m / 6)
      const ss = s * 6
      return {
        periodType,
        startDate: fmtDate(y, ss, 1),
        endDate: fmtDate(y, ss + 5, lastDay(y, ss + 5)),
        label: `${s + 1}º Semestre ${y}`,
      }
    }
    case 'annual':
      return {
        periodType,
        startDate: fmtDate(y, 0, 1),
        endDate: fmtDate(y, 11, lastDay(y, 11)),
        label: String(y),
      }
  }
}

/** @deprecated Use getDefaultPeriodValue or PeriodPicker instead */
export function computePeriodDateRange(period: Period): PeriodDateRange {
  const v = getDefaultPeriodValue(period)
  return { startDate: v.startDate, endDate: v.endDate }
}

/** @deprecated Use PeriodPicker component instead */
export function getPeriodLabel(period: Period, short = false): string {
  const opt = PERIOD_OPTIONS.find((o) => o.value === period)
  if (!opt) return period
  return short ? (opt.shortLabel || opt.label) : opt.label
}

// ─── MAIN COMPONENT: PeriodPicker ────────────────────────────

interface PeriodPickerProps {
  value?: PeriodValue
  onValueChange?: (value: PeriodValue) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * PeriodPicker — Seletor interativo de período com calendário.
 *
 * Abre um popover com abas (Mês, Bimestre, Trimestre, Semestre, Ano),
 * navegação de ano, e um grid para escolher o período exato.
 *
 * @example
 * ```tsx
 * const [period, setPeriod] = useState(() => getDefaultPeriodValue('month'))
 * <PeriodPicker value={period} onValueChange={setPeriod} />
 * ```
 */
export function PeriodPicker({
  value,
  onValueChange,
  placeholder = 'Selecionar período',
  disabled = false,
  className,
}: PeriodPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [activeType, setActiveType] = React.useState<PeriodType>(value?.periodType || 'month')
  const [year, setYear] = React.useState(() => {
    if (value?.startDate) return parseInt(value.startDate.split('-')[0])
    return new Date().getFullYear()
  })

  // Sync internal state when popover opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && value) {
      setActiveType(value.periodType)
      setYear(parseInt(value.startDate.split('-')[0]))
    }
    setOpen(newOpen)
  }

  const options = React.useMemo(() => getGridOptions(activeType, year), [activeType, year])

  const isSelected = (opt: GridOption) =>
    value?.startDate === opt.startDate && value?.endDate === opt.endDate

  const handleSelect = (opt: GridOption) => {
    onValueChange?.({
      periodType: activeType,
      startDate: opt.startDate,
      endDate: opt.endDate,
      label: opt.fullLabel,
    })
    setOpen(false)
  }

  const handleYearNav = (direction: number) => {
    setYear((y) => y + (activeType === 'annual' ? direction * 10 : direction))
  }

  const yearLabel =
    activeType === 'annual'
      ? `${Math.floor(year / 10) * 10} – ${Math.floor(year / 10) * 10 + 11}`
      : String(year)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'justify-between gap-2 text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span className="text-sm">{value?.label || placeholder}</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="end">
        {/* Period type tabs */}
        <div className="flex gap-1 border-b border-gh-border p-1.5">
          {PERIOD_TYPE_TABS.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => setActiveType(pt.value)}
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                activeType === pt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gh-text-secondary hover:bg-gh-hover hover:text-gh-text',
              )}
            >
              {pt.label}
            </button>
          ))}
        </div>

        {/* Year/Decade navigation */}
        <div className="flex items-center justify-between px-3 py-2">
          <button
            type="button"
            onClick={() => handleYearNav(-1)}
            className="rounded-md p-1 text-gh-text-secondary transition-colors hover:bg-gh-hover hover:text-gh-text"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-gh-text text-sm font-semibold">{yearLabel}</span>
          <button
            type="button"
            onClick={() => handleYearNav(1)}
            className="rounded-md p-1 text-gh-text-secondary transition-colors hover:bg-gh-hover hover:text-gh-text"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Options grid */}
        <div className={cn('grid gap-1.5 px-3 pb-3', GRID_COLS[activeType])}>
          {options.map((opt) => {
            const selected = isSelected(opt)
            return (
              <button
                key={opt.startDate}
                type="button"
                onClick={() => handleSelect(opt)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-md px-2 py-2.5 text-sm transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gh-text hover:bg-gh-hover',
                )}
              >
                <span className="font-medium">{opt.label}</span>
                {opt.subtitle && (
                  <span
                    className={cn(
                      'mt-0.5 text-[10px]',
                      selected ? 'text-primary-foreground/70' : 'text-gh-text-secondary',
                    )}
                  >
                    {opt.subtitle}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── BACKWARD COMPAT: TOGGLE GROUP ──────────────────────────

interface PeriodToggleGroupProps {
  value?: Period
  onValueChange?: (period: Period) => void
  shortLabels?: boolean
  disabled?: boolean
  className?: string
}

/** @deprecated Use PeriodPicker instead */
export function PeriodToggleGroup({
  value,
  onValueChange,
  shortLabels = true,
  disabled = false,
  className,
}: PeriodToggleGroupProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-lg border border-gh-border bg-gh-canvas p-1',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {PERIOD_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3 text-xs"
          onClick={() => onValueChange?.(opt.value)}
          disabled={disabled}
        >
          {shortLabels ? (opt.shortLabel || opt.label) : opt.label}
        </Button>
      ))}
    </div>
  )
}
