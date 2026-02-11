'use client'

import React, { type ReactNode } from 'react'

interface RadioButtonProps {
  id: string
  name: string
  value: string
  label: string
  description?: string | ReactNode
  action?: {
    text: string
    onClick: () => void
  }
  checked?: boolean
  onChange?: (value: string) => void
  disabled?: boolean
  children?: ReactNode
  containerClassName?: string
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      id,
      name,
      value,
      label,
      description,
      action,
      checked = false,
      onChange,
      disabled = false,
      children,
      containerClassName = '',
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(e.target.value)
      }
    }

    return (
      <div className={`flex items-start gap-4 py-3 ${containerClassName}`}>
        <div className="flex items-start pt-1">
          <input
            ref={ref}
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="mt-0.5 h-5 w-5 cursor-pointer accent-blue-600 dark:accent-blue-500"
          />
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor={id}
            className="text-gh-text block cursor-pointer text-sm font-medium transition-colors hover:text-blue-600"
          >
            {label}
          </label>

          {description && (
            <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              {typeof description === 'string' ? <span>{description}</span> : description}
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className="font-medium whitespace-nowrap text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {action.text}
                </button>
              )}
            </div>
          )}

          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    )
  }
)

RadioButton.displayName = 'RadioButton'
