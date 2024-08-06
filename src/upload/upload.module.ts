import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  providers: [UploadService],
  controllers: [UploadController],
  imports: [PrismaModule, TenantModule],
})
export class UploadModule {}
