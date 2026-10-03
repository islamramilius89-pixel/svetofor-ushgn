import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { WellsController } from './wells.controller.js';
import { WellsService } from './wells.service.js';

@Module({
  imports: [AuthModule],
  controllers: [WellsController],
  providers: [WellsService],
})
export class WellsModule {}
