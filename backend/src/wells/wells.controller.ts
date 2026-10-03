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
  listWellsQuerySchema,
  updateWellSchema,
  wellInputSchema,
  type ListWellsQuery,
  type UpdateWellInput,
  type WellInput,
} from './wells.schemas.js';
import { WellsService } from './wells.service.js';

@Controller()
export class WellsController {
  constructor(private readonly wells: WellsService) {}

  @Get('ngdus')
  listNgdus() {
    return this.wells.listNgdus();
  }

  @Get('wells')
  list(@Query(new ZodValidationPipe(listWellsQuerySchema)) query: ListWellsQuery) {
    return this.wells.list(query);
  }

  @Get('wells/:id')
  get(@Param('id', IdPipe) id: number) {
    return this.wells.get(id);
  }

  @Post('wells')
  @UseGuards(AdminGuard)
  create(@Body(new ZodValidationPipe(wellInputSchema)) body: WellInput) {
    return this.wells.create(body);
  }

  @Patch('wells/:id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', IdPipe) id: number,
    @Body(new ZodValidationPipe(updateWellSchema)) body: UpdateWellInput,
  ) {
    return this.wells.update(id, body);
  }

  @Delete('wells/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param('id', IdPipe) id: number) {
    return this.wells.remove(id);
  }
}
