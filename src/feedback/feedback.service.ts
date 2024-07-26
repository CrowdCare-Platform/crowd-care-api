import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class FeedbackService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}
    async addFeedback(tenantId: number, eventId: string, aidPostId: string, userId: any, payload: any) {
        return this.prismaService.feedback.create({
            data: {
                ...payload,
                extraInfo: `Tenant ID: ${tenantId}, Event ID: ${eventId}, AidPost ID: ${aidPostId}, User ID: ${userId}`,
            },
        });
    }
}
