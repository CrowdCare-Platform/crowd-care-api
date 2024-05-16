import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmbulanceDto } from "./dto/createAmbulance.dto";

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}
  async create(createEventDto: Prisma.EventCreateInput) {
    return this.prisma.event.create({
      data: { ...createEventDto },
    });
  }

  async findAll(tenantId: number) {
    return this.prisma.event.findMany({
      where: { tenantId },
    });
  }

  async findOne(id: number, tenantId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id, tenantId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async delete(id: number, tenantId) {
    return this.prisma.event.delete({
      where: { id, tenantId },
    });
  }

  async update(
    id: number,
    updateTenantDto: Prisma.EventUpdateInput,
    tenantId: number,
  ) {
    return this.prisma.event.update({
      where: { id, tenantId },
      data: updateTenantDto,
    });
  }

  async getAmbulances(eventId: number, tenantId: number) {
    await this.findOne(eventId, tenantId);
    return this.prisma.ambulance.findMany({
      where: { eventId },
    });
  }

  async getAmbulance(eventId: number, ambulanceId: number, tenantId: number) {
    await this.findOne(eventId, tenantId);
    const ambulance = await this.prisma.ambulance.findUnique({
      where: { id: ambulanceId, eventId },
    });
    if (!ambulance) {
      throw new NotFoundException('Ambulance not found');
    }
    return ambulance;
  }


  async createAmbulance(id: number, createAmbulanceDto: CreateAmbulanceDto, tenantId: number) {
    await this.findOne(id, tenantId);
    return this.prisma.ambulance.create({
      data: {
        ...createAmbulanceDto,
        event: { connect: { id } },
      },
    });
  }

  async updateAmbulance(id: number, ambulanceId: number, createAmbulanceDto: CreateAmbulanceDto, tenantId: number) {
    await this.findOne(id, tenantId);
    return this.prisma.ambulance.update({
      where: { id: ambulanceId },
      data: createAmbulanceDto,
    });
  }

  async deleteAmbulance(id: number, ambulanceId: number, tenantId: number) {
    await this.findOne(id, tenantId);
    return this.prisma.ambulance.delete({
      where: { id: ambulanceId },
    });
  }
}
