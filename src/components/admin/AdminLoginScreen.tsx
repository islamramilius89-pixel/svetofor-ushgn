'use client'

import type { FormEvent } from 'react'
import { Button } from '@/common/ui/Button'
import { Card } from '@/common/ui/Card'
import { FormError, TextField } from '@/common/ui/FormFields'
import { useAdminLoginFlow } from '@/flows/use-admin-login-flow'

export function AdminLoginScreen({ next }: { next?: string }) {
  const flow = useAdminLoginFlow(next)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    flow.submit()
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Вход для администратора">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField
            label="Логин"
            value={flow.form.login}
            onChange={(event) => flow.updateField('login', event.target.value)}
            error={flow.fieldErrors.login}
            autoComplete="username"
            autoFocus
          />
          <TextField
            label="Пароль"
            type="password"
            value={flow.form.password}
            onChange={(event) => flow.updateField('password', event.target.value)}
            error={flow.fieldErrors.password}
            autoComplete="current-password"
          />
          <FormError message={flow.error} />
          <Button type="submit" className="w-full" disabled={flow.isSubmitting}>
            {flow.isSubmitting ? 'Входим…' : 'Войти'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
