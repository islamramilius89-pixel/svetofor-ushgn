import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ADMIN_COOKIE, type AdminSession } from './auth.constants.js';

export type AdminRequest = Request & { admin?: AdminSession };

/**
 * Пропускает запрос только с действительным токеном администратора в cookie.
 * Именно сервер решает, есть ли права: интерфейс можно обойти, этот guard — нет.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const token: unknown = request.cookies?.[ADMIN_COOKIE];
    if (typeof token !== 'string' || !token) {
      throw new UnauthorizedException('Требуется вход администратора');
    }

    try {
      request.admin = await this.jwt.verifyAsync<AdminSession>(token);
      return true;
    } catch {
      throw new UnauthorizedException('Сессия истекла, войдите снова');
    }
  }
}
