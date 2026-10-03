import type { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { z } from 'zod';
import { HttpErrorFilter } from './common/http-error.filter.js';

// Стандартные сообщения Zod (например, «ожидалось число») — на русском.
z.config(z.locales.ru());

/** Общая настройка приложения: используется и при запуске, и в тестах. */
export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalFilters(new HttpErrorFilter());
  app.enableShutdownHooks();
}
