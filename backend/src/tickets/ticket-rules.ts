import type { TicketStatus } from '../generated/prisma/enums.js';

export type StatusTransition = {
  /** Новое значение resolvedAt: дата закрытия, null при переоткрытии, undefined — не менять. */
  resolvedAt?: Date | null;
  /** Нужно ли обновить дату последней проверки скважины. */
  markWellChecked: boolean;
};

/**
 * Что происходит при смене статуса заявки:
 * - перевели в «Проверено» — фиксируем дату закрытия и отмечаем, что скважину проверили;
 * - вернули из «Проверено» обратно — дата закрытия сбрасывается.
 */
export function statusTransition(
  previous: TicketStatus,
  next: TicketStatus,
  now: Date,
): StatusTransition {
  if (previous === next) return { markWellChecked: false };
  if (next === 'DONE') return { resolvedAt: now, markWellChecked: true };
  if (previous === 'DONE') return { resolvedAt: null, markWellChecked: false };
  return { markWellChecked: false };
}
