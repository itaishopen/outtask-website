import {
  Controller, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

@ApiTags('Page Sections')
@ApiBearerAuth()
@Roles('ADMIN', 'EDITOR')
@Controller('pages/:pageId/sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a section to a page' })
  create(
    @Param('pageId') pageId: string,
    @Body() dto: CreateSectionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sectionsService.create(pageId, dto, user.id);
  }

  @Patch(':sectionId')
  @ApiOperation({ summary: 'Update a page section' })
  update(
    @Param('pageId') pageId: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sectionsService.update(pageId, sectionId, dto, user.id);
  }

  @Delete(':sectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a page section' })
  remove(
    @Param('pageId') pageId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sectionsService.remove(pageId, sectionId, user.id);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder sections within a page' })
  reorder(
    @Param('pageId') pageId: string,
    @Body() dto: ReorderSectionsDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.sectionsService.reorder(pageId, dto, user.id);
  }
}
