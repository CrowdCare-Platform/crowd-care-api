import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Prisma, Event, Ambulance, Hospital, AidPost} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAmbulanceDto } from './dto/createAmbulance.dto';
import { CreateHospitalDto } from './dto/createHospital.dto';
import { CreateAidPostDto } from './dto/createAidPost.dto';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async create(createEventDto: Prisma.EventCreateInput) {
    const newEvent = await this.prisma.event.create({
      data: { ...createEventDto },
    });
    await this.cacheManager.set(`event-id-${newEvent.id}`, newEvent);
    return newEvent;
  }

  async findAll(tenantId: number) {
    const cachedValue = await this.cacheManager.get<Event[]>(`allEvents-tenant-${tenantId}`);
    if (cachedValue) {
      return cachedValue;
    } else {
      const events = await this.prisma.event.findMany({
        where: { tenantId },
      });
      await this.cacheManager.set('`allEvents-tenant-${tenantId}', events);
      return events;
    }
  }

  async findOne(id: number, tenantId: number) {
    const cachedEvent = await this.cacheManager.get<Event>(`event-tenant-${tenantId}-id-${id}`);
    if (cachedEvent) {
      return cachedEvent;
    } else {
      const event = await this.prisma.event.findUnique({
        where: { id, tenantId },
      });
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      await this.cacheManager.set(`event-tenant-${tenantId}-id-${id}`, event);
      return event;
    }
  }

  async delete(id: number, tenantId: number) {
    await this.prisma.event.delete({
      where: { id, tenantId },
    });
    await this.cacheManager.reset();
  }

  async update(
    id: number,
    updateTenantDto: Prisma.EventUpdateInput,
    tenantId: number,
  ) {
    const event = await this.prisma.event.update({
      where: { id, tenantId },
      data: updateTenantDto,
    });
    await this.cacheManager.reset();
    return event;
  }

  async getAmbulances(eventId: number, tenantId: number) {
    const cachedAmbulances = await this.cacheManager.get<Ambulance[]>(`ambulances-tenant-${tenantId}-event-${eventId}`);
    if (cachedAmbulances) {
      return cachedAmbulances;
    } else {
      const ambulances = await this.prisma.ambulance.findMany({
        where: { eventId },
      });
      await this.cacheManager.set(`ambulances-tenant-${tenantId}-event-${eventId}`, ambulances);
      return ambulances;
    }
  }

  async getAmbulance(eventId: number, ambulanceId: number, tenantId: number) {
    const cachedAmbulance = await this.cacheManager.get<Ambulance>(`ambulance-tenant-${tenantId}-event-${eventId}-id-${ambulanceId}`);
    if (cachedAmbulance) {
      return cachedAmbulance;
    } else {
      const ambulance = await this.prisma.ambulance.findUnique({
        where: { id: ambulanceId, eventId },
      });
      if (!ambulance) {
        throw new NotFoundException('Ambulance not found');
      }
      await this.cacheManager.set(`ambulance-tenant-${tenantId}-event-${eventId}-id-${ambulanceId}`, ambulance);
      return ambulance;
    }
  }

  async createAmbulance(
    id: number,
    createAmbulanceDto: CreateAmbulanceDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    const newAmbulance = this.prisma.ambulance.create({
      data: {
        ...createAmbulanceDto,
        event: { connect: { id } },
      },
    });
    await this.cacheManager.reset();
    return newAmbulance;
  }

  async updateAmbulance(
    id: number,
    ambulanceId: number,
    createAmbulanceDto: CreateAmbulanceDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    const ambulance = this.prisma.ambulance.update({
      where: { id: ambulanceId },
      data: createAmbulanceDto,
    });
    await this.cacheManager.reset();
    return ambulance;
  }

  async deleteAmbulance(id: number, ambulanceId: number, tenantId: number) {
    await this.findOne(id, tenantId);
    await this.prisma.ambulance.delete({
      where: { id: ambulanceId },
    });
    await this.cacheManager.reset();
    return null;
  }

  async getHospitals(eventId: number, tenantId: number) {
    const cachedHospitals = await this.cacheManager.get<Hospital[]>(`hospitals-tenant-${tenantId}-event-${eventId}`);
    if (cachedHospitals) {
      return cachedHospitals;
    } else {
      const hospitals = await this.prisma.hospital.findMany({
        where: { eventId },
      });
      await this.cacheManager.set(`hospitals-tenant-${tenantId}-event-${eventId}`, hospitals);
      return hospitals;
    }
  }

  async getHospital(eventId: number, hospitalId: number, tenantId: number) {
    const cachedHospital = await this.cacheManager.get<Hospital>(`hospital-tenant-${tenantId}-event-${eventId}-id-${hospitalId}`);
    if (cachedHospital) {
      return cachedHospital;
    } else {
      const hospital = await this.prisma.hospital.findUnique({
        where: { id: hospitalId, eventId },
      });
      if (!hospital) {
        throw new NotFoundException('Hospital not found');
      }
      await this.cacheManager.set(`hospital-tenant-${tenantId}-event-${eventId}-id-${hospitalId}`, hospital);
      return hospital;
    }
  }

  async createHospital(
    id: number,
    createHospitalDto: CreateHospitalDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    const newHospital =  this.prisma.hospital.create({
      data: {
        ...createHospitalDto,
        event: { connect: { id } },
      },
    });
    await this.cacheManager.reset();
    return newHospital;
  }

  async updateHospital(
    id: number,
    hospitalId: number,
    createHospitalDto: CreateHospitalDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    const hospital = this.prisma.hospital.update({
      where: { id: hospitalId },
      data: createHospitalDto,
    });
    await this.cacheManager.reset();
    return hospital;
  }

  async deleteHospital(id: number, hospitalId: number, tenantId: number) {
    await this.findOne(id, tenantId);
    await this.prisma.hospital.delete({
      where: { id: hospitalId },
    });
    await this.cacheManager.reset();
  }

  async getAidPosts(eventId: number, tenantId: number) {
    const cachedAidPosts = await this.cacheManager.get<AidPost[]>(`aidposts-tenant-${tenantId}-event-${eventId}`);
    if (cachedAidPosts) {
      return cachedAidPosts;
    } else {
      await this.findOne(eventId, tenantId);
      const aidPosts = await this.prisma.aidPost.findMany({
        where: { eventId },
      });
      await this.cacheManager.set(`aidposts-tenant-${tenantId}-event-${eventId}`, aidPosts);
      return aidPosts;
    }
  }

  async getAidPost(eventId: number, aidPostId: number, tenantId: number) {
    const cachedAidPost = await this.cacheManager.get<AidPost>(`aidpost-tenant-${tenantId}-event-${eventId}-id-${aidPostId}`);
    if (cachedAidPost) {
      return cachedAidPost;
    } else {
        await this.findOne(eventId, tenantId);
        const aidPost = await this.prisma.aidPost.findUnique({
            where: { id: aidPostId, eventId },
        });
        if (!aidPost) {
            throw new NotFoundException('Aidpost not found');
        }
        await this.cacheManager.set(`aidpost-tenant-${tenantId}-event-${eventId}-id-${aidPostId}`, aidPost);
        return aidPost;
    }
  }

  async createAidPost(
    id: number,
    createAidPostDto: CreateAidPostDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    const newAidpost = await this.prisma.aidPost.create({
      data: {
        ...createAidPostDto,
        event: { connect: { id } },
      },
    });
    await this.cacheManager.reset();
    return newAidpost;
  }

  async updateAidPost(
    id: number,
    aidPostId: number,
    createAidPostDto: CreateAidPostDto,
    tenantId: number,
  ) {
    await this.findOne(id, tenantId);
    const aidpost = await this.prisma.aidPost.update({
      where: { id: aidPostId },
      data: createAidPostDto,
    });
    await this.cacheManager.reset();
    return aidpost;
  }

  async deleteAidPost(id: number, aidPostId: number, tenantId: number) {
    await this.findOne(id, tenantId);
    await this.prisma.aidPost.delete({
      where: { id: aidPostId },
    });
    await this.cacheManager.reset();
  }
}
