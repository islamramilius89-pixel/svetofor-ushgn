import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLoginMutation } from '@/interactions/auth'
import { safeAdminRedirect, type LoginFormInput } from '@/layers/domain/auth/auth'
import { fieldErrorsOf, generalErrorOf } from '@/layers/use-cases/forms/submit-form'

export function useAdminLoginFlow(next: string | undefined) {
  const router = useRouter()
  const [form, setForm] = useState<LoginFormInput>({ login: '', password: '' })
  const mutation = useLoginMutation()

  function updateField(field: keyof LoginFormInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    if (mutation.isError) mutation.reset()
  }

  function submit() {
    mutation.mutate(form, {
      onSuccess: () => {
        router.replace(safeAdminRedirect(next))
        // Серверные компоненты админки должны увидеть новую cookie.
        router.refresh()
      },
    })
  }

  return {
    form,
    updateField,
    submit,
    isSubmitting: mutation.isPending || mutation.isSuccess,
    fieldErrors: fieldErrorsOf(mutation.error),
    error: generalErrorOf(mutation.error),
  }
}
