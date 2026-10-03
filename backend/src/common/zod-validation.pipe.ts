import { BadRequestException, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

/** Превращает ошибки Zod в объект «поле → первое сообщение об ошибке». */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join('.') || 'form';
    fieldErrors[field] ??= issue.message;
  }
  return fieldErrors;
}

/**
 * Проверяет тело запроса, параметры или query по схеме Zod.
 * В контроллер попадают только проверенные и приведённые к нужному типу данные.
 */
export class ZodValidationPipe<T extends z.ZodType> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.output<T> {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;

    throw new BadRequestException({
      error: 'Данные заполнены с ошибками',
      fieldErrors: toFieldErrors(result.error),
    });
  }
}

export const idParamSchema = z.coerce
  .number()
  .int()
  .positive('Некорректный идентификатор');

export const IdPipe = new ZodValidationPipe(idParamSchema);
