import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TenantService, PrismaService],
  controllers: [TenantController],
})
export class TenantModule {}
