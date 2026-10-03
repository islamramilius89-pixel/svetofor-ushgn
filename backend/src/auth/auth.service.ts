import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AdminSession } from './auth.constants.js';
import type { LoginInput } from './auth.schemas.js';
import { LoginAttempts } from './login-attempts.js';
import { verifyPassword } from './password.js';

@Injectable()
export class AuthService {
  private readonly attempts = new LoginAttempts();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login({ login, password }: LoginInput): Promise<{ token: string; login: string }> {
    const key = login.toLowerCase();
    if (this.attempts.isLocked(key)) {
      throw new HttpException(
        'Слишком много неудачных попыток. Попробуйте через 15 минут',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const admin = await this.prisma.admin.findUnique({ where: { login } });
    const valid = admin !== null && (await verifyPassword(password, admin.passwordHash));
    if (!admin || !valid) {
      this.attempts.registerFailure(key);
      // Одинаковое сообщение для неверного логина и пароля: нельзя узнать, существует ли логин.
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    this.attempts.reset(key);
    const session: AdminSession = { sub: admin.id, login: admin.login };
    return { token: await this.jwt.signAsync(session), login: admin.login };
  }
}
