import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}
  async create(createTenantDto: Prisma.TenantCreateInput) {
    return this.prisma.tenant.create({
      data: createTenantDto,
    });
  }

  async findAll() {
    return this.prisma.tenant.findMany();
  }

  async findOne(url: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { url },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async delete(id: number) {
    await this.prisma.tenant.delete({
      where: { id },
    });
    return null;
  }

  async update(id: number, updateTenantDto: Prisma.TenantUpdateInput) {
    return this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }
}
