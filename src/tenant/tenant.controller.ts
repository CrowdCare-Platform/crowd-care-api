import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/createTenant.dto';
import { Tenant as TenantModel } from '@prisma/client';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async create(@Body() createTenantDto: CreateTenantDto): Promise<TenantModel> {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  async findAll(): Promise<TenantModel[]> {
    return this.tenantService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<TenantModel> {
    return this.tenantService.findOne(id);
  }

  @Delete('/:id')
  async delete(@Param() id: number): Promise<TenantModel> {
    return this.tenantService.delete(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() createTenantDto: CreateTenantDto,
  ): Promise<TenantModel> {
    return this.tenantService.update(id, createTenantDto);
  }
}
