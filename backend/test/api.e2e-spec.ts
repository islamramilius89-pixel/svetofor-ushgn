import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { ADMIN_COOKIE } from '../src/auth/auth.constants.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

/** База подменена заглушкой: проверяем HTTP-слой — права доступа, проверку данных, формат ошибок. */
const prismaMock = {
  message: {
    create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({
      id: 1,
      ...data,
      createdAt: new Date('2026-10-03T00:00:00Z'),
    })),
    findMany: vi.fn(async () => []),
  },
  admin: { findUnique: vi.fn(async () => null) },
  well: { delete: vi.fn() },
};

describe('API (e2e)', () => {
  let app: INestApplication;
  let adminCookie: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    const token = await app.get(JwtService).signAsync({ sub: 1, login: 'admin' });
    adminCookie = `${ADMIN_COOKIE}=${token}`;
  });

  afterAll(async () => {
    await app.close();
  });

  it('читать сообщения без входа нельзя', async () => {
    const response = await request(app.getHttpServer()).get('/api/messages').expect(401);
    expect(response.body).toEqual({ error: 'Требуется вход администратора' });
  });

  it('с поддельным токеном тоже нельзя', async () => {
    await request(app.getHttpServer())
      .get('/api/messages')
      .set('Cookie', `${ADMIN_COOKIE}=fake.token.value`)
      .expect(401);
  });

  it('администратор читает сообщения', async () => {
    await request(app.getHttpServer()).get('/api/messages').set('Cookie', adminCookie).expect(200, []);
  });

  it('удалить скважину без входа нельзя', async () => {
    await request(app.getHttpServer()).delete('/api/wells/1').expect(401);
    expect(prismaMock.well.delete).not.toHaveBeenCalled();
  });

  it('неверные данные формы → 400 с ошибками по полям, в базу ничего не пишется', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/messages')
      .send({ name: 'x', email: 'no', text: '' })
      .expect(400);
    expect(response.body.fieldErrors).toEqual({
      name: 'Имя должно быть не короче 2 символов',
      email: 'Введите корректный email',
      text: 'Введите сообщение',
    });
    expect(prismaMock.message.create).not.toHaveBeenCalled();
  });

  it('правильное сообщение сохраняется', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/messages')
      .send({ name: ' Иван ', email: 'ivan@example.test', text: 'Здравствуйте' })
      .expect(201);
    expect(response.body).toMatchObject({ id: 1, name: 'Иван' });
  });

  it('неверный логин → 401 без подсказки, что именно не так', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ login: 'nobody', password: 'x' })
      .expect(401);
    expect(response.body).toEqual({ error: 'Неверный логин или пароль' });
  });

  it('некорректный id → 400', async () => {
    await request(app.getHttpServer()).get('/api/wells/abc').expect(400);
  });
});
