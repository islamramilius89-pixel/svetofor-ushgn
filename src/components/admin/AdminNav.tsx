'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/common/ui/Button'
import { useLogoutMutation } from '@/interactions/auth'

const items = [
  { href: '/admin', label: 'Обзор' },
  { href: '/admin/wells', label: 'Скважины' },
  { href: '/admin/tickets', label: 'Заявки' },
  { href: '/admin/messages', label: 'Сообщения' },
]

export function AdminNav({ login }: { login: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useLogoutMutation()

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.replace('/admin/login')
        router.refresh()
      },
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900 text-white rounded-xl px-5 py-3">
      <nav aria-label="Меню администратора">
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-lg px-3 py-1.5 font-semibold transition ${active ? 'bg-white text-gray-900' : 'hover:bg-gray-700'}`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-300">Вы вошли как {login}</span>
        <Button variant="secondary" size="sm" onClick={handleLogout} disabled={logout.isPending}>
          Выйти
        </Button>
      </div>
    </div>
  )
}
