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
  Req, UseGuards,
} from '@nestjs/common';
import { PatientEncounter as PatientEncounterModel } from '.prisma/client';
import { EncounterService } from './encounter.service';
import { CreatePatientEncounterDto } from './dto/createPatientEncounter.dto';
import { QuerySearchParamsDto } from './dto/querySearchParams.dto';
import {RealTimeStatsOfEventDto} from "./dto/realTimeStatsOfEventDto";
import {QueryStatsParamsDto} from "./dto/queryStatsParams.dto";
import {LogtoAuthGuard} from "../auth/auth.guard";
import {Roles} from "../auth/roles.decorator";

@Controller('encounter')
@UseGuards(LogtoAuthGuard)
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  @Get('/stats')
  @Roles(['admin', 'coordinator'])
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

  @Get('/active/event/:eventId/aidPost/:aidPostId')
  @Roles(['admin', 'coordinator', 'user'])
  async getActiveRegistrationsForAidPost(
      @Req() req,
      @Param('eventId') eventId: number,
      @Param('aidPostId') aidPostId: number,
  ): Promise<PatientEncounterModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.encounterService.getActiveRegistrationsForAidPost(eventId, aidPostId, tenantId);
  }

  @Post('/startTreatment')
  @Roles(['admin', 'coordinator', 'user'])
  async startTreatment(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Query('encounterId') encounterId: string,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!eventId || isNaN(+eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!aidPostId || isNaN(+aidPostId)) {
      throw new BadRequestException('AidPost ID is invalid');
    }
    if (!encounterId || isNaN(+encounterId)) {
      throw new BadRequestException('Encounter ID is invalid');
    }

    return this.encounterService.startTreatment(tenantId, +eventId, +aidPostId, +encounterId);
  }

  @Post()
  @Roles(['user'])
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
  @Roles(['admin'])
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
  @Roles(['admin'])
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
  @Roles(['admin'])
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
  @Roles(['admin'])
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
