import { hashPassword, verifyPassword } from './password.js';

describe('password', () => {
  it('хеш не содержит пароль и проверяется', async () => {
    const hash = await hashPassword('secret-123');
    expect(hash).not.toContain('secret-123');
    await expect(verifyPassword('secret-123', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong', hash)).resolves.toBe(false);
  });

  it('одинаковые пароли дают разные хеши (соль)', async () => {
    expect(await hashPassword('same')).not.toBe(await hashPassword('same'));
  });

  it('повреждённый хеш не принимается', async () => {
    await expect(verifyPassword('x', 'plain-text')).resolves.toBe(false);
  });
});
