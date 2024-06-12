import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreatePatientEncounterDto } from './dto/createPatientEncounter.dto';
import { PatientEncounter as PatientEncounterModel } from '.prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';
import { QuerySearchParamsDto } from './dto/querySearchParams.dto';
import {RealTimeStatsOfEventDto} from "./dto/realTimeStatsOfEventDto";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';

@Injectable()
export class EncounterService {
  constructor(
    private prisma: PrismaService,
    private eventService: EventService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(
    eventId: number,
    aidPostId: number,
    userId: string,
    tenantId: number,
    createEncounterDto: CreatePatientEncounterDto,
  ): Promise<PatientEncounterModel> {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);

    return this.prisma.patientEncounter.create({
      data: {
        qrCode: createEncounterDto.qrCode
          ? createEncounterDto.qrCode
          : undefined,
        rfid: createEncounterDto.rfid,
        timeIn: new Date(createEncounterDto.timeIn),
        methodIn: createEncounterDto.methodIn,
        ambulanceIn: createEncounterDto.ambulanceInId
          ? {
              connect: {
                id: createEncounterDto.ambulanceInId,
              },
            }
          : undefined,
        gender: createEncounterDto.gender
          ? createEncounterDto.gender
          : undefined,
        age: createEncounterDto.age ? createEncounterDto.age : undefined,
        patientType: createEncounterDto.patientType
          ? createEncounterDto.patientType
          : undefined,
        triage: createEncounterDto.triage
          ? createEncounterDto.triage
          : undefined,
        chiefComplaint: createEncounterDto.chiefComplaint
          ? createEncounterDto.chiefComplaint
          : undefined,
        timeStartTreatment: createEncounterDto.timeStartTreatment
          ? new Date(createEncounterDto.timeStartTreatment)
          : undefined,
        timeOut: createEncounterDto.timeOut
          ? new Date(createEncounterDto.timeOut)
          : undefined,
        methodOut: createEncounterDto.methodOut
          ? createEncounterDto.methodOut
          : undefined,
        hospitalOut: createEncounterDto.hospitalOutId
          ? {
              connect: {
                id: createEncounterDto.hospitalOutId,
              },
            }
          : undefined,
        userId: userId,
        aidPost: {
          connect: {
            id: aidPostId,
          },
        },
        comments: createEncounterDto.comments
          ? createEncounterDto.comments
          : undefined,
        attachments: createEncounterDto.attachments
          ? createEncounterDto.attachments
          : [],
      },
    });
  }

  async findAll(
    query: QuerySearchParamsDto,
    tenantId: number,
  ): Promise<PatientEncounterModel[]> {
    await this.eventService.getAidPost(
      +query.eventId,
      +query.aidPostId,
      tenantId,
    );

    return this.prisma.patientEncounter.findMany({
      where: {
        aidPostId: query.aidPostId ? +query.aidPostId : undefined,
        rfid: query.rfid ? query.rfid : undefined,
        qrCode: query.qrCode ? query.qrCode : undefined,
        triage: query.triage ? query.triage : undefined,
      },
      orderBy: { timeIn: 'asc' },
    });
  }

  async findOne(
    eventId: number,
    aidPostId: number,
    tenantId: number,
    id: number,
  ): Promise<PatientEncounterModel> {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);

    const encounter = await this.prisma.patientEncounter.findUnique({
      where: {
        id: id,
      },
    });

    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }
    return encounter;
  }

  async update(
    eventId: number,
    aidPostId: number,
    tenantId: number,
    id: number,
    createEncounterDto: CreatePatientEncounterDto,
  ): Promise<PatientEncounterModel> {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);

    return this.prisma.patientEncounter.update({
      where: {
        id: id,
      },
      data: {
        qrCode: createEncounterDto.qrCode
          ? createEncounterDto.qrCode
          : undefined,
        rfid: createEncounterDto.rfid,
        timeIn: new Date(createEncounterDto.timeIn),
        methodIn: createEncounterDto.methodIn,
        ambulanceIn: createEncounterDto.ambulanceInId
          ? {
              connect: {
                id: createEncounterDto.ambulanceInId,
              },
            }
          : undefined,
        gender: createEncounterDto.gender
          ? createEncounterDto.gender
          : undefined,
        age: createEncounterDto.age ? createEncounterDto.age : undefined,
        patientType: createEncounterDto.patientType
          ? createEncounterDto.patientType
          : undefined,
        triage: createEncounterDto.triage
          ? createEncounterDto.triage
          : undefined,
        chiefComplaint: createEncounterDto.chiefComplaint
          ? createEncounterDto.chiefComplaint
          : undefined,
        timeStartTreatment: createEncounterDto.timeStartTreatment
          ? new Date(createEncounterDto.timeStartTreatment)
          : undefined,
        timeOut: createEncounterDto.timeOut
          ? new Date(createEncounterDto.timeOut)
          : undefined,
        methodOut: createEncounterDto.methodOut
          ? createEncounterDto.methodOut
          : undefined,
        hospitalOut: createEncounterDto.hospitalOutId
          ? {
              connect: {
                id: createEncounterDto.hospitalOutId,
              },
            }
          : undefined,
        comments: createEncounterDto.comments
          ? createEncounterDto.comments
          : undefined,
        attachments: createEncounterDto.attachments
          ? createEncounterDto.attachments
          : [],
      },
    });
  }

  async delete(
    eventId: number,
    aidPostId: number,
    tenantId: number,
    id: number,
  ): Promise<PatientEncounterModel> {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);

    return this.prisma.patientEncounter.delete({
      where: {
        id: id,
      },
    });
  }

  private async calculateRealTimeStatsOfEvent(
      eventId: number,
        tenantId: number,
    ): Promise<RealTimeStatsOfEventDto[]> {
    // Step 1: Get all aid posts of the event
    const aidPosts = await this.eventService.getAidPosts(eventId, tenantId);
    const aidPostIds = aidPosts.map((aidPost) => aidPost.id);

    // Step 2: Run all groupBy queries concurrently
    const [
      redEncountersPerAidPost,
      yellowEncountersPerAidPost,
      greenEncountersPerAidPost,
      whiteEncountersPerAidPost,
      unknownEncountersPerAidPost,
      treatmentNotStartedPerAidPost,
    ] = await Promise.all([
      this.prisma.patientEncounter.groupBy({
        by: ['aidPostId'],
        where: {
          aidPostId: { in: aidPostIds },
          timeOut: null,
          triage: 'RED',
        },
        _count: { id: true },
      }),
      this.prisma.patientEncounter.groupBy({
        by: ['aidPostId'],
        where: {
          aidPostId: { in: aidPostIds },
          timeOut: null,
          triage: 'YELLOW',
        },
        _count: { id: true },
      }),
      this.prisma.patientEncounter.groupBy({
        by: ['aidPostId'],
        where: {
          aidPostId: { in: aidPostIds },
          timeOut: null,
          triage: 'GREEN',
        },
        _count: { id: true },
      }),
      this.prisma.patientEncounter.groupBy({
        by: ['aidPostId'],
        where: {
          aidPostId: { in: aidPostIds },
          timeOut: null,
          triage: 'WHITE',
        },
        _count: { id: true },
      }),
      this.prisma.patientEncounter.groupBy({
        by: ['aidPostId'],
        where: {
          aidPostId: { in: aidPostIds },
          timeOut: null,
          triage: null,
        },
        _count: { id: true },
      }),
      this.prisma.patientEncounter.groupBy({
        by: ['aidPostId'],
        where: {
          aidPostId: { in: aidPostIds },
          timeStartTreatment: null,
        },
        _count: { id: true },
      }),
    ]);

    // Step 3: Combine results
    return aidPosts.map((aidPost) => {
      const red = redEncountersPerAidPost.find((encounter) => encounter.aidPostId === aidPost.id);
      const yellow = yellowEncountersPerAidPost.find((encounter) => encounter.aidPostId === aidPost.id);
      const green = greenEncountersPerAidPost.find((encounter) => encounter.aidPostId === aidPost.id);
      const white = whiteEncountersPerAidPost.find((encounter) => encounter.aidPostId === aidPost.id);
      const unknown = unknownEncountersPerAidPost.find((encounter) => encounter.aidPostId === aidPost.id);
      const treatmentNotStarted = treatmentNotStartedPerAidPost.find((encounter) => encounter.aidPostId === aidPost.id);

      return {
        aidPostId: aidPost.id,
        RED: red ? red._count.id : 0,
        YELLOW: yellow ? yellow._count.id : 0,
        GREEN: green ? green._count.id : 0,
        WHITE: white ? white._count.id : 0,
        unknown: unknown ? unknown._count.id : 0,
        treatmentNotStarted: treatmentNotStarted ? treatmentNotStarted._count.id : 0,
      };
    });
  }

  async getRealTimeStatsOfEvent(
      eventId: number,
      tenantId: number,
  ): Promise<RealTimeStatsOfEventDto[]> {
    const cachedValue = await this.cacheManager.get<RealTimeStatsOfEventDto[]>(`realTimeStatsOfEvent-${eventId}-${tenantId}`);
    if (cachedValue) {
      return cachedValue;
    } else {
      const stats = await this.calculateRealTimeStatsOfEvent(eventId, tenantId);
      await this.cacheManager.set(`realTimeStatsOfEvent-${eventId}-${tenantId}`, stats, 60000);
      return stats;
    }
  }
}
