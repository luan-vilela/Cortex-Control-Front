import React, { useState } from 'react'

import { Input } from './input'

interface InputNumberProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value: number
  onChange: (value: number) => void
  float?: boolean
  min?: number
  max?: number
  disabled?: boolean
  placeholder?: string
  className?: string
  mask?: 'real' | 'percentage' | undefined
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
  ...props
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

    // Permite apagar completamente o campo
    if (!val || val === '') {
      onChange(0)
      return
    }

    if (float) {
      // Padnumber: transforma string em centavos
      const num = parseFloat(val) / 100
      if (min !== undefined && num < min) return
      if (max !== undefined && num > max) return
      onChange(num)
    } else {
      const num = parseInt(val, 10)
      if (min !== undefined && num < min) return
      if (max !== undefined && num > max) return
      onChange(num)
    }
  }

  // Handler para backspace/delete - permite limpar o campo
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const target = e.target as HTMLInputElement
      const cursorPos = target.selectionStart || 0
      const valueLength = target.value.length

      // Se cursor está no final e tem máscara, remove um dígito do input interno
      if (cursorPos === valueLength && input.length > 0) {
        e.preventDefault()
        const newInput = input.slice(0, -1)
        setInput(newInput)

        if (!newInput || newInput === '') {
          onChange(0)
        } else if (float) {
          const num = parseFloat(newInput) / 100
          onChange(num)
        } else {
          const num = parseInt(newInput, 10)
          onChange(num)
        }
      }
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
  } else if (mask === 'percentage' && displayValue) {
    displayValue = `${displayValue} %`
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern={mask === 'real' ? '[0-9R$ .,]*' : mask === 'percentage' ? '[0-9 .,% ]*' : '[0-9,]*'}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
      {...props}
    />
  )
}
