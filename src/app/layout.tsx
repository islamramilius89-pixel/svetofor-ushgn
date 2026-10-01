import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { QueryProvider } from '@/common/providers/QueryProvider'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import '@/assets/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Светофор УШГН',
    template: '%s — Светофор УШГН',
  },
  description: 'Система мониторинга и диагностики скважин по анализу электротока',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        <QueryProvider>
          <SiteHeader />
          <main className="w-full flex-1">{children}</main>
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  )
}
