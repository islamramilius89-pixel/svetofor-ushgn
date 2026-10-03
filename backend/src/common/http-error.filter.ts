import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

/**
 * Все ошибки API отдаются в одном формате: { error, fieldErrors? }.
 * Фронтенду не нужно разбирать разные варианты ответов.
 */
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpError');

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'object' && body !== null && 'fieldErrors' in body) {
        response.status(status).json(body);
        return;
      }

      const message =
        typeof body === 'string'
          ? body
          : (body as { message?: unknown }).message;
      response
        .status(status)
        .json({ error: typeof message === 'string' ? message : exception.message });
      return;
    }

    this.logger.error(exception);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Внутренняя ошибка сервера' });
  }
}
