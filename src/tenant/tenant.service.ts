import { Injectable } from '@nestjs/common';
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

  async findOne(id: number) {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  async delete(id: number) {
    return this.prisma.tenant.delete({
      where: { id },
    });
  }

  async update(id: number, updateTenantDto: Prisma.TenantUpdateInput) {
    return this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }
}
