import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'Введите логин').max(50),
  password: z.string().min(1, 'Введите пароль').max(200),
});

export type LoginInput = z.output<typeof loginSchema>;
