import type { ReactNode } from 'react'

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="bg-white p-8 rounded-lg shadow">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {children}
    </section>
  )
}
