import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { MessagesModule } from './messages/messages.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { StatsModule } from './stats/stats.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { WellsModule } from './wells/wells.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WellsModule,
    TicketsModule,
    MessagesModule,
    StatsModule,
  ],
})
export class AppModule {}
