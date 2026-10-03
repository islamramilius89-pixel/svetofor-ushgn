import { WELL_STATUS_LABELS, type WellStatus } from '@/layers/domain/wells/well'

export const wellStatusStyles: Record<WellStatus, { dot: string; badge: string; bar: string }> = {
  GREEN: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-800', bar: 'bg-green-500' },
  YELLOW: { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-800', bar: 'bg-yellow-400' },
  RED: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-800', bar: 'bg-red-500' },
}

export function WellStatusBadge({ status }: { status: WellStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap ${wellStatusStyles[status].badge}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${wellStatusStyles[status].dot}`} aria-hidden="true" />
      {WELL_STATUS_LABELS[status]}
    </span>
  )
}
