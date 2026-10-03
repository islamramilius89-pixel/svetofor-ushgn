export const ADMIN_COOKIE = 'svetofor_admin';
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

const DEV_SECRET = 'dev-only-secret-change-me';

export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  return DEV_SECRET;
}

export type AdminSession = {
  sub: number;
  login: string;
};
