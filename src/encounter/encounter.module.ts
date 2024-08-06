import { Module } from '@nestjs/common';
import { EncounterController } from './encounter.controller';
import { EncounterService } from './encounter.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  controllers: [EncounterController],
  providers: [EncounterService],
  imports: [PrismaModule, EventModule, TenantModule],
})
export class EncounterModule {}
