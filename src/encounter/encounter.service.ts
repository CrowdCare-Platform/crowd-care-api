import {Body, Inject, Injectable, NotFoundException, Query} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand, GetObjectCommand,
} from "@aws-sdk/client-s3";
import { CreatePatientEncounterDto } from './dto/createPatientEncounter.dto';
import { PatientEncounter as PatientEncounterModel } from '.prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';
import { QuerySearchParamsDto } from './dto/querySearchParams.dto';
import {RealTimeStatsOfEventDto} from "./dto/realTimeStatsOfEventDto";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import {CreateParameterSetDto} from "./dto/createParameterSet.dto";
import {AddTriageDto} from "./dto/addTriage.dto";
import {RegulationPayloadDto} from "./dto/regulationPayload.dto";
import {GetEncountersWithFiltersDto} from "./dto/getEncountersWithFilters.dto";
import {applyFilters} from "../utils/filter";
import {ChiefComplaint, Gender, MethodIn, MethodOut, PatientType, Prisma, TriageCategory} from "@prisma/client";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

@Injectable()
export class EncounterService {
  constructor(
    private prisma: PrismaService,
    private eventService: EventService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  private s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
    }
  });
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
        timeTriage: createEncounterDto.timeTriage,
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

  async findWithFilters(
    query: GetEncountersWithFiltersDto,
  ): Promise<PatientEncounterModel[]> {
    const { whereBuilder } = await applyFilters<Prisma.PatientEncounterWhereInput>({
      appliedFiltersInput: query,
      availableFilters: {
        qrCode: async ({filter}: {filter: string}) => {
            return {
                where: {
                  qrCode: {
                    contains: filter,
                  },
                }
            }
        },
        rfid: async ({filter}: {filter: string}) => {
          return {
            where: {
              rfid: {
                equals: filter
              }
            }
          }
        },
        startDate: async ({filter}: {filter: string}) => {
          return {
            where: {
              timeIn: {
                gte: new Date(filter)
              }
            }
          }
        },
        endDate: async ({filter}: {filter: string}) => {
          return {
            where: {
              timeOut: {
                lte: new Date(filter)
              }
            }
          }
        },
        methodIn: async ({filter}: {filter: string}) => {
          return {
            where: {
              methodIn: {
                equals: (filter as MethodIn)
              }
            }
          }
        },
        ambulanceInId: async ({filter}: {filter: string}) => {
          return {
            where: {
              ambulanceInId: {
                equals: +filter
              }
            }
          }
        },
        gender: async ({filter}: {filter: string}) => {
          return {
            where: {
              gender: {
                equals: (filter as Gender)
              }
            }
          }
        },
        patientType: async ({filter}: {filter: string}) => {
          return {
            where: {
              patientType: {
                equals: (filter as PatientType)
              }
            }
          }
        },
        triage: async ({filter}: {filter: string}) => {
          return {
            where: {
              triage: {
                equals: (filter as TriageCategory)
              }
            }
          }
        },
        chiefComplaint: async ({filter}: {filter: string}) => {
          return {
            where: {
              chiefComplaint: {
                equals: (filter as ChiefComplaint)
              }
            }
          }
        },
        methodOut: async ({filter}: {filter: string}) => {
          return {
            where: {
              methodOut: {
                equals: (filter as MethodOut)
              }
            }
          }
        },
        ambulanceOutId: async ({filter}: {filter: string}) => {
          return {
            where: {
              ambulanceOutId: {
                equals: +filter
              }
            }
          }
        },
        hospitalOutId: async ({filter}: {filter: string}) => {
          return {
            where: {
              hospitalOutId: {
                equals: +filter
              }
            }
          }
        },
        aidPostId: async ({filter}: {filter: string}) => {
          return {
            where: {
              aidPostId: {
                equals: +filter
              }
            }
          }
        },
      },
      defaultFilters: {
        triage: async () => {
            return Promise.resolve({
                where: {
                  triage: {
                      not: TriageCategory.WHITE
                  }
                }
            });
        }
      }
    });

    return this.prisma.patientEncounter.findMany({
      where: whereBuilder,
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
    tenantId: number,
    id: number,
  ): Promise<PatientEncounterModel> {
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

  async findActiveRfid(
      eventId: number,
      aidPostId: number,
      tenantId: number,
      rfid?: string,
      qrCode?: string,
  ): Promise<PatientEncounterModel> {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);

    if (rfid) {
      const encounter = await this.prisma.patientEncounter.findFirst({
        where: {
          rfid: rfid,
          timeOut: null,
        },
      });
      return encounter;
    } else if (qrCode) {
      const encounter = await this.prisma.patientEncounter.findFirst({
        where: {
          qrCode: qrCode,
          timeOut: null,
        },
      });
      return encounter;
    }
    return null;
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
        timeTriage: createEncounterDto.timeTriage ? new Date(createEncounterDto.timeTriage) : undefined,
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

  async getActiveRegistrationsForAidPost(
        eventId: number,
        aidPostId: number,
        tenantId: number,
    ): Promise<PatientEncounterModel[]> {
        await this.eventService.getAidPost(eventId, aidPostId, tenantId);
        return this.prisma.patientEncounter.findMany({
          where: {
              aidPostId: aidPostId,
              timeOut: null,
          },
          orderBy: { timeIn: 'asc' },
        });
    }

    async getAllEncountersForRfid(
        rfid: string,
        eventId: number,
        tenantId: number,
    ): Promise<PatientEncounterModel[]> {
      const aidPostsOfEvent = await this.eventService.getAidPosts(eventId, tenantId);
      return this.prisma.patientEncounter.findMany({
        where: {
          rfid: rfid,
          aidPostId: {
            in: aidPostsOfEvent.map((aidPost) => aidPost.id),
          }
        },
      });
    }

    async startTreatment(
        tenantId: number,
        eventId: number,
        aidPostId: number,
        encounterId?: string,
        rfid?: string,
    ) {
        await this.eventService.getAidPost(eventId, aidPostId, tenantId);
        if (encounterId) {
          return this.prisma.patientEncounter.update({
            where: {
              id: +encounterId,
            },
            data: {
              timeStartTreatment: new Date(),
            },
          });
        } else {
          return this.prisma.patientEncounter.updateMany({
            where: {
              rfid,
              timeStartTreatment: null,
            },
            data: {
              timeStartTreatment: new Date(),
            },
          });
        }
    }

  async getParameters(
      tenantId: number,
      eventId: number,
      aidPostId: number,
      code: string,
  ) {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);
    const encounterBasedOnRfid = await this.prisma.patientEncounter.findFirst({
      where: {
        rfid: code,
        aidPostId: aidPostId,
      },
    });

    if (encounterBasedOnRfid) {
      return this.prisma.parameterSet.findMany({
        where: {
          patientEncounterId: encounterBasedOnRfid.id,
        },
      });
    }
    const encounterBasedOnQrCode = await this.prisma.patientEncounter.findFirst({
      where: {
        qrCode: code,
        aidPostId: aidPostId,
      },
    });

    if (encounterBasedOnQrCode) {
      return this.prisma.parameterSet.findMany({
        where: {
          patientEncounterId: encounterBasedOnQrCode.id,
        },
      });
    }

    if (!encounterBasedOnQrCode && !encounterBasedOnRfid) {
      throw new NotFoundException('Encounter not found');
    }
  }

  async addParameters(
      tenantId: number,
      eventId: number,
      aidPostId: number,
      code: string,
      createParameterSetDto: CreateParameterSetDto,
  ) {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);
    const encounterBasedOnRfid = await this.prisma.patientEncounter.findFirst({
      where: {
        rfid: code
      },
    });

    if (encounterBasedOnRfid) {
      return this.prisma.parameterSet.create({
        data: {
          WAPA: createParameterSetDto.WAPA,
          heartRate: createParameterSetDto.heartRate,
          respiratoryRate: createParameterSetDto.respiratoryRate,
          saturation: createParameterSetDto.saturation,
          temperature: createParameterSetDto.temperature,
          bloodPressureSystolic: createParameterSetDto.bloodPressureSystolic,
          bloodPressureDiastolic: createParameterSetDto.bloodPressureDiastolic,
          patientEncounter: {
            connect: {
              id: encounterBasedOnRfid.id,
            },
          },
        }
      });
    }
    const encounterBasedOnQrCode = await this.prisma.patientEncounter.findFirst({
        where: {
            qrCode: code
        },
    });

    if (encounterBasedOnQrCode) {
      return this.prisma.parameterSet.create({
        data: {
          WAPA: createParameterSetDto.WAPA,
          heartRate: createParameterSetDto.heartRate,
          respiratoryRate: createParameterSetDto.respiratoryRate,
          saturation: createParameterSetDto.saturation,
          temperature: createParameterSetDto.temperature,
          bloodPressureSystolic: createParameterSetDto.bloodPressureSystolic,
          bloodPressureDiastolic: createParameterSetDto.bloodPressureDiastolic,
          patientEncounter: {
            connect: {
              id: encounterBasedOnQrCode.id,
            },
          },
        }
      });
    }

    if (!encounterBasedOnQrCode && !encounterBasedOnRfid) {
      throw new NotFoundException('Encounter not found');
    }
  }

  async addTriage(
      tenantId: number,
      eventId: number,
      aidPostId: number,
      rfid: string,
      triageBody: AddTriageDto,
  ) {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);
    return this.prisma.patientEncounter.updateMany({
      where: {
        rfid: rfid,
        triage: null,
      },
      data:{
        triage: triageBody.triageCategory,
        chiefComplaint: triageBody.chiefComplaint,
        timeTriage: new Date(triageBody.timeTriage),
        timeStartTreatment: triageBody.timeStartTreatment ? new Date(triageBody.timeStartTreatment) : undefined,
      }
    });
  }

  async regulation(
      tenantId: number,
      eventId: number,
      aidPostId: number,
      code: string,
      regulationPayload: RegulationPayloadDto,
  ) {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);
    const encounterBasedOnRfid = await this.prisma.patientEncounter.findFirst({
      where: {
        rfid: code,
        timeOut: null,
      },
    });

    if (encounterBasedOnRfid) {
        return this.prisma.patientEncounter.update({
            where: {
            id: encounterBasedOnRfid.id,
            },
            data: {
              methodOut: regulationPayload.methodOut,
              timeOut: new Date(regulationPayload.timeOut),
              ambulanceOutId: regulationPayload.ambulanceOutId ? regulationPayload.ambulanceOutId : undefined,
              hospitalOutId: regulationPayload.hospitalOutId ? regulationPayload.hospitalOutId : undefined,
            }
        });
    }

    const encounterBasedOnQrCode = await this.prisma.patientEncounter.findFirst({
      where: {
        qrCode: code,
        timeOut: null,
      },
    });

    if (encounterBasedOnQrCode) {
      return this.prisma.patientEncounter.update({
        where: {
          id: encounterBasedOnQrCode.id,
        },
        data: {
          methodOut: regulationPayload.methodOut,
          timeOut: new Date(regulationPayload.timeOut),
          ambulanceOutId: regulationPayload.ambulanceOutId ? regulationPayload.ambulanceOutId : undefined,
          hospitalOutId: regulationPayload.hospitalOutId ? regulationPayload.hospitalOutId : undefined,
        }
      });
    }

    if (!encounterBasedOnQrCode && !encounterBasedOnRfid) {
      throw new NotFoundException('Encounter not found');
    }

  }

  async uploadImage(
    tenantId: number,
    eventId: number,
    aidPostId: number,
    rfid: string,
    file: any,
  ) {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);
    const encounter = await this.prisma.patientEncounter.findFirst({
        where: {
            rfid: rfid,
            timeOut: null,
        },
    });
    const fileExtension = file.originalname.split('.').pop();
    const key = `${tenantId}-${eventId}-${aidPostId}-${encounter.qrCode}-${new Date().getTime()}.${fileExtension}`;
    const temp = await this.s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_PATIENT_ENCOUNTER_PHOTOS || "",
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    if (temp.$metadata.httpStatusCode !== 200) {
        throw new Error('Failed to upload image');
    }
    return this.prisma.patientEncounter.update({
      where: {
        id: encounter.id,
      },
      data: {
        attachments: {
          push: key,
        },
      },
    });
  }

  async updateNotes(
      encounterId: string,
      tenantId: number,
      eventId: number,
      noteDto: { notes: string },
  ) {
    const aidPosts = await this.eventService.getAidPosts(eventId, +tenantId);
    return this.prisma.patientEncounter.update({
      where: {
        id: +encounterId,
        aidPostId: {
          in: aidPosts.map((aidPost) => aidPost.id),
        },
      },
      data: {
        comments: noteDto.notes,
      }
    });
  }

  async downloadAttachment(
    tenantId: number,
    type: "FORM" | "IMAGE" | "MEDICATION_REGISTRATION",
    attachmentName: string,
    eventId: number,
    aidPostId: number,
  ) {
    await this.eventService.getAidPost(eventId, aidPostId, tenantId);

    const bucket = type === "FORM" ? process.env.S3_BUCKET_PATIENT_ENCOUNTER_FORMS : type === "IMAGE" ? process.env.S3_BUCKET_PATIENT_ENCOUNTER_PHOTOS : process.env.S3_BUCKET_MEDICATION_STORAGE;
    const params = {
      Bucket: bucket,
      Key: attachmentName,
    };
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3 * 60 });
    return {url: signedUrl};
  }
}
