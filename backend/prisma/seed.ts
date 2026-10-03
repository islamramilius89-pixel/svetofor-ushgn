/**
 * Начальные данные для разработки и демонстрации.
 * Запуск: npm run db:seed (существующие данные будут заменены).
 */
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient, type TicketPriority, type TicketStatus } from '../src/generated/prisma/client.js';
import { hashPassword } from '../src/auth/password.js';
import { statusFromDeviation } from '../src/wells/well-status.js';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db' }),
});

/** Учётная запись для разработки. В реальном развёртывании пароль задаётся через ADMIN_PASSWORD. */
const ADMIN_LOGIN = process.env.ADMIN_LOGIN ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'svetofor-admin';

/** Детерминированный генератор случайных чисел: при каждом запуске данные одинаковые. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

const random = createRandom(2026);
const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)];
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

function randomDeviation(): number {
  const roll = random();
  const value = roll < 0.62 ? random() * 10 : roll < 0.87 ? 10 + random() * 15 : 25 + random() * 20;
  return Math.round(value * 10) / 10;
}

const ticketTemplates = [
  { title: 'Проверить балансировку станка-качалки', description: 'Ток двигателя скачет на ходе вверх и вниз — похоже на разбалансировку.' },
  { title: 'Заменить ремни привода', description: 'Отклонение тока растёт третий день подряд, возможна пробуксовка ремней.' },
  { title: 'Проверить сальниковое уплотнение', description: 'При обходе замечены следы нефти у устья.' },
  { title: 'Снижение подачи насоса', description: 'Ток ниже эталона, дебит упал. Нужен замер динамического уровня.' },
  { title: 'Подозрение на обрыв штанг', description: 'Резкое падение нагрузки на двигатель. Требуется срочный выезд бригады.' },
  { title: 'Перепроверить эталон тока', description: 'После ремонта эталон мог устареть — возможны ложные срабатывания.' },
  { title: 'Шум в редукторе', description: 'Оператор сообщил о постороннем шуме при работе.' },
  { title: 'Проверить электродвигатель', description: 'Перегрев корпуса двигателя, ток выше нормы.' },
] as const;

const assignees = ['Иванов А.', 'Петрова Е.', 'Сидоров К.', 'Галиев Р.', ''] as const;

async function main() {
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.well.deleteMany(),
    prisma.ngdu.deleteMany(),
    prisma.message.deleteMany(),
  ]);

  const ngdus = await Promise.all(
    [1, 2, 3, 4, 5, 6].map((n) => prisma.ngdu.create({ data: { name: `НГДУ №${n}` } })),
  );

  const usedNumbers = new Set<string>();
  const wells = [];
  for (let i = 0; i < 60; i++) {
    let number: string;
    do number = String(1000 + Math.floor(random() * 9000));
    while (usedNumbers.has(number));
    usedNumbers.add(number);

    const deviation = randomDeviation();
    wells.push(
      await prisma.well.create({
        data: {
          number,
          ngduId: pick(ngdus).id,
          deviation,
          status: statusFromDeviation(deviation),
          lastCheckAt: random() < 0.7 ? daysAgo(Math.floor(random() * 60)) : null,
        },
      }),
    );
  }

  const problemWells = wells.filter((well) => well.status !== 'GREEN');
  const statuses: TicketStatus[] = ['NEW', 'NEW', 'IN_PROGRESS', 'IN_PROGRESS', 'DONE'];
  for (let i = 0; i < 14; i++) {
    const well = problemWells[i % problemWells.length];
    const template = pick(ticketTemplates);
    const status = pick(statuses);
    const priority: TicketPriority = well.status === 'RED' ? 'HIGH' : pick(['LOW', 'MEDIUM'] as const);
    const createdAt = daysAgo(1 + Math.floor(random() * 20));

    const ticket = await prisma.ticket.create({
      data: {
        ...template,
        status,
        priority,
        assignee: status === 'NEW' ? '' : pick(assignees.filter(Boolean)),
        wellId: well.id,
        createdAt,
        resolvedAt: status === 'DONE' ? daysAgo(Math.floor(random() * 3)) : null,
      },
    });

    if (status !== 'NEW') {
      await prisma.comment.create({
        data: { ticketId: ticket.id, author: 'Диспетчер', text: 'Заявка передана бригаде, выезд запланирован.' },
      });
    }
  }

  await prisma.admin.upsert({
    where: { login: ADMIN_LOGIN },
    update: { passwordHash: await hashPassword(ADMIN_PASSWORD) },
    create: { login: ADMIN_LOGIN, passwordHash: await hashPassword(ADMIN_PASSWORD) },
  });

  console.log(`Seed: ${ngdus.length} НГДУ, ${wells.length} скважин, 14 заявок, администратор «${ADMIN_LOGIN}».`);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
