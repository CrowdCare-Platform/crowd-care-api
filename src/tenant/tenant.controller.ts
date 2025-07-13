import { Controller, Get, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant as TenantModel } from '@prisma/client';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async findAll(): Promise<TenantModel[]> {
    return this.tenantService.findAll();
  }

  @Get('/:domain')
  async findOne(@Param('domain') domain: string): Promise<TenantModel> {
    return this.tenantService.findOne(domain);
  }
}
