import { Module } from '@nestjs/common';
import { AmbulanceController } from './ambulance/ambulance.controller';
import { AmbulanceService } from './ambulance/ambulance.service';
import { HospitalController } from './hospital/hospital.controller';
import { HospitalService } from './hospital/hospital.service';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  controllers: [AmbulanceController, HospitalController, EventController],
  providers: [AmbulanceService, HospitalService, EventService],
})
export class EventModule {}
