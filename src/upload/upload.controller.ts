import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogtoAuthGuard } from '../auth/auth.guard';
import { UploadService } from './upload.service';
import { Roles } from '../auth/roles.decorator';

@Controller('upload')
@UseGuards(LogtoAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Roles(['UPLOAD'])
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() req,
    @Query('eventId') eventId: string,
    @UploadedFile() file: any,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!eventId || isNaN(+eventId)) {
      throw new BadRequestException('Event ID is invalid');
    }
    return this.uploadService.uploadFiles(tenantId, +eventId, file);
  }
}
