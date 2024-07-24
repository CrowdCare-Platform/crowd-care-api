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
  Req, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { PatientEncounter as PatientEncounterModel } from '.prisma/client';
import { EncounterService } from './encounter.service';
import { CreatePatientEncounterDto } from './dto/createPatientEncounter.dto';
import { QuerySearchParamsDto } from './dto/querySearchParams.dto';
import {RealTimeStatsOfEventDto} from "./dto/realTimeStatsOfEventDto";
import {QueryStatsParamsDto} from "./dto/queryStatsParams.dto";
import {LogtoAuthGuard} from "../auth/auth.guard";
import {Roles} from "../auth/roles.decorator";
import {CreateParameterSetDto} from "./dto/createParameterSet.dto";
import {AddTriageDto} from "./dto/addTriage.dto";
import {RegulationPayloadDto} from "./dto/regulationPayload.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('encounter')
@UseGuards(LogtoAuthGuard)
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  @Post('/uploadImage')
  @Roles(['admin', 'coordinator', 'user'])
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
      @Req() req,
      @Query('eventId') eventId: string,
      @Query('aidPostId') aidPostId: string,
      @Query('rfid') rfid: string,
      @UploadedFile() file
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
    if (!rfid) {
      throw new BadRequestException('Rfid not found');
    }
    return this.encounterService.uploadImage(tenantId, +eventId, +aidPostId, rfid, file);
  }
  @Post('/parameters')
  @Roles(['admin', 'coordinator', 'user'])
  async addParameters(
      @Req() req,
      @Query('eventId') eventId: string,
      @Query('aidPostId') aidPostId: string,
      @Query('code') code: string,
      @Body() createParameterSetDto: CreateParameterSetDto,
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
    if (!code) {
      throw new BadRequestException('QrCode or rfid not found');
    }

    return this.encounterService.addParameters(tenantId, +eventId, +aidPostId, code, createParameterSetDto);
  }

  @Post('/regulation')
  @Roles(['admin', 'coordinator', 'user'])
  async regulation(
      @Req() req,
      @Query('eventId') eventId: string,
      @Query('aidPostId') aidPostId: string,
      @Query('code') code: string,
      @Body() regulationPayload: RegulationPayloadDto,
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
    if (!code) {
      throw new BadRequestException('Rfid of QRCode not found');
    }

    return this.encounterService.regulation(tenantId, +eventId, +aidPostId, code, regulationPayload);
  }

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

  @Get('/event/:eventId/rfid/:rfid')
  @Roles(['admin', 'coordinator', 'user'])
  async getAllEncountersForRfid(
      @Req() req,
      @Param('eventId') eventId: number,
      @Param('rfid') rfid: string,
  ): Promise<PatientEncounterModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.encounterService.getAllEncountersForRfid(rfid, eventId, tenantId);
  }

  @Post('/startTreatment')
  @Roles(['admin', 'coordinator', 'user'])
  async startTreatment(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Query('encounterId') encounterId?: string,
    @Query('rfid') rfid?: string,
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
    if ((!encounterId || isNaN(+encounterId)) && !rfid) {
      throw new BadRequestException('Encounter ID is invalid or no rfid in request');
    }

    return this.encounterService.startTreatment(tenantId, +eventId, +aidPostId, encounterId, rfid);
  }

  @Post('/triage')
  @Roles(['admin', 'coordinator', 'user'])
  async addTriage(
      @Req() req,
      @Query('eventId') eventId: string,
      @Query('aidPostId') aidPostId: string,
      @Query('rfid') rfid: string,
      @Body() triageBody: AddTriageDto,
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
    if (!rfid) {
      throw new BadRequestException('No rfid in request');
    }
    return this.encounterService.addTriage(tenantId, +eventId, +aidPostId, rfid, triageBody);
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
    const userId = req.user.id;
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

  @Get('/active')
  @Roles(['user'])
  async findActiveRfid(
      @Req() req,
      @Query('eventId') eventId: number,
      @Query('aidPostId') aidPostId: number,
      @Query('rfid') rfid?: string,
      @Query('qrCode') qrCode?: string,
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
    if (!rfid && !qrCode) {
      throw new BadRequestException('No RFID of QrCode in request');
    }

    if (qrCode && rfid) {
        throw new BadRequestException('Both RFID and QrCode in request');
    }
    return this.encounterService.findActiveRfid(eventId, aidPostId, tenantId, rfid, qrCode);
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
