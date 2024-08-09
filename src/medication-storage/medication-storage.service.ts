import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { CreateMedicationStorageDto } from './dto/createMedicationStorage.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

@Injectable()
export class MedicationStorageService {
  constructor(
    private prisma: PrismaService,
    private eventService: EventService,
  ) {}

  private s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  });
  async create(
    tenantId: number,
    eventId: string,
    aidPostId: string,
    rfid: string,
    file: any,
    createMedicationStorageBody: CreateMedicationStorageDto,
  ) {
    // upload image to s3
    const fileExtension = file.originalname.split('.').pop();
    const key = `${tenantId}-${eventId}-${aidPostId}-${createMedicationStorageBody.stickerCode}-${new Date().getTime()}.${fileExtension}`;
    const temp = await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_MEDICATION_STORAGE || '',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    if (temp.$metadata.httpStatusCode !== 200) {
      throw new Error('Failed to upload image');
    }
    // save data to database
    return this.prisma.medicationStorage.create({
      data: {
        rfid,
        stickerCode: createMedicationStorageBody.stickerCode,
        aidPostId: +aidPostId,
        description: createMedicationStorageBody.description,
        attachment: key,
      },
    });
  }

  async getMedicationStorageByStickerCode(
    tenantId: number,
    eventId: number,
    aidPostId: number,
    stickerCode: string,
  ) {
    const aidPostsOfEvent = await this.eventService
      .getAidPosts(eventId, tenantId)
      .then((res) => res.map((a) => a.id));
    if (!aidPostsOfEvent.includes(aidPostId)) {
      throw new Error('No access to this aid post');
    }
    const res = await this.prisma.medicationStorage.findFirst({
      where: {
        stickerCode,
        aidPostId: {
          in: aidPostsOfEvent,
        },
        active: true,
      },
    });

    if (!res) {
      return [];
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_MEDICATION_STORAGE || '',
      Key: res.attachment,
    });
    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 15 * 60,
    });
    return [{ ...res, attachmentImage: signedUrl }];
  }

  async getMedicationStorageByRfid(
    tenantId: number,
    eventId: number,
    rfid: string,
  ) {
    const aidPostsOfEvent = await this.eventService
      .getAidPosts(eventId, tenantId)
      .then((res) => res.map((a) => a.id));
    let res = await this.prisma.medicationStorage.findMany({
      where: {
        rfid,
        aidPostId: {
          in: aidPostsOfEvent,
        },
        active: true,
      },
    });

    let resWithImages: any = [...res];

    for (let i = 0; i < resWithImages.length; i++) {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_MEDICATION_STORAGE || '',
        Key: resWithImages[i].attachment,
      });
      const signedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 15 * 60,
      });
      resWithImages[i] = { ...resWithImages[i], attachmentImage: signedUrl };
    }

    return resWithImages;
  }

  async softDeleteMedicationStorage(
    tenantId: number,
    eventId: number,
    aidPostId: number,
    id: number,
  ) {
    const aidPostsOfEvent = await this.eventService
      .getAidPosts(eventId, tenantId)
      .then((res) => res.map((a) => a.id));
    if (!aidPostsOfEvent.includes(aidPostId)) {
      throw new Error('No access to this aid post');
    }
    return this.prisma.medicationStorage.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }
}
