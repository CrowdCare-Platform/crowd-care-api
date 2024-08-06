import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { LogtoAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { NewFeedbackDto } from './dto/newFeedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
@UseGuards(LogtoAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post()
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async create(
    @Req() req,
    @Query('eventId') eventId: string,
    @Query('aidPostId') aidPostId: string,
    @Body() payload: NewFeedbackDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    const userId = req.user.id;
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }

    return this.feedbackService.addFeedback(
      tenantId,
      eventId,
      aidPostId,
      userId,
      payload,
    );
  }
}
