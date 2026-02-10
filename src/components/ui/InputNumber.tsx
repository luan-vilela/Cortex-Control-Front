import React, { useState } from 'react'

import { Input } from './input'

interface InputNumberProps {
  value: number
  onChange: (value: number) => void
  float?: boolean
  min?: number
  max?: number
  disabled?: boolean
  placeholder?: string
  className?: string
  mask?: 'real' | undefined
}

// Componente InputNumber
export const InputNumber: React.FC<InputNumberProps> = ({
  value,
  onChange,
  float = false,
  min,
  max,
  disabled,
  placeholder,
  className,
  mask,
}) => {
  const [input, setInput] = useState('')

  // Atualiza input local ao receber novo valor externo
  React.useEffect(() => {
    if (float) {
      // Exibe como padnumber (0.00)
      setInput(value === 0 ? '' : value.toFixed(2).replace('.', ''))
    } else {
      setInput(value === 0 ? '' : String(value))
    }
  }, [value, float])

  // Handler para mudança
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setInput(val)
    if (float) {
      // Padnumber: transforma string em centavos
      const num = val ? parseFloat(val) / 100 : 0
      if (min !== undefined && num < min) return
      if (max !== undefined && num > max) return
      onChange(num)
    } else {
      const num = val ? parseInt(val, 10) : 0
      if (min !== undefined && num < min) return
      if (max !== undefined && num > max) return
      onChange(num)
    }
  }

  // Exibe valor formatado para float com vírgula e máscara
  let displayValue = float
    ? input
      ? (parseFloat(input) / 100).toFixed(2).replace('.', ',')
      : ''
    : input

  if (mask === 'real' && displayValue) {
    displayValue = `R$ ${displayValue}`
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={displayValue}
      onChange={handleChange}
      min={min}
      max={max}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  )
}
