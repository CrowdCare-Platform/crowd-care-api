import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { PatientEncounter as PatientEncounterModel } from '.prisma/client';
import { EncounterService } from './encounter.service';
import { CreatePatientEncounterDto } from './dto/createPatientEncounter.dto';
import { QuerySearchParamsDto } from './dto/querySearchParams.dto';
import {RealTimeStatsOfEventDto} from "./dto/realTimeStatsOfEventDto";
import {QueryStatsParamsDto} from "./dto/queryStatsParams.dto";

@Controller('encounter')
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  @Get('/stats')
  async getRealTimeStatsOfEvent(
      @Req() req,
      @Query() query: QueryStatsParamsDto,
  ): Promise<RealTimeStatsOfEventDto[]> {
    const tenantId = +req.headers['tenant-id'];
    if (isNaN(+query.eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }

    return this.encounterService.getRealTimeStatsOfEvent(+query.eventId, tenantId);
  }

  @Post()
  async create(
    @Req() req,
    @Query('eventId') eventId: number,
    @Query('aidPostId') aidPostId: number,
    @Body() createEncounterDto: CreatePatientEncounterDto,
  ): Promise<PatientEncounterModel> {
    const tenantId = +req.headers['tenant-id'];
    const userId = 'test';
    if (!eventId || isNaN(eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!aidPostId || isNaN(aidPostId)) {
      throw new BadRequestException('AidPost ID is invalid');
    }
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.encounterService.create(
      eventId,
      aidPostId,
      userId,
      tenantId,
      createEncounterDto,
    );
  }

  @Get()
  async findAll(
    @Req() req,
    @Query() query: QuerySearchParamsDto,
  ): Promise<PatientEncounterModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (isNaN(+query.eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (isNaN(+query.aidPostId)) {
      throw new BadRequestException('AidPost ID is invalid');
    }
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }

    return this.encounterService.findAll(query, tenantId);
  }

  @Get(':id')
  async findOne(
    @Req() req,
    @Query('eventId') eventId: number,
    @Query('aidPostId') aidPostId: number,
    @Param('id') id: number,
  ): Promise<PatientEncounterModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!eventId || isNaN(eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!aidPostId || isNaN(aidPostId)) {
      throw new BadRequestException('AidPost ID is invalid');
    }
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!id || isNaN(id)) {
      throw new BadRequestException('Encounter ID is invalid');
    }
    return this.encounterService.findOne(eventId, aidPostId, tenantId, id);
  }

  @Put(':id')
  async update(
    @Req() req,
    @Query('eventId') eventId: number,
    @Query('aidPostId') aidPostId: number,
    @Param('id') id: number,
    @Body() updateEncounterDto: CreatePatientEncounterDto,
  ): Promise<PatientEncounterModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!eventId || isNaN(eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!aidPostId || isNaN(aidPostId)) {
      throw new BadRequestException('AidPost ID is invalid');
    }
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!id || isNaN(id)) {
      throw new BadRequestException('Encounter ID is invalid');
    }
    return this.encounterService.update(
      eventId,
      aidPostId,
      tenantId,
      id,
      updateEncounterDto,
    );
  }

  @Delete(':id')
  async delete(
    @Req() req,
    @Query('eventId') eventId: number,
    @Query('aidPostId') aidPostId: number,
    @Param('id') id: number,
  ): Promise<PatientEncounterModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!eventId || isNaN(eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!aidPostId || isNaN(aidPostId)) {
      throw new BadRequestException('AidPost ID is invalid');
    }
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!id || isNaN(id)) {
      throw new BadRequestException('Encounter ID is invalid');
    }
    await this.encounterService.delete(eventId, aidPostId, tenantId, id);
    return null;
  }
}
