import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [PrismaModule, TenantModule],
})
export class FeedbackModule {}
