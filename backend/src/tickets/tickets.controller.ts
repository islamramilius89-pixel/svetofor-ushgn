import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { IdPipe, ZodValidationPipe } from '../common/zod-validation.pipe.js';
import {
  createCommentSchema,
  createTicketSchema,
  listTicketsQuerySchema,
  updateTicketSchema,
  type CreateCommentInput,
  type CreateTicketInput,
  type ListTicketsQuery,
  type UpdateTicketInput,
} from './tickets.schemas.js';
import { TicketsService } from './tickets.service.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  list(@Query(new ZodValidationPipe(listTicketsQuerySchema)) query: ListTicketsQuery) {
    return this.tickets.list(query);
  }

  @Get(':id')
  get(@Param('id', IdPipe) id: number) {
    return this.tickets.get(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createTicketSchema)) body: CreateTicketInput) {
    return this.tickets.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', IdPipe) id: number,
    @Body(new ZodValidationPipe(updateTicketSchema)) body: UpdateTicketInput,
  ) {
    return this.tickets.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param('id', IdPipe) id: number) {
    return this.tickets.remove(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id', IdPipe) id: number,
    @Body(new ZodValidationPipe(createCommentSchema)) body: CreateCommentInput,
  ) {
    return this.tickets.addComment(id, body);
  }
}
