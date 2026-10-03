import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WellDetailsScreen } from '@/components/wells/WellDetailsScreen'
import { parseRouteId } from '@/layers/domain/validation'

export const metadata: Metadata = { title: 'Скважина' }

export default async function WellPage({ params }: PageProps<'/wells/[id]'>) {
  const id = parseRouteId((await params).id)
  if (!id) notFound()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <WellDetailsScreen id={id} />
    </div>
  )
}
