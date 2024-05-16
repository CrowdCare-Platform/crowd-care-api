import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TenantService],
  controllers: [TenantController],
  imports: [PrismaModule],
})
export class TenantModule {}
