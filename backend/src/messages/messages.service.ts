import { Injectable, NotFoundException } from '@nestjs/common';
import { isPrismaError, PrismaErrorCode } from '../common/prisma-errors.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ContactMessageInput } from './messages.schemas.js';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: ContactMessageInput) {
    const message = await this.prisma.message.create({ data: input });
    return { ...message, createdAt: message.createdAt.toISOString() };
  }

  async list() {
    const messages = await this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    return messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString() }));
  }

  async remove(id: number) {
    try {
      await this.prisma.message.delete({ where: { id } });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.NotFound)) {
        throw new NotFoundException('Сообщение не найдено');
      }
      throw error;
    }
  }

  async clear() {
    await this.prisma.message.deleteMany();
  }
}
