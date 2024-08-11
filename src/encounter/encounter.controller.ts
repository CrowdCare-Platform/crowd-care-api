import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PatientEncounter as PatientEncounterModel, Location as LocationModel } from '.prisma/client';
import { EncounterService } from './encounter.service';
import { CreatePatientEncounterDto } from './dto/createPatientEncounter.dto';
import { QuerySearchParamsDto } from './dto/querySearchParams.dto';
import { RealTimeStatsOfEventDto } from './dto/realTimeStatsOfEventDto';
import { QueryStatsParamsDto } from './dto/queryStatsParams.dto';
import { LogtoAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateParameterSetDto } from './dto/createParameterSet.dto';
import { AddTriageDto } from './dto/addTriage.dto';
import { RegulationPayloadDto } from './dto/regulationPayload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetEncountersWithFiltersDto } from './dto/getEncountersWithFilters.dto';
import {RealTimeLocationsOfEventDto} from "./dto/realTimeLocationsOfEventDto";

@Controller('encounter')
@UseGuards(LogtoAuthGuard)
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  @Post('/changeLocation')
  @Roles(['APP'])
  async changeLocation(
      @Req() req,
      @Query('eventId') eventId: string,
      @Query('aidPostId') aidPostId: string,
      @Query('rfid') rfid: string,
      @Query('newLocation') newLocation: LocationModel,
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
    if (!newLocation) {
      throw new BadRequestException('No new location in request');
    }
    return this.encounterService.changeLocation(
        tenantId,
        +eventId,
        +aidPostId,
        rfid,
        newLocation,
    );
  }

  @Get('rawData')
  @Roles(['CP-EVENT'])
  async getRawData(
    @Req() req,
    @Query('eventId') eventId: string,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!eventId || isNaN(+eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    return this.encounterService.getRawData(
      tenantId,
      +eventId,
    );
  }


  @Post('/updateNotes')
  @Roles(['EPD'])
  async updateNotes(
    @Req() req,
    @Query('encounterId') encounterId: string,
    @Query('eventId') eventId: string,
    @Body() body: { notes: string },
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!eventId || isNaN(+eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    return this.encounterService.updateNotes(
      encounterId,
      tenantId,
      +eventId,
      body,
    );
  }

  @Get('attachment')
  @Roles(['EPD'])
  async downloadAttachment(
    @Req() req,
    @Query('type') type: 'FORM' | 'IMAGE' | 'MEDICATION_REGISTRATION',
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Query('attachmentName') attachmentName: string,
  ): Promise<{ url: string }> {
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
    if (!type) {
      throw new BadRequestException('Attachment type not found');
    }
    if (!attachmentName) {
      throw new BadRequestException('Attachment name not found');
    }
    return this.encounterService.downloadAttachment(
      tenantId,
      type,
      attachmentName,
      +eventId,
      +aidPostId,
    );
  }

  @Post('/uploadImage')
  @Roles(['APP'])
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Query('rfid') rfid: string,
    @UploadedFile() file,
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
    return this.encounterService.uploadImage(
      tenantId,
      +eventId,
      +aidPostId,
      rfid,
      file,
    );
  }

  @Get('/parameters')
  @Roles(['APP', 'EPD'])
  async getParameters(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Query('code') code: string,
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

    return this.encounterService.getParameters(
      tenantId,
      +eventId,
      +aidPostId,
      code,
    );
  }

  @Post('/parameters')
  @Roles(['APP'])
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

    return this.encounterService.addParameters(
      tenantId,
      +eventId,
      +aidPostId,
      code,
      createParameterSetDto,
    );
  }

  @Post('/regulation')
  @Roles(['APP'])
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

    return this.encounterService.regulation(
      tenantId,
      +eventId,
      +aidPostId,
      code,
      regulationPayload,
    );
  }

  @Get('/stats')
  @Roles(['CP-EVENT', 'CP-MED'])
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

    return this.encounterService.getRealTimeStatsOfEvent(
      +query.eventId,
      tenantId,
    );
  }

  @Get('/locations')
  @Roles(['CP-EVENT', 'CP-MED'])
  async getRealTimeLocationsOfEvent(
      @Req() req,
      @Query() query: QueryStatsParamsDto,
  ): Promise<RealTimeLocationsOfEventDto[]> {
    const tenantId = +req.headers['tenant-id'];
    if (isNaN(+query.eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }

    return this.encounterService.getRealTimeLocationsOfEvent(
        +query.eventId,
        tenantId,
    );
  }

  @Get('/active/event/:eventId/aidPost/:aidPostId')
  @Roles(['APP', 'EPD', 'CP-MED', 'CP-EVENT'])
  async getActiveRegistrationsForAidPost(
    @Req() req,
    @Param('eventId') eventId: number,
    @Param('aidPostId') aidPostId: number,
  ): Promise<PatientEncounterModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.encounterService.getActiveRegistrationsForAidPost(
      eventId,
      aidPostId,
      tenantId,
    );
  }

  @Get('/event/:eventId/rfid/:rfid')
  @Roles(['APP', 'EPD', 'CP-MED', 'CP-EVENT'])
  async getAllEncountersForRfid(
    @Req() req,
    @Param('eventId') eventId: number,
    @Param('rfid') rfid: string,
  ): Promise<PatientEncounterModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.encounterService.getAllEncountersForRfid(
      rfid,
      eventId,
      tenantId,
    );
  }

  @Post('/startTreatment')
  @Roles(['APP'])
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
      throw new BadRequestException(
        'Encounter ID is invalid or no rfid in request',
      );
    }

    return this.encounterService.startTreatment(
      tenantId,
      +eventId,
      +aidPostId,
      encounterId,
      rfid,
    );
  }

  @Post('/triage')
  @Roles(['APP'])
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
    return this.encounterService.addTriage(
      tenantId,
      +eventId,
      +aidPostId,
      rfid,
      triageBody,
    );
  }

  @Post()
  @Roles(['APP'])
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
  @Roles(['APP'])
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
    return this.encounterService.findActiveRfid(
      eventId,
      aidPostId,
      tenantId,
      rfid,
      qrCode,
    );
  }

  @Get('/withFilter')
  @Roles(['EPD'])
  async findAllWithFilter(
    @Req() req,
    @Query() query: GetEncountersWithFiltersDto,
  ): Promise<PatientEncounterModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.encounterService.findWithFilters(query);
  }

  @Get()
  @Roles(['EPD'])
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
  @Roles(['EPD'])
  async findOne(
    @Req() req,
    @Param('id') id: number,
  ): Promise<PatientEncounterModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!id || isNaN(id)) {
      throw new BadRequestException('Encounter ID is invalid');
    }
    return this.encounterService.findOne(tenantId, id);
  }

  @Put(':id')
  @Roles(['EPD'])
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
}
