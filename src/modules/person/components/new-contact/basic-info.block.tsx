'use client'

import React, { forwardRef, useImperativeHandle } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/FormInput'

import { BasicInfo, basicInfoSchema } from './schema'

type Ref = {
  validate: () => Promise<boolean>
  getValues: () => BasicInfo
  clearDirty: () => void
  setFieldError: (field: keyof BasicInfo, message: string) => void
}

type Props = {
  initialValues?: Partial<BasicInfo>
  onChange?: (values: BasicInfo) => void
}

const BasicInfoBlock = forwardRef<Ref, Props>(({ initialValues, onChange }, ref) => {
  const { register, trigger, getValues, reset, setError, watch } = useForm<BasicInfo>({
    resolver: zodResolver(basicInfoSchema) as any,
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      document: initialValues?.document || '',
    },
  })

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const ok = await trigger()
      return ok
    },
    getValues: () => getValues() as BasicInfo,
    clearDirty: () => reset(getValues()),
    setFieldError: (field: keyof BasicInfo, message: string) =>
      setError(field as any, { type: 'manual', message }),
  }))

  // propagate changes upwards if requested
  React.useEffect(() => {
    const subscription = watch((v) => onChange?.(v as BasicInfo))
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  return (
    <div className="space-y-3">
      <FormInput label="Nome" placeholder="Nome completo" {...register('name')} />
      <FormInput label="Email" placeholder="email@exemplo.com" {...register('email')} />
      <FormInput label="CPF" placeholder="000.000.000-00" {...register('document')} />
    </div>
  )
})

export default BasicInfoBlock
