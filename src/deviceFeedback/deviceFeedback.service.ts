import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewDeviceFeedbackDto } from './dto/newDeviceFeedback.dto';

@Injectable()
export class DeviceFeedbackService {
  constructor(private readonly prismaService: PrismaService) {}
  async addDeviceFeedback(
    tenantId: number,
    eventId: string,
    aidPostId: string,
    userId: string,
    payload: NewDeviceFeedbackDto,
  ) {
    const existingLog = await this.prismaService.deviceFeedback.findFirst({
      where: {
        user: payload.user,
      },
    });

    if (existingLog) {
      return this.prismaService.deviceFeedback.update({
        where: { id: existingLog.id },
        data: {
          battery: payload.battery,
          brand: payload.brand || '',
          modelName: payload.modelName || '',
          deviceName: payload.deviceName || '',
          osVersion: payload.osVersion || '',
          totalMemory: payload.totalMemory || -1,
          extraInfo: `Tenant ID: ${tenantId}, Event ID: ${eventId}, AidPost ID: ${aidPostId}, User ID: ${userId}`,
        },
      });
    } else {
      return this.prismaService.deviceFeedback.create({
        data: {
          user: payload.user,
          battery: payload.battery,
          brand: payload.brand || '',
          modelName: payload.modelName || '',
          deviceName: payload.deviceName || '',
          osVersion: payload.osVersion || '',
          totalMemory: payload.totalMemory || -1,
          extraInfo: `Tenant ID: ${tenantId}, Event ID: ${eventId}, AidPost ID: ${aidPostId}, User ID: ${userId}`,
        },
      });
    }
  }

  async deleteAllDeviceFeedback() {
    return this.prismaService.deviceFeedback.deleteMany({});
  }
}
