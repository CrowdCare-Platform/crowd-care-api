import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Tenant } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TenantService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createTenantDto: Prisma.TenantCreateInput) {
    const newTenant = await this.prisma.tenant.create({
      data: createTenantDto,
    });
    await this.cacheManager.set(`tenant-url-${newTenant.url}`, newTenant);
    await this.cacheManager.set(`tenant-id-${newTenant.id}`, newTenant);
    return newTenant;
  }

  async findAll() {
    const cachedValue = await this.cacheManager.get<Tenant[]>('allTenants');
    if (cachedValue) {
      return cachedValue;
    } else {
      const tenants = await this.prisma.tenant.findMany();
      await this.cacheManager.set('allTenants', tenants);
      return tenants;
    }
  }

  async findOne(url: string) {
    const cachedTenant = await this.cacheManager.get<Tenant>(
      `tenant-url-${url}`,
    );
    if (cachedTenant) {
      return cachedTenant;
    } else {
      const tenant = await this.prisma.tenant.findFirst({
        where: { url },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }
      await this.cacheManager.set(`tenant-url-${url}`, tenant);
      return tenant;
    }
  }

  async findOneOnId(id: number) {
    const cachedTenant = await this.cacheManager.get<Tenant>(`tenant-id-${id}`);
    if (cachedTenant) {
      return cachedTenant;
    } else {
      const tenant = await this.prisma.tenant.findFirst({
        where: { id },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }
      await this.cacheManager.set(`tenant-id-${id}`, tenant);
      return tenant;
    }
  }

  async delete(id: number) {
    const tenant = await this.prisma.tenant.delete({
      where: { id },
    });
    await this.cacheManager.reset();
  }

  async update(id: number, updateTenantDto: Prisma.TenantUpdateInput) {
    await this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
    await this.cacheManager.reset();
  }
}
