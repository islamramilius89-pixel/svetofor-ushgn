import { LOCK_WINDOW_MS, LoginAttempts, MAX_FAILED_ATTEMPTS } from './login-attempts.js';

describe('LoginAttempts', () => {
  it('блокирует после 5 неудачных попыток и снимает блокировку через 15 минут', () => {
    let time = 0;
    const attempts = new LoginAttempts(() => time);

    for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) attempts.registerFailure('admin');
    expect(attempts.isLocked('admin')).toBe(true);
    expect(attempts.isLocked('other')).toBe(false);

    time += LOCK_WINDOW_MS + 1;
    expect(attempts.isLocked('admin')).toBe(false);
  });

  it('успешный вход сбрасывает счётчик', () => {
    const attempts = new LoginAttempts();
    for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) attempts.registerFailure('admin');
    attempts.reset('admin');
    expect(attempts.isLocked('admin')).toBe(false);
  });
});
