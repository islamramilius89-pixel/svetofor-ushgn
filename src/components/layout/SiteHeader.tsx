import Link from 'next/link'
import { NavLink } from './NavLink'

const navItems = [
  { href: '/', label: 'Главная' },
  { href: '/wells', label: 'Скважины' },
  { href: '/board', label: 'Заявки' },
  { href: '/results', label: 'Результаты' },
  { href: '/about', label: 'О проекте' },
  { href: '/contact', label: 'Контакты' },
]

export function SiteHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl sticky top-0 z-50">
      <nav className="px-6 py-4 flex flex-wrap items-center justify-between gap-4" aria-label="Основное меню">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition">
          🚨 Светофор УШГН
        </Link>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6 items-center">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
