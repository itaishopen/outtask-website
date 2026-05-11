import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

@ApiTags('Job Providers')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('jobs/providers')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List all job provider configs (ADMIN only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.jobsService.findAllProviders(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job provider config by ID (ADMIN only)' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOneProvider(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a job provider config (ADMIN only)' })
  create(@Body() dto: CreateProviderDto, @CurrentUser() user: AuthUser) {
    return this.jobsService.createProvider(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job provider config (ADMIN only)' })
  update(@Param('id') id: string, @Body() dto: UpdateProviderDto, @CurrentUser() user: AuthUser) {
    return this.jobsService.updateProvider(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a job provider config (ADMIN only)' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.jobsService.removeProvider(id, user.id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Trigger sync for a specific job provider (ADMIN only)' })
  sync(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.jobsService.syncProvider(id, user.id);
  }
}
