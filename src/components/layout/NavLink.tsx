'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const isActive = usePathname() === href

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`hover:text-blue-200 transition font-medium ${isActive ? 'underline underline-offset-8' : ''}`}
    >
      {children}
    </Link>
  )
}
