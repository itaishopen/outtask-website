import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { JobsService } from '../jobs/jobs.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyFilterDto } from './dto/vacancy-filter.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

@ApiTags('Vacancies')
@ApiBearerAuth()
@Controller('vacancies')
export class VacanciesController {
  constructor(
    private readonly vacanciesService: VacanciesService,
    private readonly jobsService: JobsService,
  ) {}

  @Get()
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'List vacancies with filters (paginated)' })
  findAll(@Query() filter: VacancyFilterDto) {
    return this.vacanciesService.findAll(filter);
  }

  @Get(':id')
  @Roles('ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Get a vacancy by ID' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Create a vacancy' })
  create(@Body() dto: CreateVacancyDto, @CurrentUser() user: AuthUser) {
    return this.vacanciesService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Update a vacancy' })
  update(@Param('id') id: string, @Body() dto: UpdateVacancyDto, @CurrentUser() user: AuthUser) {
    return this.vacanciesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vacancy (ADMIN only)' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.vacanciesService.remove(id, user.id);
  }

  @Post('sync')
  @Roles('ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Trigger sync of all job providers' })
  async sync(@CurrentUser() user: AuthUser) {
    await this.jobsService.syncAll(user.id);
    return { message: 'Sync triggered successfully' };
  }
}
