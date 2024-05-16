import {
  BadRequestException,
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
import { CreateAmbulanceDto } from './dto/createAmbulance.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.create({
      ...createEventDto,
      tenant: { connect: { id: tenantId } },
    });
  }

  @Get()
  async findAll(@Req() req): Promise<EventModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.findAll(tenantId);
  }

  @Get('/:id')
  async findOne(@Req() req, @Param('id') id: number): Promise<EventModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.findOne(id, tenantId);
  }

  @Delete('/:id')
  async delete(@Req() req, @Param() id: number): Promise<EventModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.delete(id, tenantId);
  }

  @Put('/:id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.update(id, createEventDto, tenantId);
  }

  @Get('/:id/ambulance')
  async getAmbulances(@Req() req, @Param('id') id: number) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.getAmbulances(id, tenantId);
  }

  @Get('/:id/ambulance/:ambulanceId')
  async getAmbulance(
    @Req() req,
    @Param('id') id: number,
    @Param('ambulanceId') ambulanceId: number,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.getAmbulance(id, ambulanceId, tenantId);
  }

  @Post('/:id/ambulance')
  async createAmbulance(
    @Req() req,
    @Param('id') id: number,
    @Body() createAmbulanceDto: CreateAmbulanceDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.createAmbulance(id, createAmbulanceDto, tenantId);
  }

  @Put('/:id/ambulance/:ambulanceId')
  async updateAmbulance(
    @Req() req,
    @Param('id') id: number,
    @Param('ambulanceId') ambulanceId: number,
    @Body() createAmbulanceDto: CreateAmbulanceDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.updateAmbulance(
      id,
      ambulanceId,
      createAmbulanceDto,
      tenantId,
    );
  }

  @Delete('/:id/ambulance/:ambulanceId')
  async deleteAmbulance(
    @Req() req,
    @Param('id') id: number,
    @Param('ambulanceId') ambulanceId: number,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.deleteAmbulance(id, ambulanceId, tenantId);
  }
}
