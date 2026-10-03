import type { WellStatus } from '../generated/prisma/enums.js';

/** Пороги отклонения тока от эталона, %. */
export const STATUS_THRESHOLDS = { yellow: 10, red: 25 } as const;

/**
 * Главное правило «Светофора»: статус скважины определяется отклонением тока.
 * Статус нельзя выставить вручную, только через изменение отклонения.
 */
export function statusFromDeviation(deviation: number): WellStatus {
  if (deviation >= STATUS_THRESHOLDS.red) return 'RED';
  if (deviation >= STATUS_THRESHOLDS.yellow) return 'YELLOW';
  return 'GREEN';
}
