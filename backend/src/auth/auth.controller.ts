import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { AdminGuard, type AdminRequest } from './admin.guard.js';
import { ADMIN_COOKIE, SESSION_TTL_SECONDS } from './auth.constants.js';
import { loginSchema, type LoginInput } from './auth.schemas.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, login } = await this.auth.login(body);
    // httpOnly: JavaScript на странице не может прочитать токен, поэтому его не украсть через XSS.
    response.cookie(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_TTL_SECONDS * 1000,
      path: '/',
    });
    return { login };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ADMIN_COOKIE, { path: '/' });
  }

  @Get('me')
  @UseGuards(AdminGuard)
  me(@Req() request: AdminRequest) {
    return { login: request.admin?.login };
  }
}
