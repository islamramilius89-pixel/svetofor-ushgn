import { loginFormSchema, type LoginFormInput } from '@/layers/domain/auth/auth'
import { login } from '@/layers/infrastructure/auth/auth-api'
import { submitForm } from '@/layers/use-cases/forms/submit-form'

export function loginAdmin(input: LoginFormInput) {
  return submitForm(loginFormSchema, input, login)
}
