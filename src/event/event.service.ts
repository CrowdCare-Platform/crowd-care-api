import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
    return this.prisma.event.findUnique({
      where: { id, tenantId },
    });
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
}
