/** Коды ошибок Prisma, которые мы превращаем в понятные HTTP-ответы. */
export const PrismaErrorCode = {
  /** Нарушено уникальное ограничение (например, номер скважины уже занят). */
  UniqueViolation: 'P2002',
  /** Нарушена ссылка на другую таблицу (например, НГДУ не существует). */
  ForeignKeyViolation: 'P2003',
  /** Запись для изменения или удаления не найдена. */
  NotFound: 'P2025',
} as const;

export function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === code
  );
}
