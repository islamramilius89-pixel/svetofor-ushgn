import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TicketDetailsScreen } from '@/components/tickets/TicketDetailsScreen'
import { parseRouteId } from '@/layers/domain/validation'

export const metadata: Metadata = { title: 'Заявка' }

export default async function TicketPage({ params }: PageProps<'/tickets/[id]'>) {
  const id = parseRouteId((await params).id)
  if (!id) notFound()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <TicketDetailsScreen id={id} />
    </div>
  )
}
