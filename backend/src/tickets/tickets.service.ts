import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { isPrismaError, PrismaErrorCode } from '../common/prisma-errors.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { statusTransition } from './ticket-rules.js';
import type {
  CreateCommentInput,
  CreateTicketInput,
  ListTicketsQuery,
  UpdateTicketInput,
} from './tickets.schemas.js';

const ticketInclude = {
  well: { select: { id: true, number: true, status: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.TicketInclude;

type TicketWithRelations = Prisma.TicketGetPayload<{ include: typeof ticketInclude }>;

function toTicketDto(ticket: TicketWithRelations) {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    assignee: ticket.assignee,
    well: ticket.well,
    commentCount: ticket._count.comments,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    resolvedAt: ticket.resolvedAt?.toISOString() ?? null,
  };
}

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListTicketsQuery) {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        ...(query.wellId ? { wellId: query.wellId } : {}),
        ...(query.priority ? { priority: query.priority } : {}),
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search } },
                { assignee: { contains: query.search } },
                { well: { number: { contains: query.search } } },
              ],
            }
          : {}),
      },
      orderBy: [{ updatedAt: 'desc' }],
      include: ticketInclude,
    });
    return tickets.map(toTicketDto);
  }

  async get(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { ...ticketInclude, comments: { orderBy: { createdAt: 'asc' } } },
    });
    if (!ticket) throw new NotFoundException('Заявка не найдена');

    return {
      ...toTicketDto(ticket),
      comments: ticket.comments.map((comment) => ({
        id: comment.id,
        author: comment.author,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
      })),
    };
  }

  async create(input: CreateTicketInput) {
    try {
      const ticket = await this.prisma.ticket.create({ data: input, include: ticketInclude });
      return toTicketDto(ticket);
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.ForeignKeyViolation)) {
        throw new NotFoundException('Скважина не найдена');
      }
      throw error;
    }
  }

  async update(id: number, input: UpdateTicketInput) {
    // Чтение и запись в одной транзакции: статус не изменится между проверкой и сохранением.
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.ticket.findUnique({ where: { id } });
      if (!current) throw new NotFoundException('Заявка не найдена');

      const now = new Date();
      const transition = input.status
        ? statusTransition(current.status, input.status, now)
        : { markWellChecked: false };

      const ticket = await tx.ticket.update({
        where: { id },
        data: {
          ...input,
          ...(transition.resolvedAt !== undefined ? { resolvedAt: transition.resolvedAt } : {}),
        },
        include: ticketInclude,
      });

      if (transition.markWellChecked) {
        await tx.well.update({ where: { id: current.wellId }, data: { lastCheckAt: now } });
      }
      return toTicketDto(ticket);
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.ticket.delete({ where: { id } });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.NotFound)) {
        throw new NotFoundException('Заявка не найдена');
      }
      throw error;
    }
  }

  async addComment(ticketId: number, input: CreateCommentInput) {
    try {
      const comment = await this.prisma.comment.create({ data: { ...input, ticketId } });
      return {
        id: comment.id,
        author: comment.author,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
      };
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.ForeignKeyViolation)) {
        throw new NotFoundException('Заявка не найдена');
      }
      throw error;
    }
  }
}
