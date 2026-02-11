'use client'

import React, { forwardRef, useImperativeHandle } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { PhoneInput } from '@/modules/person/components/PhoneInput'

import { type Phones, phonesSchema } from './schema'

type Ref = {
  validate: () => Promise<boolean>
  getValues: () => Phones | undefined
  clearDirty: () => void
  setFieldError: (message: string) => void
}

type Props = {
  initialValues?: { phones?: Phones }
  onChange?: (values?: Phones) => void
}

export const PhonesBlock = forwardRef<Ref, Props>(({ initialValues, onChange }, ref) => {
  const { control, trigger, getValues, reset, setError, watch } = useForm<{ phones: Phones }>({
    resolver: zodResolver(phonesSchema) as any,
    defaultValues: { phones: initialValues?.phones || [] },
  })

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const ok = await trigger()
      return ok
    },
    getValues: () => getValues().phones,
    clearDirty: () => reset(getValues()),
    setFieldError: (message: string) => setError('phones' as any, { type: 'manual', message }),
  }))

  React.useEffect(() => {
    const subscription = watch((v) => onChange?.(v.phones as Phones))
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  return (
    <div>
      <div className="text-gh-text-secondary mb-2 text-xs">Telefones</div>
      <Controller
        control={control as any}
        name="phones"
        render={({ field }) => (
          <PhoneInput phones={field.value || []} onChange={(p) => field.onChange(p)} />
        )}
      />
    </div>
  )
})

PhonesBlock.displayName = 'PhonesBlock'
