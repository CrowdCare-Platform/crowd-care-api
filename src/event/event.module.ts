import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [PrismaModule],
})
export class EventModule {}
