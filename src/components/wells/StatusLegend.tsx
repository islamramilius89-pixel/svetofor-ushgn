import { STATUS_THRESHOLDS } from '@/layers/domain/wells/well'
import { WellStatusBadge } from './WellStatusBadge'

/** Пояснение, по какому правилу скважина получает цвет. */
export function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
      <span className="font-semibold text-gray-700">Отклонение тока от эталона:</span>
      <span className="flex items-center gap-2">
        <WellStatusBadge status="GREEN" /> до {STATUS_THRESHOLDS.yellow}%
      </span>
      <span className="flex items-center gap-2">
        <WellStatusBadge status="YELLOW" /> {STATUS_THRESHOLDS.yellow}–{STATUS_THRESHOLDS.red}%
      </span>
      <span className="flex items-center gap-2">
        <WellStatusBadge status="RED" /> от {STATUS_THRESHOLDS.red}%
      </span>
    </div>
  )
}
