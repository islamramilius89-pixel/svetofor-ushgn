import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Сводка для главной страницы и админ-панели: сколько скважин каждого цвета и заявок в каждой колонке. */
  async summary() {
    const [wellGroups, ticketGroups] = await this.prisma.$transaction([
      this.prisma.well.groupBy({ by: ['status'], _count: { _all: true }, orderBy: { status: 'asc' } }),
      this.prisma.ticket.groupBy({ by: ['status'], _count: { _all: true }, orderBy: { status: 'asc' } }),
    ]);

    const wells = { GREEN: 0, YELLOW: 0, RED: 0 };
    for (const group of wellGroups) wells[group.status] = (group._count as { _all: number })._all;

    const tickets = { NEW: 0, IN_PROGRESS: 0, DONE: 0 };
    for (const group of ticketGroups) tickets[group.status] = (group._count as { _all: number })._all;

    return {
      wells: { total: wells.GREEN + wells.YELLOW + wells.RED, byStatus: wells },
      tickets: { total: tickets.NEW + tickets.IN_PROGRESS + tickets.DONE, byStatus: tickets },
    };
  }
}
