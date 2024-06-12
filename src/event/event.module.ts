import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';
import {TenantModule} from "../tenant/tenant.module";

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [PrismaModule, TenantModule],
  exports: [EventService],
})
export class EventModule {}
