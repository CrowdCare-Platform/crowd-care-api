import { Module } from '@nestjs/common';
import { DeviceFeedbackController } from './deviceFeedback.controller';
import { DeviceFeedbackService } from './deviceFeedback.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  controllers: [DeviceFeedbackController],
  providers: [DeviceFeedbackService],
  imports: [PrismaModule, TenantModule],
})
export class DeviceFeedbackModule {}
