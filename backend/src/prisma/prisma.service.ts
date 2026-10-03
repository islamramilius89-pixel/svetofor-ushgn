import { fileURLToPath } from 'node:url';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client.js';

/** По умолчанию — backend/prisma/dev.db, независимо от папки, из которой запущен сервер. */
const DEFAULT_DATABASE = fileURLToPath(new URL('../../prisma/dev.db', import.meta.url));
export const DATABASE_URL = process.env.DATABASE_URL ?? `file:${DEFAULT_DATABASE}`;

/** Клиент базы данных. Один экземпляр на всё приложение. */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaBetterSqlite3({ url: DATABASE_URL }) });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
