import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { IdPipe, ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { contactMessageSchema, type ContactMessageInput } from './messages.schemas.js';
import { MessagesService } from './messages.service.js';

/** Отправить сообщение может любой; читать и удалять — только администратор (в сообщениях есть email). */
@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Post()
  create(@Body(new ZodValidationPipe(contactMessageSchema)) body: ContactMessageInput) {
    return this.messages.create(body);
  }

  @Get()
  @UseGuards(AdminGuard)
  list() {
    return this.messages.list();
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param('id', IdPipe) id: number) {
    return this.messages.remove(id);
  }

  @Delete()
  @UseGuards(AdminGuard)
  @HttpCode(204)
  clear() {
    return this.messages.clear();
  }
}
