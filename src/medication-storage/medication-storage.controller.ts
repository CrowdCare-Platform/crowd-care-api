import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LogtoAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMedicationStorageDto } from './dto/createMedicationStorage.dto';
import { MedicationStorageService } from './medication-storage.service';

@Controller('medication-storage')
@UseGuards(LogtoAuthGuard)
export class MedicationStorageController {
  constructor(
    private readonly medicationStorageService: MedicationStorageService,
  ) {}

  @Get('/amount/:eventId')
  @Roles(['CP-MED'])
  async getAmountOfStorage(@Req() req, @Param('eventId') eventId: string) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!eventId || isNaN(+eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    return this.medicationStorageService.getAmountOfStorage(tenantId, +eventId);
  }

  @Post()
  @Roles(['APP'])
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Query('rfid') rfid: string,
    @UploadedFile() file,
    @Body() createMedicationStorageBody: CreateMedicationStorageDto,
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
    return this.medicationStorageService.create(
      tenantId,
      eventId,
      aidPostId,
      rfid,
      file,
      createMedicationStorageBody,
    );
  }

  @Get('/sticker/:stickerCode')
  @Roles(['APP', 'EPD'])
  getMedicationStorageByStickerCode(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Param('stickerCode') stickerCode: string,
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
    if (!stickerCode) {
      throw new BadRequestException('Sticker code not found');
    }
    return this.medicationStorageService.getMedicationStorageByStickerCode(
      tenantId,
      +eventId,
      +aidPostId,
      stickerCode,
    );
  }

  @Get('/rfid/:rfid')
  @Roles(['APP', 'EPD'])
  getMedicationStorageByRfid(
    @Req() req,
    @Query('eventId') eventId: string,
    @Param('rfid') rfid: string,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!eventId || isNaN(+eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!rfid) {
      throw new BadRequestException('Rfid not found');
    }
    return this.medicationStorageService.getMedicationStorageByRfid(
      tenantId,
      +eventId,
      rfid,
    );
  }

  @Delete('/:id')
  @Roles(['APP'])
  softDeleteMedicationStorage(
    @Req() req,
    @Param('id') id: string,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!id || isNaN(+id)) {
      throw new BadRequestException('Medication storage ID is invalid');
    }
    if (!aidPostId || isNaN(+aidPostId)) {
      throw new BadRequestException('AidPost ID is invalid');
    }
    return this.medicationStorageService.softDeleteMedicationStorage(
      tenantId,
      +eventId,
      +aidPostId,
      +id,
    );
  }
}
