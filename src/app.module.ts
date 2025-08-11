import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { EventModule } from './event/event.module';
import { EncounterModule } from './encounter/encounter.module';
import { TenantModule } from './tenant/tenant.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MedicationStorageModule } from './medication-storage/medication-storage.module';
import { FeedbackModule } from './feedback/feedback.module';
import { UploadModule } from './upload/upload.module';
import { DeviceFeedbackModule } from './deviceFeedback/deviceFeedback.module';

@Module({
  imports: [
    HealthModule,
    EventModule,
    EncounterModule,
    TenantModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600000,
    }),
    MedicationStorageModule,
    FeedbackModule,
    DeviceFeedbackModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
