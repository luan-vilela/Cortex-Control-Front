import { useState } from 'react'

type DialogState<T extends string | boolean = boolean> = T | null

/**
 * Hook para gerenciar estado de diálogos/modais de forma type-safe
 *
 * @example
 * // Com booleano simples
 * const [open, setOpen, close] = useDialogState()
 * setOpen(true)
 * close() // volta para null
 *
 * @example
 * // Com múltiplos estados
 * const [formType, setFormType, closeForm] = useDialogState<'edit' | 'delete'>()
 * setFormType('edit')
 * setFormType('delete')
 * closeForm() // volta para null
 */
function useDialogState<T extends string | boolean = boolean>(
  initialState?: T | null
): [DialogState<T>, (value: DialogState<T>) => void, () => void] {
  const [state, setState] = useState<DialogState<T>>(initialState ?? null)

  const toggle = (value: DialogState<T>) => setState(value)
  const close = () => setState(null)

  return [state, toggle, close]
}

export default useDialogState
