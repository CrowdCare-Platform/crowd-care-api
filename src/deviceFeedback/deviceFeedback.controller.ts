import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LogtoAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { NewDeviceFeedbackDto } from './dto/newDeviceFeedback.dto';
import { DeviceFeedbackService } from './deviceFeedback.service';

@Controller('deviceFeedback')
@UseGuards(LogtoAuthGuard)
export class DeviceFeedbackController {
  constructor(private readonly deviceFeedbackService: DeviceFeedbackService) {}
  @Post()
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async addFeedback(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Body() payload: NewDeviceFeedbackDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    const userId = req.user.id;

    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    if (!eventId) {
      throw new BadRequestException('Event ID is invalid');
    }
    if (!aidPostId) {
      throw new BadRequestException('Aid Post ID is invalid');
    }

    return this.deviceFeedbackService.addDeviceFeedback(
      tenantId,
      eventId,
      aidPostId,
      userId,
      payload,
    );
  }

  @Delete()
  @Roles(['ADMIN'])
  async deleteAllFeedback(@Req() req) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }

    return this.deviceFeedbackService.deleteAllDeviceFeedback();
  }
}
