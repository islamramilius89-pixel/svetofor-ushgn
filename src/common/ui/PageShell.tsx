import type { ReactNode } from 'react'

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {children}
    </div>
  )
}
