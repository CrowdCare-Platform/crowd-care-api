import { Module } from '@nestjs/common';
import { MedicationStorageController } from './medication-storage.controller';
import { MedicationStorageService } from './medication-storage.service';
import {PrismaModule} from "../prisma/prisma.module";
import {TenantModule} from "../tenant/tenant.module";
import {EventModule} from "../event/event.module";

@Module({
  controllers: [MedicationStorageController],
  providers: [MedicationStorageService],
  imports: [PrismaModule, TenantModule, EventModule],
})
export class MedicationStorageModule {}
