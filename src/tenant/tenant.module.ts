import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [TenantService],
  controllers: [TenantController],
  imports: [PrismaModule],
  exports: [TenantService],
})
export class TenantModule {}
