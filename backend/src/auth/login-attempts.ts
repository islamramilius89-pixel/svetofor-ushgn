export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_WINDOW_MS = 15 * 60 * 1000;

type Attempts = { count: number; firstFailedAt: number };

/**
 * Защита от подбора пароля: после 5 неудачных попыток вход для этого логина
 * блокируется на 15 минут. Хранится в памяти процесса — для учебного проекта достаточно.
 */
export class LoginAttempts {
  private readonly attempts = new Map<string, Attempts>();

  constructor(private readonly now: () => number = Date.now) {}

  isLocked(key: string): boolean {
    const entry = this.current(key);
    return entry !== undefined && entry.count >= MAX_FAILED_ATTEMPTS;
  }

  registerFailure(key: string): void {
    const entry = this.current(key);
    if (entry) entry.count += 1;
    else this.attempts.set(key, { count: 1, firstFailedAt: this.now() });
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  private current(key: string): Attempts | undefined {
    const entry = this.attempts.get(key);
    if (entry && this.now() - entry.firstFailedAt > LOCK_WINDOW_MS) {
      this.attempts.delete(key);
      return undefined;
    }
    return entry;
  }
}
