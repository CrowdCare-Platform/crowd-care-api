import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { EventModule } from './event/event.module';
import { EncounterModule } from './encounter/encounter.module';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [HealthModule, EventModule, EncounterModule, TenantModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
