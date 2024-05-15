import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Event as EventModel } from '@prisma/client';
import { CreateEventDto } from './dto/createEvent.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventModel> {
    // get tenant ID from the request headers
    const tenantId = req.headers['tenant-id'];
    return this.eventService.create({
      ...createEventDto,
      tenant: { connect: { id: tenantId } },
    });
  }

  @Get()
  async findAll(@Req() req): Promise<EventModel[]> {
    const tenantId = req.headers['tenant-id'];
    return this.eventService.findAll(tenantId);
  }

  @Get('/:id')
  async findOne(@Req() req, @Param('id') id: number): Promise<EventModel> {
    const tenantId = req.headers['tenant-id'];
    return this.eventService.findOne(id, tenantId);
  }

  @Delete('/:id')
  async delete(@Req() req, @Param() id: number): Promise<EventModel> {
    const tenantId = req.headers['tenant-id'];
    return this.eventService.delete(id, tenantId);
  }

  @Put('/:id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventModel> {
    const tenantId = req.headers['tenant-id'];
    return this.eventService.update(id, createEventDto, tenantId);
  }
}
