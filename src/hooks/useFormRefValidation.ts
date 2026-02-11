import { useRef } from 'react'

export const useFormRefValidation = () => {
  const refs = useRef<{ [key: string]: { [key: string]: any } }>({})

  const validate = async (stepKey: string): Promise<boolean> => {
    const stepRefs = refs.current[stepKey]
    if (!stepRefs) return true

    const validations = Object.values(stepRefs).map(async (ref) => {
      if (ref?.validate) {
        return await ref.validate()
      }
      return true
    })

    const results = await Promise.all(validations)
    return results.every((isValid) => isValid)
  }

  const clearDirty = async (stepKey: string) => {
    const stepRefs = refs.current[stepKey]
    if (!stepRefs) return true

    Object.values(stepRefs).map(async (ref) => {
      if (ref?.validate) {
        await ref.clearDirty()
      }
    })
  }

  const cancelUploads = (stepKey: string) => {
    const stepRefs = refs.current[stepKey]
    if (!stepRefs) return

    Object.values(stepRefs).forEach((ref) => {
      if (ref?.handleCancelUpload) {
        ref.handleCancelUpload()
      }
    })
  }

  const setRef = (stepKey: string, refKey: string, ref: any) => {
    if (!refs.current[stepKey]) {
      refs.current[stepKey] = {}
    }
    refs.current[stepKey][refKey] = ref
  }

  const getRef = (stepKey: string, refKey: string) => {
    return refs.current?.[stepKey]?.[refKey]
  }

  return { clearDirty, validate, setRef, getRef, cancelUploads }
}
