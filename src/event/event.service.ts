import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmbulanceDto } from './dto/createAmbulance.dto';
import { CreateHospitalDto } from './dto/createHospital.dto';
import { CreateAidPostDto } from './dto/createAidPost.dto';

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
    await this.prisma.event.delete({
      where: { id, tenantId },
    });
    return null;
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

  async createAmbulance(
    id: number,
    createAmbulanceDto: CreateAmbulanceDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.ambulance.create({
      data: {
        ...createAmbulanceDto,
        event: { connect: { id } },
      },
    });
  }

  async updateAmbulance(
    id: number,
    ambulanceId: number,
    createAmbulanceDto: CreateAmbulanceDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.ambulance.update({
      where: { id: ambulanceId },
      data: createAmbulanceDto,
    });
  }

  async deleteAmbulance(id: number, ambulanceId: number, tenantId: number) {
    await this.findOne(id, tenantId);
    await this.prisma.ambulance.delete({
      where: { id: ambulanceId },
    });
    return null;
  }

  async getHospitals(eventId: number, tenantId: number) {
    await this.findOne(eventId, tenantId);
    return this.prisma.hospital.findMany({
      where: { eventId },
    });
  }

  async getHospital(eventId: number, hospitalId: number, tenantId: number) {
    await this.findOne(eventId, tenantId);
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId, eventId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    return hospital;
  }

  async createHospital(
    id: number,
    createHospitalDto: CreateHospitalDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.hospital.create({
      data: {
        ...createHospitalDto,
        event: { connect: { id } },
      },
    });
  }

  async updateHospital(
    id: number,
    hospitalId: number,
    createHospitalDto: CreateHospitalDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.hospital.update({
      where: { id: hospitalId },
      data: createHospitalDto,
    });
  }

  async deleteHospital(id: number, hospitalId: number, tenantId: number) {
    await this.findOne(id, tenantId);
    await this.prisma.hospital.delete({
      where: { id: hospitalId },
    });
    return null;
  }

  async getAidPosts(eventId: number, tenantId: number) {
    await this.findOne(eventId, tenantId);
    return this.prisma.aidPost.findMany({
      where: { eventId },
    });
  }

  async getAidPost(eventId: number, aidPostId: number, tenantId: number) {
    await this.findOne(eventId, tenantId);
    const aidPost = await this.prisma.aidPost.findUnique({
      where: { id: aidPostId, eventId },
    });
    if (!aidPost) {
      throw new NotFoundException('Aidpost not found');
    }
    return aidPost;
  }

  async createAidPost(
    id: number,
    createAidPostDto: CreateAidPostDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.aidPost.create({
      data: {
        ...createAidPostDto,
        event: { connect: { id } },
      },
    });
  }

  async updateAidPost(
    id: number,
    aidPostId: number,
    createAidPostDto: CreateAidPostDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.aidPost.update({
      where: { id: aidPostId },
      data: createAidPostDto,
    });
  }

  async deleteAidPost(id: number, aidPostId: number, tenantId: number) {
    await this.findOne(id, tenantId);
    await this.prisma.aidPost.delete({
      where: { id: aidPostId },
    });
    return null;
  }
}
