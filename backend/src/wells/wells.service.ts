import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { isPrismaError, PrismaErrorCode } from '../common/prisma-errors.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { statusFromDeviation } from './well-status.js';
import type { ListWellsQuery, UpdateWellInput, WellInput } from './wells.schemas.js';

const OPEN_TICKETS = { where: { status: { not: 'DONE' as const } } };

const wellWithRelations = {
  ngdu: true,
  _count: { select: { tickets: OPEN_TICKETS } },
} satisfies Prisma.WellInclude;

type WellWithRelations = Prisma.WellGetPayload<{ include: typeof wellWithRelations }>;

function toWellDto(well: WellWithRelations) {
  return {
    id: well.id,
    number: well.number,
    ngdu: { id: well.ngdu.id, name: well.ngdu.name },
    deviation: well.deviation,
    status: well.status,
    note: well.note,
    lastCheckAt: well.lastCheckAt?.toISOString() ?? null,
    openTickets: well._count.tickets,
    updatedAt: well.updatedAt.toISOString(),
  };
}

@Injectable()
export class WellsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListWellsQuery) {
    const where: Prisma.WellWhereInput = {
      ...(query.search ? { number: { contains: query.search } } : {}),
      ...(query.ngduId ? { ngduId: query.ngduId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.ids ? { id: { in: query.ids } } : {}),
    };
    const orderBy: Prisma.WellOrderByWithRelationInput[] =
      query.sort === 'number' ? [{ number: 'asc' }] : [{ deviation: 'desc' }, { number: 'asc' }];

    const [items, total] = await this.prisma.$transaction([
      this.prisma.well.findMany({
        where,
        orderBy,
        include: wellWithRelations,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.well.count({ where }),
    ]);

    return { items: items.map(toWellDto), total, page: query.page, pageSize: query.pageSize };
  }

  async get(id: number) {
    const well = await this.prisma.well.findUnique({
      where: { id },
      include: {
        ...wellWithRelations,
        tickets: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!well) throw new NotFoundException('Скважина не найдена');

    return {
      ...toWellDto(well),
      tickets: well.tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        assignee: ticket.assignee,
        createdAt: ticket.createdAt.toISOString(),
      })),
    };
  }

  async create(input: WellInput) {
    try {
      const well = await this.prisma.well.create({
        data: { ...input, status: statusFromDeviation(input.deviation) },
        include: wellWithRelations,
      });
      return toWellDto(well);
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async update(id: number, input: UpdateWellInput) {
    try {
      const well = await this.prisma.well.update({
        where: { id },
        data: {
          ...input,
          ...(input.deviation !== undefined ? { status: statusFromDeviation(input.deviation) } : {}),
        },
        include: wellWithRelations,
      });
      return toWellDto(well);
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.well.delete({ where: { id } });
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async listNgdus() {
    const ngdus = await this.prisma.ngdu.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { wells: true } } },
    });
    return ngdus.map((ngdu) => ({ id: ngdu.id, name: ngdu.name, wellCount: ngdu._count.wells }));
  }

  private translateError(error: unknown): unknown {
    if (isPrismaError(error, PrismaErrorCode.UniqueViolation)) {
      return new ConflictException({
        error: 'Скважина с таким номером уже есть',
        fieldErrors: { number: 'Этот номер уже занят' },
      });
    }
    if (isPrismaError(error, PrismaErrorCode.ForeignKeyViolation)) {
      return new BadRequestException({
        error: 'Данные заполнены с ошибками',
        fieldErrors: { ngduId: 'Такого НГДУ нет' },
      });
    }
    if (isPrismaError(error, PrismaErrorCode.NotFound)) {
      return new NotFoundException('Скважина не найдена');
    }
    return error;
  }
}
