import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '@/layers/infrastructure/auth/auth-api'
import { loginAdmin } from '@/layers/use-cases/auth/login-admin'

export function useLoginMutation() {
  return useMutation({ mutationFn: loginAdmin })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    // После выхода в кеше не должно остаться данных, видимых только администратору.
    onSuccess: () => queryClient.clear(),
  })
}
