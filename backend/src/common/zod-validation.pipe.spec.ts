import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { idParamSchema, ZodValidationPipe } from './zod-validation.pipe.js';

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(z.object({ name: z.string().min(2, 'Слишком коротко') }));

  it('возвращает проверенные данные', () => {
    expect(pipe.transform({ name: 'Иван' })).toEqual({ name: 'Иван' });
  });

  it('отдаёт ошибки по полям', () => {
    let caught: unknown;
    try {
      pipe.transform({ name: 'И' });
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(BadRequestException);
    expect((caught as BadRequestException).getResponse()).toEqual({
      error: 'Данные заполнены с ошибками',
      fieldErrors: { name: 'Слишком коротко' },
    });
  });

  it('id из строки превращается в число, мусор отклоняется', () => {
    expect(idParamSchema.parse('42')).toBe(42);
    expect(idParamSchema.safeParse('abc').success).toBe(false);
    expect(idParamSchema.safeParse('-1').success).toBe(false);
  });
});
