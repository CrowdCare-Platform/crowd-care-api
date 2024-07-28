import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req, UseGuards,
} from '@nestjs/common';
import { Event as EventModel } from '@prisma/client';
import { CreateEventDto } from './dto/createEvent.dto';
import { EventService } from './event.service';
import { CreateAmbulanceDto } from './dto/createAmbulance.dto';
import { CreateHospitalDto } from './dto/createHospital.dto';
import {CreateAidPostDto} from "./dto/createAidPost.dto";
import {LogtoAuthGuard} from "../auth/auth.guard";
import {Roles} from "../auth/roles.decorator";

@Controller('event')
@UseGuards(LogtoAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles(['ADMIN'])
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
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async findAll(@Req() req): Promise<EventModel[]> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.findAll(tenantId);
  }

  @Get('/:id')
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async findOne(@Req() req, @Param('id') id: number): Promise<EventModel> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.findOne(id, tenantId);
  }

  @Delete('/:id')
  @Roles(['ADMIN'])
  async delete(@Req() req, @Param('id') id: number): Promise<void> {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.delete(id, tenantId);
  }

  @Put('/:id')
  @Roles(['ADMIN'])
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
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async getAmbulances(@Req() req, @Param('id') id: number) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.getAmbulances(id, tenantId);
  }

  @Get('/:id/ambulance/:ambulanceId')
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
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
  @Roles(['ADMIN'])
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
  @Roles(['ADMIN'])
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
  @Roles(['ADMIN'])
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

  @Get('/:id/hospital')
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async getHospitals(@Req() req, @Param('id') id: number) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.getHospitals(id, tenantId);
  }

  @Get('/:id/hospital/:hospitalId')
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async getHospital(
    @Req() req,
    @Param('id') id: number,
    @Param('hospitalId') hospitalId: number,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.getHospital(id, hospitalId, tenantId);
  }

  @Post('/:id/hospital')
  @Roles(['ADMIN'])
  async createHospital(
    @Req() req,
    @Param('id') id: number,
    @Body() createHospitalDto: CreateHospitalDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.createHospital(id, createHospitalDto, tenantId);
  }

  @Put('/:id/hospital/:hospitalId')
  @Roles(['ADMIN'])
  async updateHospital(
    @Req() req,
    @Param('id') id: number,
    @Param('hospitalId') hospitalId: number,
    @Body() createHospitalDto: CreateHospitalDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.updateHospital(
      id,
      hospitalId,
      createHospitalDto,
      tenantId,
    );
  }

  @Delete('/:id/hospital/:hospitalId')
  @Roles(['ADMIN'])
  async deleteHospital(
    @Req() req,
    @Param('id') id: number,
    @Param('hospitalId') hospitalId: number,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.deleteHospital(id, hospitalId, tenantId);
  }

  @Get('/:id/aidPost')
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async getAidPosts(@Req() req, @Param('id') id: number) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.getAidPosts(id, tenantId);
  }

  @Get('/:id/aidPost/:aidPostId')
  @Roles(['ADMIN', 'APP', 'CP-MED', 'CP-EVENT', 'EPD'])
  async getAidPost (
      @Req() req,
      @Param('id') id: number,
      @Param('aidPostId') aidPostId: number,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.getAidPost(id, aidPostId, tenantId);
  }

  @Post('/:id/aidPost')
  @Roles(['ADMIN'])
  async createAidPost(
      @Req() req,
      @Param('id') id: number,
      @Body() createAidPostDto: CreateAidPostDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.createAidPost(id, createAidPostDto, tenantId);
  }

  @Put('/:id/aidPost/:aidPostId')
  @Roles(['ADMIN'])
  async updateAidPost(
      @Req() req,
      @Param('id') id: number,
      @Param('aidPostId') aidPostId: number,
      @Body() createAidPostDto: CreateAidPostDto,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.updateAidPost(
        id,
        aidPostId,
        createAidPostDto,
        tenantId,
    );
  }

  @Delete('/:id/aidPost/:aidPostId')
  @Roles(['ADMIN'])
  async deleteAidPost(
      @Req() req,
      @Param('id') id: number,
      @Param('aidPostId') aidPostId: number,
  ) {
    const tenantId = +req.headers['tenant-id'];
    if (!tenantId || isNaN(tenantId)) {
      throw new BadRequestException('Tenant ID is invalid');
    }
    return this.eventService.deleteAidPost(id, aidPostId, tenantId);
  }
}
